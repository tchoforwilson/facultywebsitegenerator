import jwt from "jsonwebtoken";
import { promisify } from "es6-promisify";
import Faculty from "./../models/facultyModel.js";
import catchAsync from "./../utils/catchAsync.js";
import AppError from "./../utils/appError.js";

/**
 * @brief generate and sign in token, This is generated from the login account id.
 * @param {String} id
 * @returns String
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * @brief Create and send Faculty token to the Faculty
 * @param {Object} Faculty
 * @param {Integer} statusCode
 * @param {Object} res
 */
const createSendToken = (faculty, statusCode, res) => {
  const token = signToken(faculty._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  faculty.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      faculty,
    },
  });
};

/**
 * @brief Registering a new faculty
 * @data 1. name 2. email 3. university 4. password 5. passwordConfirm
 */
export const register = catchAsync(async (req, res, next) => {
  // 1. Get data
  const { name, email, university, password, passwordConfirm } = req.body;
  //2. Check if Faculty already exist in university
  const doc = await Faculty.findOne({ name, university });
  if (doc) {
    return next(
      new AppError("Faculty already exist in University, Login!!", 400)
    );
  }
  // 3. Register new faculty
  // 4. Also make role admin
  const newFaculty = await Faculty.create({
    name,
    email,
    university,
    password,
    passwordConfirm,
    role: "admin",
  });

  createSendToken(newFaculty, 201, res);
});

/**
 * @brief Login a registered faculty Faculty
 * @data 1. email 2. password
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if faculty exists && password is correct
  const faculty = await Faculty.findOne({ email }).select("+password");

  if (
    !faculty ||
    !(await faculty.correctPassword(password, faculty.password))
  ) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(faculty, 200, res);
});

/**
 * @brief Log out a login Faculty
 * @param {Request} req
 * @param {Response} res
 */
export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch {
    return next(new AppError("Invalid request token,please log in again", 400));
  }

  // 3) Check if Faculty still exists
  const currentFaculty = await Faculty.findById(decoded.id);
  if (!currentFaculty) {
    return next(
      new AppError(
        "The Faculty belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if Faculty changed password after the token was issued
  if (currentFaculty.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "Faculty recently changed password! Please log in again.",
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.faculty = currentFaculty;
  res.locals.faculty = currentFaculty;
  next();
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get Faculty based on POSTed email
  const faculty = await Faculty.findOne({ email: req.body.email });
  if (!faculty) {
    return next(new AppError("There is no Faculty with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = faculty.createPasswordResetToken();
  await faculty.save({ validateBeforeSave: false });

  // 3) Send it to Faculty's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/Faculty/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: faculty.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    faculty.passwordResetToken = undefined;
    faculty.passwordResetExpires = undefined;
    await faculty.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get Faculty based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const faculty = await Faculty.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is Faculty, set the new password
  if (!faculty) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  faculty.password = req.body.password;
  faculty.passwordConfirm = req.body.passwordConfirm;
  faculty.passwordResetToken = undefined;
  faculty.passwordResetExpires = undefined;
  await faculty.save();

  // 3) Update changedPasswordAt property for the Faculty
  // 4) Log the Faculty in, send JWT
  createSendToken(faculty, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get input from user
  const { passwordCurrent, password, passwordConfirm } = req.body;
  if (!passwordCurrent) {
    return next(new AppError("Provide current password!!", 400));
  }
  if (!password) {
    return next(new AppError("Provide new password!!", 400));
  }
  if (!passwordConfirm) {
    return next(new AppError("Confirm new password!!", 400));
  }
  // 2) Get Faculty from collection
  const faculty = await Faculty.findById(req.faculty.id).select("+password");

  // 3) Check if POSTed current password is correct
  if (!(await faculty.correctPassword(passwordCurrent, faculty.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 4) If so, update password
  faculty.password = password;
  faculty.passwordConfirm = passwordConfirm;
  await faculty.save();
  // faculty.findByIdAndUpdate will NOT work as intended!

  // 5) Log faculty in, send JWT
  createSendToken(faculty, 200, res);
});

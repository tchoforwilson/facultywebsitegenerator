import multer from "multer";
import sharp from "sharp";
import Faculty from "../models/facultyModel.js";
import * as factory from "./handleFactory.js";
import catchAsync from "./../utils/catchAsync.js";
import AppError from "./../utils/appError.js";

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadFacultyImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

export const resizeFacultyImages = catchAsync(async (req, res, next) => {
  console.log(req.files.imageCover);
  // 1) Cover image
  if (req.files.imageCover && req.files.imageCover.length > 0) {
    req.body.imageCover = `faculty-${req.faculty.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/images/covers/${req.body.imageCover}`);
  }

  // 2) Images
  if (req.files.images && req.files.images.length > 0) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `faculty-${req.faculty.id}-${Date.now()}-${
          i + 1
        }.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/images/others/${filename}`);

        req.body.images.push(filename);
      })
    );
  }

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getAccount = (req, res, next) => {
  req.params.id = req.faculty.id;
  next();
};

export const updateAccount = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateAccount.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "imageCover",
    "images",
    "about",
    "description"
  );

  // 3) Update user document
  const updatedFaculty = await Faculty.findByIdAndUpdate(
    req.faculty.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      faculty: updatedFaculty,
    },
  });
});

export const deleteAccount = catchAsync(async (req, res, next) => {
  await Faculty.findByIdAndUpdate(req.faculty.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getFaculty = factory.getOne(Faculty, { path: "departments" });
export const getAllFaculty = factory.getAll(Faculty);
export const updateFaculty = factory.updateOne(Faculty);
export const deleteFaculty = factory.deleteOne(Faculty);

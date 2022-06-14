"use strict";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import slugify from "slugify";
const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Faculty name required!!"],
      trim: true,
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
      minlength: [10, "A tour name must have more or equal then 10 characters"],
    },
    slug: String,
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    contact:String,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    university: {
      type: String,
      enum: [
        "University of Bamenda",
        "University of Buea",
        "University of Douala",
        "University of Yaounde I",
        "University of Yaounde II",
        "University of Maroua",
      ],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
    },
    images: [String],
    about: {
      type: String,
    },
    facebookLink: {
      type: String,
    },
    whatsappLink: {
      type: String,
    },
    twitterLink: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
facultySchema.virtual("departments", {
  ref: "Department",
  foreignField: "faculty",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
facultySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

facultySchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

facultySchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/**
 * @brief Compare user provided password and dn encrypted password if they are correct
 * @param {String} candidatePassword -> Provided password
 * @param {String} facultyPassword -> Encrypted password
 * @returns {Boolean} TRUE if passwords are correct else FALSE
 */
facultySchema.methods.correctPassword = async function (
  candidatePassword,
  facultyPassword
) {
  return await bcrypt.compare(candidatePassword, facultyPassword);
};

facultySchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const Faculty = mongoose.model("Faculty", facultySchema);

export default Faculty;

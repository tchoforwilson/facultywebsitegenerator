import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "option name required!!"],
      trim: true,
      maxlength: [
        40,
        "A option name must have less or equal then 40 characters",
      ],
      minlength: [
        5,
        "A option name must have more or equal then 10 characters",
      ],
    },
    image: String,
    duration: {
      type: String,
      required: [true, "Program must have a duration."],
    },
    objective: {
      type: String,
    },
    skills: {
      type: String,
    },
    employment: {
      type: String,
    },
    admission: {
      type: String,
      required: [true, "Admission requirements"],
    },
    option: {
      type: mongoose.Schema.ObjectId,
      ref: "Option",
      required: [true, "Program must belong to a specialty."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
programSchema.pre(/^find/, function (next) {
  this.populate({
    path: "option",
    select: "-__v -passwordChangedAt",
  });

  next();
});

const Program = mongoose.model("Program", programSchema);

export default Program;

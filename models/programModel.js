import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "A program must have a type"],
      enum: {
        values: ["graduate", "undergraduate"],
        message: "Program is either undergraduate or graduate",
      },
    },
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
    duration: {
      type: String,
      required: [true, "Program must have a duration."],
    },
    objective: {
      type: String,
    },
    skill: {
      type: String,
    },
    employment: {
      type: String,
    },
    admission: {
      type: String,
      required: [true, "Admission requirements"],
    },
    departments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Department",
        required: [true, "Program must belong to a department."],
      },
    ],
    faculty: {
      type: mongoose.Schema.ObjectId,
      ref: "Option",
      required: [true, "Program must belong to a faculty."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
programSchema.pre(/^find/, function (next) {
  this.populate({
    path: "departments",
    select: "+name",
  });

  next();
});

const Program = mongoose.model("Program", programSchema);

export default Program;

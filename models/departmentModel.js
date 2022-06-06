import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name required!!"],
      trim: true,
      maxlength: [
        40,
        "A department name must have less or equal then 40 characters",
      ],
      minlength: [
        5,
        "A department name must have more or equal then 10 characters",
      ],
    },
    faculty: {
      type: mongoose.Schema.ObjectId,
      ref: "Faculty",
      required: [true, "Department must belong to a faculty."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
departmentSchema.virtual("options", {
  ref: "Option",
  foreignField: "department",
  localField: "_id",
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;

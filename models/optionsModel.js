import mongoose from "mongoose";
const optionSchema = new mongoose.Schema(
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
    description: { type: String },
    image: String,
    department: {
      type: mongoose.Schema.ObjectId,
      ref: "Departments",
      required: [true, "Option must belong to a department."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
optionSchema.virtual("programs", {
  ref: "Program",
  foreignField: "option",
  localField: "_id",
});

const Option = mongoose.model("Option", optionSchema);

export default Option;

import Department from "../models/departmentModel.js";
import * as factory from "./handleFactory.js";
import catchAsync from "./../utils/catchAsync.js";
import AppError from "./../utils/appError.js";

export const createDepartment = catchAsync(async (req, res, next) => {
  // 1. Get the data
  const { name, faculty } = req.body;
  // 2. Check if it already exist
  const doc = await Department.findOne({ name, faculty });
  if (doc) {
    return next(new AppError("Department already exist!!", 400));
  }
  // 3. Create a new department
  const department = await Department.createOne({ name, faculty });
  // 4. Send response
  res.status(201).json({
    status: "success",
    data: {
      data: department,
    },
  });
});

export const getDepartment = factory.getOne(Department, "Option");
export const getAllDepartment = factory.getAll(Department);
export const updateDepartment = factory.updateOne(Department);
export const deleteDepartment = factory.deleteOne(Department);

import Department from "../models/departmentModel.js";
import * as factory from "./handleFactory.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const setDepartmentFaculty = (req, res, next) => {
  if (!req.body.faculty)
    req.body.faculty = req.params.facultyId || req.faculty.id;
  next();
};

export const createDepartment = catchAsync(async (req, res, next) => {
  // 1. Get the data
  const { name, faculty } = req.body;
  // 2. Check if it already exist
  const doc = await Department.findOne({ name, faculty });
  if (doc) {
    return next(new AppError("Department already exist in faculty!!", 400));
  }
  // 3. Create a new department
  const department = await Department.create({ name, faculty });
  // 4. Send response
  res.status(201).json({
    status: "success",
    data: department,
  });
});

export const getDepartment = factory.getOne(Department, { path: "options" });
export const getAllDepartment = factory.getAll(Department);
export const updateDepartment = factory.updateOne(Department);
export const deleteDepartment = factory.deleteOne(Department);

import Option from "./../models/optionsModel.js";
import * as factory from "./handleFactory.js";
import catchAsync from "./../utils/catchAsync.js";
import AppError from "./../utils/appError.js";

export const setOptionDepartment = (req, res, next) => {
  if (!req.body.department) req.body.department = req.params.departmentId;
  next();
};

export const createOption = catchAsync(async (req, res, next) => {
  // 1. Get option name and department
  const { name, department } = req.body;
  // 2. Check if option exist in department
  const doc = await Option.findOne({ name, department });
  if (doc) {
    return next(new AppError("Option already exists in department!!!", 400));
  }

  // 3. Create option
  const option = await Option.create(req.body);
  // 4. Send response
  res.status(201).json({
    status: "success",
    data: option,
  });
});
export const getOption = factory.getOne(Option);
export const getAllOption = factory.getAll(Option);
export const updateOption = factory.updateOne(Option);
export const deleteOption = factory.deleteOne(Option);

import * as factory from "./handleFactory.js";
import Program from "./../models/programModel.js";

export const setProgramOption = (req, res, next) => {
  if (!req.body.option) req.body.option = req.params.optionId;
  next();
};

export const createProgram = factory.createOne(Program);
export const getProgram = factory.getOne(Program);
export const getAllProgram = factory.getAll(Program);
export const updateProgram = factory.updateOne(Program);
export const deleteProgram = factory.deleteOne(Program);

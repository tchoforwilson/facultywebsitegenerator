import * as factory from "./handleFactory.js";
import Program from "./../models/programModel.js";

export const setProgramFaculty = (req, res, next) => {
  if (!req.body.faculty)
    req.body.faculty = req.params.faculty || req.faculty.id;
  next();
};

export const createProgram = factory.createOne(Program);
export const getProgram = factory.getOne(Program);
export const getAllProgram = factory.getAll(Program);
export const updateProgram = factory.updateOne(Program);
export const deleteProgram = factory.deleteOne(Program);

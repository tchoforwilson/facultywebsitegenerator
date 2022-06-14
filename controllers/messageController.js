import Message from "../models/MessageModel.js";
import * as factory from "./handleFactory.js";

export const setMessageFaculty = (req, res, next) => {
  if (!req.body.faculty) req.body.faculty = req.params.facultyId;
  next();
};

export const createMessage = factory.createOne(Message);
export const getMessage = factory.getOne(Message);
export const getAllMessage = factory.getAll(Message);
export const updateMessage = factory.updateOne(Message);
export const deleteMessage = factory.deleteOne(Message);

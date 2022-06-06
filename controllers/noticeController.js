import Notice from "./../models/noticeModel.js";
import * as factory from "./handleFactory.js";

export const setNoticeFaculty = (req, res, next) => {
  if (!req.body.faculty)
    req.body.faculty = req.faculty.id || req.params.facultyId;
  next();
};

export const createNotice = factory.createOne(Notice);
export const getNotice = factory.getOne(Notice);
export const getAllNotice = factory.getAll(Notice);
export const updateNotice = factory.updateOne(Notice);
export const deleteNotice = factory.deleteOne(Notice);

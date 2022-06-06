import Notice from "./../models/noticeModel.js";
import factory from "./handleFactory.js";

export const createNotice = factory.createOne(Notice);
export const getNotice = factory.getOne(Notice);
export const getAllNotice = factory.getAll(Notice);
export const updateOne = factory.updateOne(Notice);
export const deleteNotice = factory.deleteOne(Notice);

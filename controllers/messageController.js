import Message from "../models/MessageModel.js";
import * as factory from "./handleFactory.js";

export const createMessage = factory.createOne(Message);
export const getMessage = factory.getOne(Message);
export const getAllMessage = factory.getAll(Message);
export const updateMessage = factory.updateOne(Message);
export const deleteMessage = factory.deleteOne(Message);

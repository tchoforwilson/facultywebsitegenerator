import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    contact: {
      type: String,
      required: [true, "Contact required!!"],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject required!!"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message required!!"],
      trim: true,
    },
    faculty: {
      type: mongoose.Schema.ObjectId,
      ref: "Faculty",
      required: [true, "message must belong to a faculty."],
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;

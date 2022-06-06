import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title required."],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, "Subject of notice required."],
    trim: true,
  },
  image: String,
  faculty: {
    type: mongoose.Schema.ObjectId,
    ref: "Faculty",
    required: [true, "Notice must belong to a faculty."],
  },
  datePosted: {
    type: Date,
    default: Date.now(),
  },
});

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;

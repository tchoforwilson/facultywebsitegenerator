import express from "express";
import * as authController from "./../controllers/authController.js";
import * as noticeController from "./../controllers/noticeController.js";
import {
  uploadSingleImage,
  resizeSingleImage,
} from "./../utils/imageUpload.js";

const router = express.Router({ mergeParams: true });

// PROTECT ALL  ROUTES AFTER THIS
router.use(authController.protect);

router
  .route("/")
  .post(
    uploadSingleImage,
    resizeSingleImage("notice", "notices"),
    noticeController.setNoticeFaculty,
    noticeController.createNotice
  )
  .get(noticeController.setNoticeFaculty, noticeController.getNotice);
router
  .route("/:id")
  .get(noticeController.getAllNotice)
  .patch(
    uploadSingleImage,
    resizeSingleImage("notice", "notices"),
    noticeController.updateNotice
  )
  .delete(noticeController.deleteNotice);

export default router;

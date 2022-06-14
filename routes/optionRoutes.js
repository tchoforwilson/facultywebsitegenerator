import express from "express";
import * as optionController from "./../controllers/optionController.js";
import { protect } from "./../controllers/authController.js";
import {
  uploadSingleImage,
  resizeSingleImage,
} from "./../utils/imageUpload.js";

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route("/")
  .post(
    uploadSingleImage,
    resizeSingleImage("option", "options"),
    optionController.setOptionDepartment,
    optionController.createOption
  )
  .get(optionController.setOptionDepartment, optionController.getAllOption);

router
  .route("/:id")
  .patch(
    uploadSingleImage,
    resizeSingleImage("option", "options"),
    optionController.updateOption
  )
  .get(optionController.getOption)
  .delete(optionController.deleteOption);

export default router;

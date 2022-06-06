import express from "express";
import * as optionController from "./../controllers/optionController.js";
import { protect } from "./../controllers/authController.js";
import programRouter from "./programRoutes.js";
import {
  uploadSingleImage,
  resizeSingleImage,
} from "./../utils/imageUpload.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(optionController.getAllOption);
router.route("/:id").get(optionController.getOption);

router.use("/:optionId/programs", programRouter);

router.use(protect);

router
  .route("/")
  .post(
    uploadSingleImage,
    resizeSingleImage("option", "options"),
    optionController.setOptionDepartment,
    optionController.createOption
  );

router
  .route("/:id")
  .patch(
    uploadSingleImage,
    resizeSingleImage("option", "options"),
    optionController.updateOption
  )
  .delete(optionController.deleteOption);

export default router;

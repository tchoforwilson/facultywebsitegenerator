import express from "express";
import * as programController from "./../controllers/programController.js";
import { protect } from "./../controllers/authController.js";
import {
  uploadSingleImage,
  resizeSingleImage,
} from "./../utils/imageUpload.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(programController.getAllProgram);
router.route("/:id").get(programController.getProgram);

router.use(protect);

router
  .route("/")
  .post(
    uploadSingleImage,
    resizeSingleImage("program", "programs"),
    programController.setProgramOption,
    programController.createProgram
  );

router
  .route("/:id")
  .patch(
    uploadSingleImage,
    resizeSingleImage("program", "programs"),
    programController.updateProgram
  )
  .delete(programController.deleteProgram);

export default router;

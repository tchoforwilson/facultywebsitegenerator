import express from "express";
import * as programController from "./../controllers/programController.js";
import { protect } from "./../controllers/authController.js";

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route("/")
  .post(programController.setProgramFaculty, programController.createProgram)
  .get(programController.setProgramFaculty, programController.getAllProgram);

router
  .route("/:id")
  .get(programController.getAllProgram)
  .patch(programController.updateProgram)
  .delete(programController.deleteProgram);

export default router;

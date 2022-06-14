import express from "express";
import * as departmentController from "./../controllers/departmentController.js";
import * as authController from "./../controllers/authController.js";
import optionRouter from "./optionRoutes.js";

const router = express.Router({ mergeParams: true });

router.use("/:departmentId/options", optionRouter);

//PROTECT ALL MIDDLEWARE AFTER THIS ROUTES
router.use(authController.protect);

router
  .route("/")
  .post(
    departmentController.setDepartmentFaculty,
    departmentController.createDepartment
  )
  .get(
    departmentController.setDepartmentFaculty,
    departmentController.getAllDepartment
  );

router
  .route("/:id")
  .patch(departmentController.updateDepartment)
  .get(departmentController.getAllDepartment)
  .delete(departmentController.deleteDepartment);

export default router;

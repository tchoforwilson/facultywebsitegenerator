import express from "express";
import * as departmentController from "./../controllers/departmentController.js";
import * as authController from "./../controllers/authController.js";
import optionRouter from "./optionRoutes.js";

const router = express.Router({ mergeParams: true });

router.use("/:departmentId/options", optionRouter);

router.route("/").get(departmentController.getAllDepartment);
router.route("/:id").get(departmentController.getDepartment);

//PROTECT ALL MIDDLEWARE AFTER THIS ROUTES
router.use(authController.protect);

router
  .route("/")
  .post(
    departmentController.setDepartmentFaculty,
    departmentController.createDepartment
  );

router
  .route("/:id")
  .patch(departmentController.updateDepartment)
  .delete(departmentController.deleteDepartment);

export default router;

import express from "express";
import * as facultyController from "./../controllers/facultyController.js";
import * as authController from "./../controllers/authController.js";
import departmentRouter from "./departmentRoutes.js";
import noticeRouter from "./noticeRoutes.js";
import messageRouter from "./messageRoutes.js";
import programRouter from "./programRoutes.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.use("/:facultyId/departments", departmentRouter);
router.use("/:facultyId/notices", noticeRouter);
router.use("/:facultyId/messages", messageRouter);
router.use("/:facultyId/programs", programRouter);

router.route("/").get(facultyController.getAllFaculty);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch("/update-account-password", authController.updatePassword);
router.get(
  "/account",
  facultyController.getAccount,
  facultyController.getFaculty
);
router.patch(
  "/update-account",
  facultyController.uploadFacultyImages,
  facultyController.resizeFacultyImages,
  facultyController.updateAccount
);

router.delete("/delete-account", facultyController.deleteAccount);

router
  .route("/:id")
  .patch(facultyController.updateFaculty)
  .delete(facultyController.deleteFaculty);

export default router;

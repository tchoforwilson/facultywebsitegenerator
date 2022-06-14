import express from "express";
import * as messageController from "./../controllers/messageController.js";
import * as authController from "./../controllers/authController.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(messageController.setMessageFaculty, messageController.createMessage);

//PROTECT ALL MIDDLEWARE AFTER THIS ROUTES
router.use(authController.protect);

router.route("/").get(messageController.getAllMessage);

router
  .route("/:id")
  .get(messageController.getMessage)
  .patch(messageController.updateMessage)
  .delete(messageController.deleteMessage);

export default router;

const express = require(`express`);
const router = express.Router();
const { auth } = require(`../../controlers`);
const { authenticate } = require(`../../helpers`);
const upload = require(`../../middlewares/avatar`);
//
router.post("/register", auth.register);
//
router.get("/verify/:verificationToken", auth.verify);
//
router.post("/verify", auth.resendVerifyEmail);
//
router.post("/login", auth.login);
//
router.get("/current", authenticate, auth.getCurrent);
//
router.get("/logout", authenticate, auth.logOut);
//
router.patch(
  "/avatars",
  authenticate,
  upload.single(`avatar`),
  auth.updateAvatar
);
//
module.exports = router;

//

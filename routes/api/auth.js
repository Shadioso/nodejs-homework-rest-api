const express = require(`express`);
const router = express.Router();
const { auth } = require(`../../controlers`);
const { authenticate } = require(`../../helpers`);

//
router.post("/register", auth.register);
//
router.post("/login", auth.login);
//
router.get("/current", authenticate, auth.getCurrent);
//
router.get("/logout", authenticate, auth.logOut);

//
module.exports = router;

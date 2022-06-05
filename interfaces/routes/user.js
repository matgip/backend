const { jwtMiddleware } = require("../../utils/jwt");

const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");

router.get("/me", jwtMiddleware, UserController.getUserInfo);
router.get("/:userId/reviews", UserController.getReviews);

router.post("/login", UserController.socialLogin);
router.post("/logout", jwtMiddleware, UserController.logout);

module.exports = router;

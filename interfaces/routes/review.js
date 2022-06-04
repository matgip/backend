const express = require("express");
const router = express.Router();

const ReviewController = require("../controllers/ReviewController");

// GET
router.get("/:agencyId/times", ReviewController.getUsersByTimeOrder);
router.get("/:agencyId/likes", ReviewController.getUsersByLikeOrder);
router.get("/:agencyId/writer/:writerId/likes", ReviewController.isUserLikeWriterReview);
router.get("/:agencyId/user/:userId", ReviewController.getReview);

// POST
router.post("/:agencyId/user", ReviewController.createReview);

// PUT
router.put("/:agencyId/writer/:writerId/likes", ReviewController.updateLikeCountOfWriter);

module.exports = router;

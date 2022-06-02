const express = require("express");
const router = express.Router();

const ReviewController = require("../controllers/ReviewController");

// GET
router.get("/:agencyId/times", ReviewController.getUsersByTimeOrder);
router.get("/:agencyId/likes", ReviewController.getUsersByLikeOrder);
router.get("/:agencyId/writers/:writerId/likes", ReviewController.isUserLikeWriterReview);
router.get("/:agencyId/users/:userId", ReviewController.getReview);

// POST
router.post("/:agencyId/users", ReviewController.createReview);

// PUT
router.put("/:agencyId/writers/:writerId/likes", ReviewController.updateLikeCountOfWriter);

module.exports = router;

const express = require("express");
const router = express.Router();

const ReviewController = require("../controllers/ReviewController");
const ReviewTimeOrderController = require("../controllers/ReviewTimeOrderController");
const ReviewUserLikeController = require("../controllers/ReviewUserLikeController");

router.get("/:agencyId/times", ReviewTimeOrderController.get);
router.get("/:agencyId/likes", ReviewUserLikeController.getUsersByLikeOrder);
router.get("/:agencyId/writers/:writerId/likes", ReviewUserLikeController.isUserLikeWriterReview);
router.put("/:agencyId/writers/:writerId/likes", ReviewUserLikeController.putUserToWriterReview);

router.get("/:agencyId/users/:userId", ReviewController.getReview);
router.post("/:agencyId/users", ReviewController.createReview);

module.exports = router;

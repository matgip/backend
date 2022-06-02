const express = require("express");
const router = express.Router();

const ReviewController = require("../controllers/ReviewController");
const ReviewTimeOrderController = require("../controllers/ReviewTimeOrderController");
const ReviewUserLikeController = require("../controllers/ReviewUserLikeController");

router.get("/:agencyId/times", ReviewTimeOrderController.get);
router.get("/:agencyId/likes", ReviewUserLikeController.getUsersByLikeOrder);
router.get("/:agencyId/writers/:writerId/likes", ReviewUserLikeController.isUserLikeWriterReview);
router.put("/:agencyId/writers/:writerId/likes", ReviewUserLikeController.putUserToWriterReview);

router.get("/:estateId/users/:userId", ReviewController.get);
router.post("/:estateId/users", ReviewController.add);

module.exports = router;

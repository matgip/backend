const express = require("express");
const router = express.Router();

const ReviewController = require("../controllers/ReviewController");
const ReviewLikesOrderController = require("../controllers/ReviewLikesOrderController");
const ReviewTimeOrderController = require("../controllers/ReviewTimeOrderController");
const ReviewUserLikeController = require("../controllers/ReviewUserLikeController");

router.get("/:estateId/users/:userId", ReviewController.get);
router.post("/:estateId/users", ReviewController.add);

router.get("/:agencyId/likes", ReviewLikesOrderController.get);
router.put("/:agencyId/likes", ReviewLikesOrderController.update);

router.get("/:id/time", ReviewTimeOrderController.get);

router.get("/:agencyId/users/:writerId/likes", ReviewUserLikeController.get);
router.put("/:agencyId/users/:writerId/likes", ReviewUserLikeController.put);

module.exports = router;

const express = require("express");
const router = express.Router();

const agencyController = require("../controllers/AgencyController");

router.get("/search", agencyController.search);
router.get("/realtime_agencies_views", agencyController.getTopHitAgencies);
router.get("/realtime_area_views", agencyController.getTopHitAreas);
router.get("/:id", agencyController.get);
router.get("/:id/views", agencyController.getViews);
router.get("/:id/likes", agencyController.getLikes);
router.post("/", agencyController.add);
router.put("/:id/likes", agencyController.putLikes);
router.put("/:id", agencyController.put);

module.exports = router;

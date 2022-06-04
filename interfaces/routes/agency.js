const express = require("express");
const router = express.Router();

const agencyController = require("../controllers/AgencyController");

router.get("/search", agencyController.search);
router.get("/realtime_agencies_views", agencyController.getTopHitAgencies);
router.get("/realtime_area_views", agencyController.getTopHitAreas);
router.get("/:agencyId", agencyController.getAgency);
router.get("/:agencyId/views", agencyController.getViews);
router.get("/:agencyId/likes", agencyController.getLikes);

// POST
router.post("/", agencyController.addAgency);

// PUT
router.put("/:agencyId/likes", agencyController.updateLikes);
router.put("/:agencyId", agencyController.updateViews);

module.exports = router;

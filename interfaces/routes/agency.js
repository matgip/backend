const express = require("express");
const router = express.Router();

const agencyController = require("../controllers/AgencyController");

router.get("/search", agencyController.search);
router.get("/realtime_agencies_views", agencyController.getTopHits);
router.get("/:id", agencyController.get);
router.get("/:id/views", agencyController.getViews);
router.post("/", agencyController.add);
router.put("/:id", agencyController.put);

module.exports = router;

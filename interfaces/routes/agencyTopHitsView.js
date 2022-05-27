const express = require("express");
const router = express.Router();

const agencyTopHitsViewController = require("../controllers/AgencyTopHitsViewController");

router.get("/", agencyTopHitsViewController.get);

module.exports = router;

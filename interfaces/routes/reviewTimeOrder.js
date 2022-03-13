const express = require("express");
const router = express.Router();

const ReviewTimeOrderController = require("../controllers/ReviewTimeOrderController");

router.put("/:id/time", ReviewTimeOrderController.add);

module.exports = router;

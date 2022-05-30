const express = require("express");
const router = express.Router();

const NewsController = require("../controllers/NewsController");
router.get("/", NewsController.get);

module.exports = router;

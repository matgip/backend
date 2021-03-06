const express = require("express");
const router = express.Router();

const UploadController = require("../controllers/UploadController");

router.get("/image", UploadController.getMarker);
router.get("/:id", UploadController.get);
router.post("/:id", UploadController.middleWare.single("file"), UploadController.sendResponse);
router.put("/:id", UploadController.update);
router.delete("/:id", UploadController.remove);

module.exports = router;

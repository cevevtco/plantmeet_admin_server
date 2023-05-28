const express = require("express");
const router = express.Router();
const activityController = require("../controller/activityController");


// activity
router.get("/", activityController.index);
router.get("/:id", activityController.activityDetail);

module.exports = router;

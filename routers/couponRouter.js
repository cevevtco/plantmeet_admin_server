const express = require("express");
const router = express.Router();
const couponController = require("../controller/couponController");



// coupon
router.get("/", couponController.index);
router.post("/", couponController.couponCreate);
router.put("/:id", couponController.couponUpdate);
router.delete("/:id", couponController.couponDelete);

//coupon_status
router.put("/status/:id", couponController.couponStatusUpdate);



module.exports = router;

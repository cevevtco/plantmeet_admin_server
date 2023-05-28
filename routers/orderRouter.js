const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");


// order
// router.get("/", orderController.index);
router.get("/", orderController.index);
router.post("/", orderController.create);
router.put("/:id", orderController.update);
router.delete("/:id", orderController.delete);


// order_status
router.get("/status/:id", orderController.status);
router.post("/status", orderController.statusCreate);
router.put("/status/:id", orderController.statusUpdate);
router.delete("/status/:id", orderController.statusDelete);



module.exports = router;

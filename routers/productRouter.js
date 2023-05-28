const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const multer = require("multer")
const { v4: uuidv4 } = require('uuid');



// product
router.get("/", productController.index);
router.post("/", productController.productCreate);
router.put("/:id", productController.productUpdate);
router.delete("/:id", productController.productDelete);


//product_type
router.get("/:product_type", productController.productType);
router.get("/:product_type/:id", productController.productTypeDetail);



// product_category
router.get("/category", productController.category);
router.post("/category", productController.categoryCreate);
router.put("/category/:id", productController.categoryUpdate);
router.delete("/category/:id", productController.categoryDelete);


// let counter = 0; //將圖片從0開始計數
var y = multer.diskStorage({
  
  destination: function (req, file, cb) {
    cb(null, "public/upload"); //第一個位置  第二個位置"upload"檔案放的資料夾
  },
  filename: function (req, file, cb) {
   
    // counter++;
    var userFileName =
    uuidv4() + "." + file.originalname.split(".")[1]; 

    cb(null, userFileName); //callback
  },

});


// 創建 multer 中間件，用於上傳和檢查文件格式
const upload = multer({
  storage: y,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png" && file.mimetype !== "image/jpg") {
      return cb(new Error("上傳的檔案類型不符合規定"));
    }
    console.log("multer success");
    cb(null, true);
  }
});


// product_image
router.get("/image", productController.image);
router.post("/imageUpload",upload.single('image'),productController.imageUpload);
router.post("/image", productController.imageCreate);
router.put('/image/:id',productController.imageUpdate);
router.delete('/image/:id', productController.imageDelete);





module.exports = router;

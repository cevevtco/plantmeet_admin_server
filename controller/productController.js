const axios = require("axios");
const productData = require("../model/productData");

module.exports = {
  index: function (req, res) {
    productData.get(req.con, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      }
      console.log(result);
      if (result.length > 0) {
        res.send(result);
      } else {
        res.send({
          err: "錯誤",
        });
      }
    });
  },

  //product
  productCreate: function (req, res) {
    productData.createProduct(req.con, req.body, function (err, result) {
      if (err) {
        res.send({
          err: err,
        })
      } else {
        res.send({productId: result})
      }
    });
  },

  productUpdate: function (req, res) {
    productData.updateProduct(
      req.con,
      req.body,
      req.params.id,
      function (err, result) {
        if (err) {
          res.send({
            err: err,
          });
        } else {
          res.send(result);
        }
      }
    );
  },

  productDelete: function (req, res) {
    productData.deleteProduct(req.con, req.params.id, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      } else {
        res.send(result);
      }
    });
  },

  //product_type 資料庫集中在product_category
  productType: function (req, res) {
    const productType = req.params.product_type;
    productData.getProductByType(req.con, productType, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      }
      console.log(result);
      if (result.length > 0) {
        res.send(result);
      } else {
        res.send({
          err: "沒有符合條件的商品",
        });
      }
    });
  },

  productTypeDetail: function (req, res) {
    const productType = req.params.product_type;
    productData.getProductByTypeDetail(
      req.con,
      productType,
      req.params.id,
      function (err, result) {
        if (err) {
          res.send({
            err: err,
          });
        }
        console.log(result);
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send({
            err: "沒有符合條件的商品",
          });
        }
      }
    );
  },

  //product_category
  category: function (req, res) {
    productData.getCategory(req.con, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      }
      console.log(result);
      if (result.length > 0) {
        res.send(result);
      } else {
        res.send({
          err: "錯誤",
        });
      }
    });
  },

  categoryCreate: function (req, res) {
    productData.createCategory(req.con, req.body, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      } else {
        res.send(result);
      }
    });
  },
  categoryUpdate: function (req, res) {
    productData.updateCategory(
      req.con,
      req.body,
      req.params.id,
      function (err, result) {
        if (err) {
          res.send({
            err: err,
          });
        } else {
          res.send(result);
        }
      }
    );
  },
  categoryDelete: function (req, res) {
    productData.deleteCategory(req.con, req.params.id, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      } else {
        res.send(result);
      }
    });
  },

  //product_image
  image: function (req, res) {
    productData.getImage(req.con, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      }
      console.log(result);
      if (result.length > 0) {
        res.send(result);
      } else {
        res.send({
          err: "錯誤",
        });
      }
    });
  },


  imageCreate: function (req, res) {
    productData.createImage(req.con, req.body, function (err, result) {
      if (err) {
        res.status(500).send({
          err: err,
        });
        
      } else {
        res.send(result);
      }
    });
  },
  

  imageUpdate: async function (req, res) {
    // console.log(req.file);
    // // console.log(req.file);
    // const imgPath = `/upload/${req.file.filename}`;
    productData.updateImage(req.con, req.body, req.params.id, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      } else {
        res.send(result);
      }
    });
  },


  imageUpload:  async function (req, res) {
    console.log(req.file);
    // console.log(req.file);
    const imgPath = `/upload/${req.file.filename}`;
    res.send({"imageUrl": imgPath});
    // productData.uploadImage(
    //   req.con,
    //   imgPath,
    //   req.params.id,
    //   function (err, result) {
    //     if (err) {
    //       res.status(500).send({ err });
    //     } else {
    //       res.send(result);
    //     }
    //   }
    // );
  },

  imageDelete: function (req, res) {
    productData.deleteImage(req.con, req.params.id, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      } else {
        res.send(result);
      }
    });
  },
};


module.exports = {
  get: function (con, callback) {
    const query = `
      SELECT 
        product.*, 
        product_category.category_name AS category_name,
        CONCAT(
          '[', 
          GROUP_CONCAT('"', product_image.image, '"' SEPARATOR ','), 
          ']'
        ) AS images
        FROM 
        product 
        INNER JOIN product_image ON product.id = product_image.productId 
        INNER JOIN product_category ON product.categoryId = product_category.id
      GROUP BY 
        product.id;
    `;
    con.query(query, callback);
  },

  //product_schema

  createProduct: function (con, data, callback) {
    console.log('data.category_name:', data.category_name);
    con.query(
      `INSERT INTO product (categoryId, name, description, content, others, qty_in_stock, price, SKU) 
      VALUES ((SELECT id FROM product_category WHERE category_name = ?),
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )`,
      [
        data.category_name,
        data.name,
        data.description,
        data.content,
        data.others,
        data.qty_in_stock,
        data.price,
        data.SKU,
      ],
      function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          const productId = result.insertId; // 獲取新插入行的 ID
          const values = JSON.parse(data.images).map(image => [productId, image]);
          con.query(
            "INSERT INTO `product_image`(`productId`, `image`) VALUES ?",
            [values],
            function (err, result) {
              if (err) {
                callback(err, null);
              } else {
                callback(null, productId); 
              }
            }
          );
        }
      }
    );
  },  

  
  // updateProduct: function (con, data, id, callback) {
  //   con.query(
  //     `UPDATE product 
  //     INNER JOIN product_category ON product.categoryId = product_category.id
  //     SET product.categoryId = ?, product.name = ?, product.description = ?, product.content = ?, product.others = ?, product.qty_in_stock = ?, product.price = ?  WHERE product.id = ?`,
  //     [
  //       data.categoryId,
  //       // data.category_name,
  //       data.name,
  //       data.description,
  //       data.content,
  //       data.others,
  //       data.qty_in_stock,
  //       data.price,
  //       // data.SKU,
  //       id,
  //     ],
  //     callback
  //   );
  // },
  updateProduct: function (con, data, id, callback) {
    con.query(
      `UPDATE product 
      SET categoryId = (
        SELECT id FROM product_category WHERE category_name = ?
      ), name = ?, description = ?, content = ?, others = ?, qty_in_stock = ?, price = ?
      WHERE id = ?`,
      [
        data.category_name,
        data.name,
        data.description,
        data.content,
        data.others,
        data.qty_in_stock,
        data.price,
        id,
      ],
      callback
    );
  },

  deleteProduct: function (con, id, callback) {
    con.query("DELETE FROM `product` WHERE id = ?", [id], callback);
  },

  // //product_type_schema
  // getType: function (con, callback) {
  //   con.query("SELECT * FROM product_type", callback);
  // },

  //getProductByType
  getProductByType: function (con, productType, callback) {
    con.query(
      `
      SELECT product.*,
      product_category.category_name,
      CONCAT(
        '[', 
        GROUP_CONCAT('"', product_image.image, '"' SEPARATOR ','), 
        ']'
      ) AS images
      FROM product
      INNER JOIN product_category ON product.categoryId = product_category.id
      LEFT JOIN product_image ON product.id = product_image.productId
      WHERE product_category.product_type = ?
      GROUP BY 
      product.id;
    `,
      [productType],
      callback
    );
  },

  getProductByTypeDetail: function (con, productType, id, callback) {
    con.query(
      `
      SELECT product.*,
      product_category.category_name,
      CONCAT(
        '[', 
        GROUP_CONCAT('"', product_image.image, '"' SEPARATOR ','), 
        ']'
      ) AS images
      FROM product
      INNER JOIN product_category ON product.categoryId = product_category.id
      LEFT JOIN product_image ON product.id = product_image.productId
      WHERE product_category.product_type = ?
      AND product.id = ?
      GROUP BY 
      product.id;
    `,
      [productType, id],
      callback
    );
  },

  //product_category_schema
  getCategory: function (con, callback) {
    con.query("SELECT * FROM product_category", callback);
  },

  createCategory: function (con, data, callback) {
    con.query(
      "INSERT INTO `product_category`(`category_name`) VALUES (?)",
      [data.name],
      callback
    );
  },
  updateCategory: function (con, data, id, callback) {
    con.query(
      "UPDATE `product_category` SET `category_name` = ? WHERE `id` = ?",
      [data.name, id],
      callback
    );
  },
  deleteCategory: function (con, id, callback) {
    con.query("DELETE FROM `product_category` WHERE id = ?", [id], callback);
  },

  // INSERT INTO `product_image` (`id`, `productId`, `image`) VALUES (NULL, '1', 'https://imgur.com/EcUUnp2');

  //product_image_schema
  getImage: function (con, callback) {
    con.query("SELECT * FROM product_image", callback);
  },

  // createImage: function (con, productId,imgPath, callback) {
  //   con.query(
  //     "INSERT INTO `product_image`(`productId`, `image`) VALUES (?, ?)",
  //     [ productId, imgPath],
  //     callback
  //   );
  // },

  createImage: function (con, productId, data, callback) {
    data.images.forEach((img) => {
      con.query(
        "INSERT INTO `product_image`(`productId`, `image`) VALUES (?, ?)",
        [productId , img],
      function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          const productId = result.insertId; // 獲取新插入行的 ID
        }
      }
      );
    });
    callback(null, productId); // 返回新插入行的 ID

  },

 

  

  updateImage: function (con, data, id, callback) {
    let err = 0;
    // 搜尋原本已存在的照片
    con.query(
      "SELECT id, image FROM `product_image` WHERE productId = ?",
      //查詢與特定 productId 相關聯的所有產品圖片
      [id],
      (error, results) => {
        // 再多加一個判斷式給新增產品，所以有一個條件是一開始還不會有productId
      
        if (error) {
          callback(error, null);
          err = 1;
        } else {
          // 更新照片
          data.images.forEach((newImage, index) => {
            //?. （optional chaining）
            const imageId = results[index]?.id;
            if (imageId) {
              // 如果原本有照片就更新
              con.query(
                "UPDATE `product_image` SET `image` = ? WHERE `id` = ?",
                [newImage, imageId],
                (error) => {
                  if (error) {
                    callback(error, null);
                    return;
                  }
                }
              );
            } else {
              // 如果沒有照片就新增
              con.query(
                "INSERT INTO `product_image`(`productId`, `image`) VALUES (?, ?)",
                [id, newImage],
                (error) => {
                  if (error) {
                    callback(error, null);
                    return;
                  }
                }
              );
            }
          });
          callback(null, id);
        }
      }
    );
  },
  


  // uploadImage: function (con,imgPath, id, callback) {
  //   con.query(
  //     "UPDATE `product_image` SET `image` = ? WHERE `id` = ?",
  //     [ imgPath, id],
  //     callback
  //   );
  // },

  deleteImage: function (con, id, callback) {
    con.query("DELETE FROM `product_image` WHERE id = ?", [id], callback);
  },
};




module.exports = {


    get: function (
      con, 
      _offset,
       _limit,
      callback
      ) {
        const offset = _offset ? ` OFFSET ${_offset}` : "";
        const limit = _limit ? ` LIMIT ${_limit}` : "";
        const query = `
          SELECT 
            coupon.id, 
            activity_name, 
            coupon_name, 
            description, 
            discount_rate, 
            DATE_FORMAT(expiry_date, '%Y-%m-%d') expiry_date, 
            min_amount, 
            use_type, 
            coupon_status,
            GROUP_CONCAT(DISTINCT IFNULL(product_category.category_name, '') SEPARATOR ', ') AS category_name
            FROM 
            coupon 
            LEFT JOIN coupon_category ON coupon.id = coupon_category.couponId
            LEFT JOIN product_category ON product_category.id = coupon_category.product_categoryId
            GROUP BY coupon.id
            ORDER BY coupon.id
            ${limit}
            ${offset};
        `;
        console.log(query);
        con.query(query, (error, results) => {
          if (error) {
            callback(error, null);
          } else {
            con.query(
              `SELECT COUNT(*) AS total_count FROM coupon
              LEFT JOIN coupon_category ON coupon.id = coupon_category.couponId
              LEFT JOIN product_category ON product_category.id = coupon_category.product_categoryId;`,
              (error, countResult) => {
                if (error) {
                  callback(error, null);
                } else {
                  const total_count = countResult[0].total_count;
                  const response = {
                    total_count,
                    coupons: results,
                  };
                  callback(null, response);
                }
              }
            );
          }
        });
      },


    createCoupon: function (con, data, callback) {
        con.query(
            `INSERT INTO coupon('activity_name','coupon_name','description','discount_rate','expiry_date','min_amount','use_type','coupon_status') 
            VALUES (?,?,?,?,?,?,?,?)`,                            
            [data.activity_name, data.coupon_name, data.description, data.discount_rate, data.expiry_date, data.min_amount, data.use_type, data.coupon_status],
                                                                    
            callback
          );
    },

    updateCoupon: function (con, data, id, callback) {
        con.query(
            `UPDATE coupon SET activity_name = ?, coupon_name = ?, description = ?, discount_rate = ?, expiry_date = ?, min_amount = ?, use_type = ?, coupon_status = ? WHERE 'id' = ?`,
            [data.activity_name, data.coupon_name, data.description, data.discount_rate, data.expiry_date, data.min_amount, data.use_type, data.coupon_status, id],
            callback
          );
    },


    deleteCoupon: function (con, id, callback) {
        con.query(`DELETE FROM coupon WHERE id = ?`, [id], callback);
    },


    updateCouponStatus: function (con, data, id, callback) {
      console.log(`UPDATE coupon 
      SET coupon_status = ?
      WHERE id = ?`)
      con.query(
        `UPDATE coupon 
         SET coupon_status = ?
         WHERE id = ?`,
        [data.status, id],
        callback
      );
    },

};
module.exports = {


  //order 訂購人姓名、訂單狀態、日期區間篩選再加上筆數限制
  // 20230519加上訂單匯總報表
  getOrders: function (
    con,
    name,
    startDate,
    endDate,
    orderStatus,
    orderReport,
    _offset,
    _limit,
    callback
  ) {
    //function命名的參數，call controller的function對應位置
    const nameString = name ? name : "";
    const dateRangeString =
      startDate && endDate
        ? ` AND DATE(order_date) BETWEEN ${startDate} AND ${endDate}`
        : "";
    const orderStatusString = orderStatus
      ? ` AND order_status.status = '${orderStatus}'`
      : "";
      const orderReportString = orderReport
      ? ` AND sales_data.data = '${orderReport}'`
      : "";
    const offset = _offset ? ` OFFSET ${_offset}` : "";
    const limit = _limit ? ` LIMIT ${_limit}` : "";
    // nameString,dateRangeString, orderStatusString, offset, limit已經判斷後被賦值傳到${dateRangeString},....
    const query = `
      SELECT shop_order.id, user.name AS username, user.email, order_no, 
      DATE_FORMAT(order_date, '%Y-%m-%d %H:%i:%s') order_date,
      order_status.status, payment_type.value, address.city, address.address_line,
      shipping_method.name, shipping_method.shipping_price, order_total, COALESCE(sales_data.data, '<default value>') AS sales_data
      FROM shop_order 
      INNER JOIN user ON shop_order.userId = user.id 
      INNER JOIN order_status ON shop_order.order_statusId = order_status.id 
      INNER JOIN payment_type ON shop_order.payment_methodId = payment_type.id 
      INNER JOIN address ON shop_order.shipping_addressId = address.id 
      INNER JOIN shipping_method ON shop_order.shipping_methodId = shipping_method.id
      LEFT JOIN sales_data ON sales_data.data = '訂單匯總報表'
      WHERE user.name LIKE '%${nameString}%'
      ${dateRangeString}
      ${orderStatusString}
      ${orderReportString}
      ORDER BY shop_order.id
      ${limit}
      ${offset};
    `;
    console.log(query);
    con.query(query, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        con.query(
          `SELECT COUNT(*) AS total_count FROM shop_order
          INNER JOIN user ON shop_order.userId = user.id 
          INNER JOIN order_status ON shop_order.order_statusId = order_status.id 
          INNER JOIN payment_type ON shop_order.payment_methodId = payment_type.id 
          INNER JOIN address ON shop_order.shipping_addressId = address.id 
          INNER JOIN shipping_method ON shop_order.shipping_methodId = shipping_method.id
          WHERE user.name LIKE '%${nameString}%'
          ${dateRangeString}
          ${orderStatusString};`,
          (error, countResult) => {
            if (error) {
              callback(error, null);
            } else {
              const total_count = countResult[0].total_count;
              const response = {
                total_count,
                orders: results,
              };
              callback(null, response);
            }
          }
        );
      }
    });
  },




  create: function (con, data, callback) {
    con.query(
      `INSERT INTO shop_order (
        userId,
        order_date,
        order_no,
        payment_methodId,
        shipping_addressId,
        shipping_methodId,
        order_total,
        order_statusId
      )
      SELECT
        ?,
        NOW(),
        CONCAT(DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(order_count + 1, 4, '0')),
        ?,
        ?,
        NULL,
        ?,
        ?
      FROM (
        SELECT COUNT(*) AS order_count
        FROM shop_order
        WHERE DATE(order_date) = CURDATE()
      ) AS temp`,
      [
        data.userId,
        data.payment_methodId,
        data.shipping_addressId,
        data.order_total,
        data.order_statusId,
      ],
      callback
    );
  },

  update: function (con, data, id, callback) {
    con.query(
      "UPDATE `shop_order` SET `payment_methodId` = ?, `shipping_addressId` = ?, `shipping_methodId` = ?, `order_total` = ?, `order_statusId` = ? WHERE `id` = ?",
      [
        data.payment_methodId,
        data.shipping_addressId,
        data.shipping_methodId,
        data.order_total,
        data.order_statusId,
        id,
      ],
      callback
    );
  },
  deleteProduct: function (con, id, callback) {
    con.query("DELETE FROM `shop_order` WHERE id = ?", [id], callback);
  },

  //order_status
  getStatus: function (con, id ,callback) {
    con.query(
      `SELECT shop_order.id, user.name AS username, user.email, order_no,
    DATE_FORMAT(order_date, '%Y-%m-%d %H:%i:%s') order_date,
    order_status.status, payment_type.value AS payment_method, address.city, address.postal_code, address.address_line,
    shipping_method.name AS shipping_method, shipping_method.shipping_price, 
    product.SKU AS product_SKU, 
    product.name AS product_name, 
    product.price AS product_price, 
    product_image.image AS product_image,
    ordered_line.qty, 
    ordered_line.price AS subtotal,
    order_total
    FROM shop_order
    INNER JOIN user ON shop_order.userId = user.id
    INNER JOIN order_status ON shop_order.order_statusId = order_status.id
    INNER JOIN payment_type ON shop_order.payment_methodId = payment_type.id
    INNER JOIN address ON shop_order.shipping_addressId = address.id
    INNER JOIN shipping_method ON shop_order.shipping_methodId = shipping_method.id
    INNER JOIN ordered_line ON shop_order.id = ordered_line.orderId
    INNER JOIN product ON ordered_line.productId = product.id
    LEFT JOIN (
      SELECT productId, MIN(id) AS id
      FROM product_image
      GROUP BY productId
    ) AS first_image ON product.id = first_image.productId
    LEFT JOIN product_image ON first_image.id = product_image.id
    WHERE shop_order.id = ?
    ORDER BY shop_order.id
    `,
    // 選擇每個product_image裡每個 productId 的最小 id，得到第一個圖片
      [id],
      callback
    );
  },

  createStatus: function (con, data, callback) {
    con.query(
      "INSERT INTO `order_status` (`status`) VALUES (?)",
      [data.status],
      callback
    );
  },
  // updateStatus: function (con, data, id, callback) {
  //   con.query(
  //     "UPDATE `order_status` SET `status` = ? WHERE `id` = ?",
  //     [data.status, id],
  //     callback
  //   );
  // },

  updateStatus: function (con, data, id, callback) {
  
    con.query(
      `UPDATE shop_order 
       SET order_statusId = (SELECT id FROM order_status WHERE status = ?)
       WHERE shop_order.id = ?`,
      [data.status, id],
      callback
    );
  },
  // UPDATE shop_order SET order_statusId = (SELECT id FROM order_status WHERE status = "已到貨") WHERE id = 1;



  deleteStatus: function (con, id, callback) {
    con.query("DELETE FROM `order_status` WHERE id= ?", [id], callback);
  },
};

const orderData = require("../model/orderData");

module.exports = {
   //order 單純獲得訂單數量
  // index: function (req, res) {
  //   orderData.get(req.con, function (err, result) {
  //     if (err) {
  //       res.send({
  //         err: err,
  //       });
  //     }
  //     console.log(result);
  //     if (result.length > 0) {
  //       res.send(result);
  //     } else {
  //       res.send({
  //         err: "錯誤",
  //       });
  //     }
  //   });
  // },

  //order 加上訂購人姓名、訂單狀態、日期區間篩選
  // index: function (req, res) {
  //   console.log(req.query);
  //   orderData.getOrders(req.con, req.query.name, req.query.startDate, req.query.endDate, req.query.orderStatus,  function (err, result) {
  //     //call傳入前端query的參數
  //     if (err) {
  //       res.send({
  //         err: err,
  //       });
  //     }
  //     // console.log(result);
  //     if (result.length > 0) {
  //       res.send(result);
  //     } else {
  //       res.send({
  //         err: "錯誤",
  //       });
  //     }
  //   });
  // },

  //order 訂購人姓名、訂單狀態、日期區間篩選再加上筆數限制
  // index: function (req, res) {
  //   console.log(req.query);
  //   // const page = parseInt(req.query.page) || 1;
  //   // const limit = parseInt(req.query.limit) || 14;
  //   orderData.getOrders(
  //     req.con,
  //     req.query.name,
  //     req.query.startDate,
  //     req.query.endDate,
  //     req.query.orderStatus,
  //     req.query.offset,
  //     req.query.limit,
  //     function (err, result) {
  //       if (err) {
  //         res.send({
  //           err: err,
  //         });
  //       } else {
  //         if (result.orders.length > 0) {
  //           res.send(result);
  //         } else {
  //           res.send({
  //             err: "沒有查詢結果",
  //           });
  //         }
  //       }
  //     }
  //   );
  // },


    //order 訂購人姓名、訂單狀態、日期區間篩選再加上筆數限制
    //20230519加上訂單匯總報表篩選
    index: function (req, res) {
      console.log(req.query);
      // const page = parseInt(req.query.page) || 1;
      // const limit = parseInt(req.query.limit) || 14;
      orderData.getOrders(
        req.con,
        req.query.name,
        req.query.startDate,
        req.query.endDate,
        req.query.orderStatus,
        req.query.orderReport,
        req.query.offset,
        req.query.limit,
        function (err, result) {
          if (err) {
            res.send({
              err: err,
            });
          } else {
            if (result.orders.length > 0) {
              res.send(result);
            } else {
              res.send({
                err: "沒有查詢結果",
              });
            }
          }
        }
      );
    },

  create: function (req, res) {
    orderData.create(req.con, req.body, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      } else {
        res.send(result);
      }
    });
  },
  update: function (req, res) {
    orderData.update(req.con, req.body, req.params.id, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      } else {
        res.send(result);
      }
    });
  },
  delete: function (req, res) {
    orderData.delete(req.con, req.params.id, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      } else {
        res.send(result);
      }
    });
  },

  //order_status
  status: function (req, res) {
    console.log(req.params.id);
    orderData.getStatus(req.con, req.params.id, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
        return;
      }
      if (result.length > 0) {
        res.send(result);
        // const res = JSON.parse(JSON.stringify(result[0]));
      } else {
        res.send({
          err: "錯誤",
        });
      }
    });
  },
  statusCreate: function (req, res) {
    orderData.createStatus(req.con, req.body, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      } else {
        res.send(result);
      }
    });
  },
  statusUpdate: function (req, res) {
    console.log(req.body);
    console.log(req.params.id);
    orderData.updateStatus(
      req.con,
      req.body,
      req.params.id,
      function (err, result) {
        if (err) {
          res.send({
            err: err,
          });
          return;
        } else {
          res.send(result);
        }
      }
    );
  },

 
  statusDelete: function (req, res) {
    orderData.deleteStatus(req.con, req.params.id, function (err, result) {
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

const couponData = require("../model/couponData");

module.exports = {
  index: function (req, res) {
    console.log(req.query);
    couponData.get(
      req.con,
      req.query.offset,
      req.query.limit,   
      function (err, result) {
        if (err) {
          res.send({
            err: err,
          });
        } else {
          if (result.coupons.length > 0) {
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
 

  couponCreate: function (req, res) {
    couponData.createCoupon(req.con, req.body, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      } else {
        res.send({ couponId: result });
      }
    });
  },

  couponUpdate: function (req, res) {
      couponData.updateCoupon(
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
      )
  },

  couponDelete: function (req, res) {
    couponData.deleteCoupon(req.con, req.params.id, function (err, result) {
        if (err) {
          res.send({
            err: err,
          });
        } else {
          res.send(result);
        }
      });
  },

  couponStatusUpdate: function (req, res) {
    console.log(req.body);
    console.log(req.params.id);
    couponData.updateCouponStatus(
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



};

const userData = require("../model/userData");
const jwt = require("jsonwebtoken");

module.exports = {
  index: function (req, res) {
    userData.get(req.con, function (err, result) {
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

  login: function (req, res) {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };

    // 在使用者資料庫中找有特定電子郵件和密碼的使用者
    userData.findByEmailAndPassword(req.con, data, function (err, user) {
      if (err) {
        res.send({
          err: err,
        });
        return;
      }

      if (user.length > 0) {
        // res.send({
        //   message: "登入成功",
        //   id: user[0].id,
        // });
          const id = user[0].id;
          const email = user[0].email;
          const name = user[0].name;
          const token = jwt.sign({id, email, name}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_DAY,
          })
          //jwt.sign(payload, secretOrPrivateKey, [options, callback])
          

           res.json({
             auth: true,
             token: token,
             id: id,
             expiresIn: new Date(Date.now() + 3600 * 1000),
           })

        // 檢查使用者輸入的電子郵件和密碼是否與資料庫中的記錄匹配
        // if (user.email === data.email && user.password === data.password) {
        // 存儲使用者ID在物件中
        // req.session.user_id = user[0].id;

        // 取得使用者的登入時間
        const now = new Date(Date.now());
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const loginTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        // 存入 session 物件
        req.session.last_date_signin = loginTime;

        // 更新資料庫登入時間
        const updateData = {
          last_date_signin: loginTime,
        };
        userData.updateLastDateSignin(
          req.con,
          updateData,
          user[0].id,
          function (err, result) {
            if (err) {
              // res.send({
              //   err: err,
              // });
            }

            if (result.affectedRows > 0) {
              // res.send({
              //   message: "登入成功",
              //   last_date_signin: loginTime,
              // });
            } else {
              // res.send({
              //   err: "更新失敗",
              // });
            }
          }
        );
      } else {
        res.send({
          err: "信箱或密碼錯誤",
        });
      }
    });
  },


  isAuth: function(req, res) {
    if (req.userId) {
      res.send({
        message: "登入成功",
        id: req.userId,
        email: req.email,
        name: req.name,
      });
    } else {
      res.send({
        message: "登入失敗",
      });
    }
  },

  userCreate: function (req, res) {
    productData.createUser(req.con, req.body, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      } else {
        res.send(result);
      }
    });
  },

  userUpdate: function (req, res) {
    console.log(req.body);
    userData.updateUser(
      req.con,
      req.body,
      req.params.id,
      function (err, result) {

        // 檢查使用者輸入的密碼是否與資料庫中的記錄匹配
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

  userDelete: function (req, res) {
    productData.deleteUser(req.con, req.params.id, function (err, result) {
      if (err) {
        res.send({
          err: err,
        });
      } else {
        res.send(result);
      }
    });
  },

  //user_type
  type: function (req, res) {
    userData.getUserType(req.con, function (err, result) {
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
};



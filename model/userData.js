module.exports = {
  get: function (con, callback) {
    con.query(
      `SELECT 
        id,
        email,
        name,
        phone,
        DATE_FORMAT(create_date, '%Y-%m-%d %H:%i:%s') create_date,
        DATE_FORMAT(last_date_signin, '%Y-%m-%d %H:%i:%s') last_date_signin,
        user_image FROM user;`,
      callback
    );
 
  },

  //user
  findByEmailAndPassword: function (con, data, callback) {
    con.query(
      "SELECT * FROM user WHERE email = ? AND password = ?",
      [data.email, data.password],
      callback
    );
  
  },
 

  updateLastDateSignin: function (con, data, id, callback) {
    console.log("updateLastDateSignin: id = " + id);
    con.query(
      "UPDATE user SET last_date_signin = ? WHERE id = ?",
      [data.last_date_signin, id],
      callback
    );
    console.log(data);
  },

  createUser: function (con, data, callback) {
    con.query(
      "INSERT INTO `user`(`name`,`email`,`phone`,`password`,`birthday`,`user_image`) VALUES (?,?,?,?,?,?)",
      [
        data.name,
        data.email,
        data.phone,
        data.password,
        data.birthday,
        data.user_image,
      ],
      callback
    );
  },
  updateUser: function (con, data, id, callback) {
    con.query(
      "UPDATE `user` SET `password` = ? WHERE `id` = ?",
      [data.password, id],
      callback
    );
  },
  
  deleteUser: function (con, id, callback) {
    con.query("DELETE FROM `user` WHERE id = ?", [id], callback);
  },

  //user_type
  getUserType: function (con, callback) {
    con.query("SELECT * FROM user_type", callback);
  },
};

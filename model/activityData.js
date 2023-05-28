module.exports = {
  get: function (con, callback) {
    con.query("SELECT * FROM activity", callback);
 
  },
  activityDetail: function (con, id, callback) {
    con.query("SELECT * FROM activity WHERE id = ?", [id], callback);
    
  }


  };
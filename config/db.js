const mysql = require("mysql");
require("dotenv").config();

//連線到資料庫
module.exports = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true, // 下多筆指令true
});

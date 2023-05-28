const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const con = require("./config/db.js");
const session = require("express-session");
const cookieParser = require('cookie-parser')



const setting = {
  origin: ["http://localhost:8080", "http://localhost:3000","http://localhost:5500"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};


//middleware
app.use(cors());
app.use(cors(setting));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: process.env.SESSION_NAME,
    resave: true,
    saveUninitialized: true,
    cookie: {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "strict",
    },
  })
);
app.use(cookieParser())




// connecting route to database
app.use(function (req, res, next) {
  req.con = con;
  next();
});

// con.connect(function (err) {
//   if (err) {
//     console.log("資料庫連線失敗", err.sqlMessage);
//   } else {
//     console.log("資料庫連線成功");
//   }
// });

// include router
const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");
const userRouter = require("./routers/userRouter");
const activityRouter = require("./routers/activityRouter");
const couponRouter = require("./routers/couponRouter");


//routes
app.use("/product", productRouter);//把productRouter的路徑設為/product
app.use("/order", orderRouter);//把orderRouter的路徑設為/order
app.use("/user", userRouter);//把userRouter的路徑設為/user
app.use("/activity", activityRouter);//把activityRouter的路徑設為/activity
app.use("/coupon", couponRouter);//把couponRouter的路徑設為/coupon
app.use(express.static("public"));


app.listen(8080, function () {
  console.log("Listening on port 8080");
});



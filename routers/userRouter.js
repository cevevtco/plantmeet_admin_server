const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const token = req.cookies["x-access-token"];
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }else{
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
               res.send({
                 auth: false,
                 message: "驗證失敗",
               })
            }else{
               req.userId = decoded.id;
               req.email = decoded.email;
               req.name = decoded.name;
               next();
            }
        })
    }
}


// user JWT認證

router.post("/login", userController.login);
router.get("/isAuth", verifyJWT, userController.isAuth);



router.get("/", userController.index);
router.post("/", userController.userCreate);
router.put("/:id", userController.userUpdate);
router.delete("/:id", userController.userDelete);

// user_type
router.get("/type", userController.type);



module.exports = router;

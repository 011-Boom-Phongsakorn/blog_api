const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

const verifyToken = (req, res, next) => {
  // รับ token
  const token = req.headers["x-access-token"];

  //   ส่ง token มาไหม
  if (!token) {
    return res.status(401).send({ message: "Token is missing" });
  }

  // verify token ถูกไหม
  jwt.verify(token, secret, (err, decoded) => {
    // ถ้า token ไม่ถูก
    // ไม่อนุญาตให้เข้าถึง
    if (err) return res.status(403).send({ message: "Access Forbidden" });
    req.username = decoded.username;
    req.authorId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken,
};

module.exports = authJwt;

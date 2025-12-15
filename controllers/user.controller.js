const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "username and password are required!",
      });
    }

    const existUser = await UserModel.findOne({ username });
    if (existUser) {
      return res.status(400).json({
        message: "username is already taken",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      username,
      password: hashedPassword,
    });

    // (ไม่ควรส่ง password กลับไป)
    res.status(201).json({ message: "register success" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1) เช็คว่ากรอกครบไหม
    if (!username || !password) {
      return res.status(400).json({
        message: "username and password are required!",
      });
    }

    // 2) หา user จาก username
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({
        message: "invalid username or password",
      });
    }

    // 3) เทียบ password ที่กรอกกับ hash ใน DB
    const isMatch = await bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      // 401 ความผิด user
      return res.status(401).json({
        message: "invalid username or password",
      });
    }

    // 4) สร้าง JWT token
    if (!secret) {
      console.error("Missing SECRET in .env");
      return res.status(500).json({ message: "Server config error" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      secret,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "Internal server error: Authentication failed" });
        }
        res.json({
          message: "Logged Successfully",
          id: user._id,
          username,
          accessToken: token,
        });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

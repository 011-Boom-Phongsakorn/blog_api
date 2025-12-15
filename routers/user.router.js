const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/user.controller");

// http://localhost:5000/api/v1/user/register
router.post("/register", register);
router.post("/login", login);

module.exports = router;

const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const PORT = 5000 || process.env.PORT;
const BASE_URL = process.env.BASE_URL;
const DB_URL = process.env.DB_URL;

const userRouter = require("./routers/user.router");
const postRouter = require("./routers/post.router");

app.use(
  cors({
    origin: BASE_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const upload = multer({ storage: multer.memoryStorage() });
// app.use(upload.single("cover"));

if (!DB_URL) {
  console.error("DB_URL is missing. Please set it in your .enf file");
} else {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
    });
}

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

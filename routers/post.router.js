const express = require("express");
const router = express.Router();

const {
  createPost,
  getAll,
  getById,
  getByAuthorId,
} = require("../controllers/post.controller");

// http://localhost:5000/api/v1/post
router.post("/", createPost);
router.get("/post-all", getAll);
router.get("/:id", getById);
router.get("/author/:id", getByAuthorId);

module.exports = router;

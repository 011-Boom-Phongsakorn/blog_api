const express = require("express");
const router = express.Router();

const {
  createPost,
  getAll,
  getById,
  getByAuthorId,
  updateById,
  deleteById,
  patchById,
} = require("../controllers/post.controller");

const { verifyToken } = require("../middlewares/authJWT.middleware");

// http://localhost:5000/api/v1/post
router.post("/", verifyToken, createPost);
router.get("/post-all", getAll);
router.get("/:id", getById);
router.get("/author/:id", getByAuthorId);
router.put("/:id", verifyToken, updateById);
router.patch("/:id", verifyToken, patchById);
router.delete("/:id", verifyToken, deleteById);

module.exports = router;

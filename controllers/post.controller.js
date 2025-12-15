const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { title, summary, content, cover, author } = req.body;
    if (!title || !summary || !content || !cover || !author) {
      return res.status(400).json({
        message: "title, summary, content, cover, author are required!!",
      });
    }

    const post = await Post.create({ title, summary, content, cover, author });
    // เช็คเพราะ จะได้ แก้บัคได้ง่าย ว่าผิดพลาดตรงไหน จะได้ไม่ต้องส่งให้ catch หมด
    if (!post) {
      return res.status(500).send({
        message: "Cannot create a new post",
      });
    }
    res.json({
      message: "Post Created Successfully.",
      post,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server error at create post", error });
  }
};

exports.getAll = async (req, res) => {
  try {
    // populate คือการ join table
    // -1 revert
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ created: -1 })
      .limit(10);
    // เอาไว้เช็ค หน้าบ้าน (อันนี้ logic)
    // if (posts.length <= 0) {
    //   res.send("no post");
    // }
    // อันนี้ ้เช็ค bug
    if (!posts) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.send(posts);
  } catch (error) {
    return res.status(500).json({ msg: "Server error at get all", error });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "Id is missing" });
    }

    const post = await Post.findById(id).populate("author", ["username"]);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.send(post);
  } catch (error) {
    return res.status(500).json({ msg: "Server error at find by id", error });
  }
};

exports.getByAuthorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "author is missing" });
    }

    const posts = await Post.find({ author: id }).populate("author", [
      "username",
    ]);
    if (!posts) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.send(posts);
  } catch (error) {
    return res.status(500).json({ msg: "Server error at find by id", error });
  }
};

exports.updatePost = async (req, res) => {};

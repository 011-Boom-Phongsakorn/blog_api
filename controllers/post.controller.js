const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { title, summary, content, cover } = req.body;
    const authorId = req.authorId;
    if (!title || !summary || !content || !cover) {
      return res.status(400).json({
        message: "title, summary, content, cover are required!!",
      });
    }

    const post = await Post.create({
      title,
      summary,
      content,
      cover,
      author: authorId,
    });
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
    return res
      .status(500)
      .json({ message: "Server error at find by id", error });
  }
};

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.authorId;
    if (!id) {
      return res.status(400).json({ message: "id and authorId are required!" });
    }

    const { title, summary, content, cover } = req.body;
    // ถ้า “ไม่มีค่าเลยสัก field เดียว” → ให้ error
    if (!title || !summary || !content || !cover) {
      return res.status(400).json({ message: "at all field is required" });
    }

    const updated = await Post.findOneAndUpdate(
      { _id: id, author: authorId },
      { title, summary, content, cover },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post Updated Successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error at update by id", error: error });
  }
};

exports.patchById = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.authorId;
    if (!id) {
      return res.status(400).json({ message: "id is required!" });
    }

    const { title, summary, content, cover } = req.body;
    // ถ้า “ไม่มีค่าเลยสัก field เดียว” → ให้ error
    if (!title && !summary && !content && !cover) {
      return res
        .status(400)
        .json({ message: "at least one field is required" });
    }

    const updated = await Post.findOneAndUpdate(
      { _id: id, author: authorId },
      { title, summary, content, cover },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Patch Updated Successfully!", result: updated });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error at update by id", error: error });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.authorId;
    if (!id) {
      return res.status(400).json({ message: "id is required!" });
    }

    const deleted = await Post.findOneAndDelete({ _id: id, author: authorId });
    if (!deleted) {
      return res.status(500).json({ message: "Can't Delete The Post" });
    }

    res.json({ message: "Post Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error at delete by id" });
  }
};

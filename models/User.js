const mongoose = require("mongoose");
const { Schema, model } = mongoose;
// กำหนด attrivute
const UserSchema = new Schema({
  username: { type: String, require: true, unique: true, min: 4 },
  password: { type: String, require: true, min: 6 },
});

// model
const UserModel = model("User", UserSchema);
module.exports = UserModel;

import { Schema, model } from "mongoose";
const userSchema = new Schema({
  email: { type: String },
  password: { type: String },
});
const User = model("user", userSchema);

export default User;

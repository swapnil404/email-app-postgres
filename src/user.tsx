import { Schema, model } from "mongoose";
const userSchema = new Schema({
  name: { type: String },
  email: { type: String },
});
const User = model("user", userSchema);

export default User;

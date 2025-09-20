import { Schema, model } from "mongoose";
const emailSchema = new Schema({
  from: { type: String },
  to: { type: String },
  subject: { type: String },
  message: { type: String },
});
const Email = model("emails", emailSchema);

export default Email;

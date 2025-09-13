import mongoose from "mongoose";
export async function connectdb() {
  try {
    console.log("connecting...");
    mongoose.connect(String(process.env.MONGODB_URL));
    console.log("connected successfully!");
  } catch (error) {
    console.log(error);
  }
}

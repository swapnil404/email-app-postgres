import { Hono } from "hono";
import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { logger } from "hono/logger";
import { connectdb } from "./config.js";
import User from "./models/user.js";
import { cors } from "hono/cors";
import Email from "./models/email.js";

dotenv.config();

const app = new Hono();

app.use(logger());

connectdb();

app.use("*", cors());

app.post("/emailSend", async (c) => {
  const emailData = await c.req.json();
  const email = new Email({
    to: emailData.to,
    from: emailData.from,
    subject: emailData.subject,
    message: emailData.message,
  });
  const newEmail = await email.save();
  return c.json({ data: newEmail });
});
app.post("/users", async (c) => {
  const userData = await c.req.json();
  const user = new User({ name: userData.name, email: userData.email });
  const newUser = await user.save();
  return c.json({ data: newUser });
});

app.get("/users", async (c) => {
  const user = await User.find();
  return c.json({ data: user });
});

app.get("/users/:id", async (c) => {
  const id = c.req.param("id");
  const user = await User.findById(id);
  return c.json({ data: user });
});

serve(app);

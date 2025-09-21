import { Hono } from "hono";
import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { logger } from "hono/logger";
import { connectdb } from "./config.js";
import { cors } from "hono/cors";
import Email from "./models/email.js";
import User from "./models/user.js";

dotenv.config();

const app = new Hono();

app.use(logger());

connectdb();

app.use("*", cors());

app.post("/register", async (c) => {
  const { email, password } = await c.req.json();
  const users = User;

  const existing = await users.findOne({ email });
  if (existing) return c.json({ error: "User already exists" }, 400);

  await users.insertOne({ email, password });
const newUser = await users.insertOne({ email, password});
return c.json({ data: newUser });
});

app.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const users = User;

  const user = await users.findOne({ email });
  if (!user) return c.json({ error: "Invalid credentials" }, 401);

  if (user.password !== password)
    return c.json({ error: "Invalid credentials" }, 401);
  return c.json({ token });
});

app.post("/emails/send", async (c) => {
  const users = User;
  const fromUserId = users.email;
  const emailData = await c.req.json();
  const email = new Email({
    type: "Sent",
    to: emailData.to,
    from: fromUserId,
    subject: emailData.subject,
    message: emailData.message,
  });
  const newEmail = await email.save();
  return c.json({ data: newEmail });
});

app.get("emails/inbox", async (c) => {
  const emails = await Email.find({ to: userId });
  return c.json({ data: emails });
});
serve(app);

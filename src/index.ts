import { Hono } from "hono";
import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { logger } from "hono/logger";
import { connectdb } from "./config.js";
import { cors } from "hono/cors";
import { jwt, sign } from "hono/jwt";

import Email from "./models/email.js";
import User from "./models/user.js";

dotenv.config();

const secret = process.env.JWT_SECRET!;

const app = new Hono();

const jwtMiddleware = jwt({
  secret,
});

app.use(logger());

connectdb();

app.use("*", cors());

app.post("/register", async (c) => {
  const { email, password } = await c.req.json();
  const users = User;
 
  const existing = await users.findOne({ email });
  if (existing) return c.json({ error: "User already exists" }, 400);

  const newUser = await users.insertOne({ email, password });
  return c.text("User registered, Please Login");
});

app.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const users = User;

  const user = await users.findOne({ email });
  if (!user) return c.json({ error: "Invalid credentials" }, 401);

  if (user.password !== password)
    return c.json({ error: "Incorrect Password" }, 401);

  const token = await sign({ sub: email }, secret);
  return c.json({ token, user });
});

app.post("/emails/send", jwtMiddleware, async (c) => {try {
  const emailData = await c.req.json();
  const payload = c.get("jwtPayload");

  const fromUserId = payload.sub;
  const email = new Email({
    to: emailData.to,
    from: fromUserId,
    subject: emailData.subject,
    message: emailData.message,
  });
  const newEmail = await email.save();
  return c.json({ data: newEmail });
} catch (err) {
  console.error("Email send error:", err);
  return c.json({ error: "Failed to send email", details: String(err) }, 500);
}
});

app.get("emails/inbox", jwtMiddleware, async (c) => {
  const payload = c.get("jwtPayload");
  const emails = await Email.find({ to: payload.sub });
  return c.json({ data: emails });
});

serve(app);

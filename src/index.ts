import { Hono } from "hono";
import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { logger } from "hono/logger";
import { connectdb } from "./config.js";
import { cors } from "hono/cors";
import { jwt, sign } from "hono/jwt";
import Email from "./models/email.js";
import User from "./models/user.js";
import bcrypt from "bcrypt";

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
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await users.insertOne({ email, password: hashedPassword });
  return c.text("User registered, Please Login");
});

app.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  const user = await User.findOne({ email });
  if (!user || !user.password)
    return c.json({ error: "Invalid credentials" }, 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return c.json({ error: "Incorrect password" }, 401);

  const token = await sign({ sub: email }, secret);
  return c.json({ token });
});

app.post("/emails/send", jwtMiddleware, async (c) => {
  try {
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
    return c.json({ error: "Failed to send email", details: String(err) }, 500);
  }
});

app.get("/emails/inbox/recieved", jwtMiddleware, async (c) => {
  const payload = c.get("jwtPayload");
  const emails = await Email.find({ to: payload.sub });
  return c.json({ data: emails });
});

app.get("/emails/inbox/sent", jwtMiddleware, async (c) => {
  const payload = c.get("jwtPayload");
  const emails = await Email.find({ from: payload.sub });
  return c.json({ data: emails });
});

app.get("/me", jwtMiddleware, async (c) => {
  const payload = c.get("jwtPayload");
  return c.json({ email: payload.sub });
});

serve(app);

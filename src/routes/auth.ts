import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import User from "../models/user.js";

const app = new Hono();

app.use("*", cors());

app.use(logger());

const auth = new Hono();

auth.post("/register", async (c) => {
  const { email, password } = await c.req.json();
  const users = User;

  const existing = await users.findOne({ email });
  if (existing) return c.json({ error: "User already exists" }, 400);

  await users.insertOne({ email, password });

  return c.json({ message: "User registered" });
});

auth.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const users = User;

  const user = await users.findOne({ email });
  if (!user) return c.json({ error: "Invalid credentials" }, 401);

  if (user.password !== password)
    return c.json({ error: "Invalid credentials" }, 401);

  /*const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  return c.json({ token });*/
});

export default auth;

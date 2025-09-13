import { Hono } from "hono";
import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { logger } from "hono/logger";
import { connectdb } from "./config.js";
import User from "./user.js";

dotenv.config();

const app = new Hono();

app.use(logger());

connectdb();

app.get("/", (c) => c.text("Hello from your Email App!"));
app.post("/user", async (c) => {
  const userData = await c.req.json();
  const user = new User({ name: userData.name, email: userData.email });
  const newUser = await user.save();
  return c.json({ data: newUser });
});

app.get("/user", async (c) => {
  const user = await User.find();
  return c.json({ data: user });
});

app.get("/user/:id", async (c) => {
  const id = c.req.param("id");
  const user = await User.findById(id);
  return c.json({ data: user });
});

serve(app);

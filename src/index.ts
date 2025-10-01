import { Hono } from "hono";
import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { logger } from "hono/logger";
import { connectdb, db } from "./config.js";
import { cors } from "hono/cors";
import { jwt, sign } from "hono/jwt";
import { users } from "./models/user.js";
import { emails } from "./models/email.js";
import { eq, desc } from "drizzle-orm";
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
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing) return c.json({ error: "User already exists" }, 400);
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.insert(users).values({ email, passwordHash: hashedPassword });
  return c.text("User registered, Please Login");
});

app.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (!user || !user.passwordHash)
    return c.json({ error: "Invalid credentials" }, 401);
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return c.json({ error: "Incorrect password" }, 401);
  const token = await sign({ sub: email }, secret);
  return c.json({ token });
});

app.post("/emails/send", jwtMiddleware, async (c) => {
  try {
    const emailData = await c.req.json();
    const payload = c.get("jwtPayload");
    const fromUserId = payload.sub as string;
    const [inserted] = await db
      .insert(emails)
      .values({
        to: emailData.to,
        from: fromUserId,
        subject: emailData.subject,
        message: emailData.message,
      })
      .returning();
    return c.json({ data: inserted });
  } catch (err) {
    return c.json({ error: "Failed to send email", details: String(err) }, 500);
  }
});

app.get("/emails/inbox/recieved", jwtMiddleware, async (c) => {
  const payload = c.get("jwtPayload");
  const data = await db
    .select()
    .from(emails)
    .where(eq(emails.to, payload.sub as string))
    .orderBy(desc(emails.createdAt));
  return c.json({ data });
});

app.get("/emails/inbox/sent", jwtMiddleware, async (c) => {
  const payload = c.get("jwtPayload");
  const data = await db
    .select()
    .from(emails)
    .where(eq(emails.from, payload.sub as string))
    .orderBy(desc(emails.createdAt));
  return c.json({ data });
});

app.get("/me", jwtMiddleware, async (c) => {
  const payload = c.get("jwtPayload");
  return c.json({ email: payload.sub });
});

serve(app);

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/models/user.ts", "./src/models/email.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});

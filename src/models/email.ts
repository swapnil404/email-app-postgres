import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  from: varchar("from", { length: 255 }).notNull(),
  to: varchar("to", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type EmailRow = typeof emails.$inferSelect;
export type NewEmailRow = typeof emails.$inferInsert;

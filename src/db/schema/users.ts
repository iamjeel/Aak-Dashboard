import { pgTable, text, timestamp, serial, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  _id: serial("_id").primaryKey(),
  role: text("role", {
    enum: ["superAdmin", "warehouseAdmin", "pharmacy"],
  }).notNull(),
  pharmacyId: integer("pharmacy_id"),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone").notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

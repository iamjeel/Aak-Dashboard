import { pgTable, text, integer, serial } from "drizzle-orm/pg-core";

export const plans = pgTable("plans", {
  _id: serial("_id").primaryKey(),
  type: text("type").notNull(),
  monthlyQuota: integer("monthly_quota").notNull(),
  price: integer("price").notNull(),
  rolloverEnabled: integer("rollover_enabled").default(0),
  rolloverLimit: integer("rollover_limit").default(0),
  expirationPolicy: text("expiration_policy").notNull(),
});

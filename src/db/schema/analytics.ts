import {
  pgTable,
  text,
  integer,
  json,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";

export const analytics = pgTable("analytics", {
  _id: serial("_id").primaryKey(),
  pharmacyId: integer("pharmacy_id").notNull(), // Foreign Key referencing Pharmacies
  dateRange: text("date_range", {
    enum: ["day", "week", "month", "year"],
  }).notNull(),
  totalDeliveries: integer("total_deliveries").default(0),
  deliveryTypesBreakdown: json("delivery_types_breakdown").notNull(),
  usedFromPunchCard: integer("used_from_punch_card").default(0),
  usedFromMembership: integer("used_from_membership").default(0),
  generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow(),
});

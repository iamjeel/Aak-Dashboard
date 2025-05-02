import { pgTable, text, integer, timestamp, serial } from "drizzle-orm/pg-core";

export const deliveryOrders = pgTable("delivery_orders", {
  _id: serial("_id").primaryKey(),
  pharmacyId: integer("pharmacy_id").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  scheduledDate: timestamp("scheduled_date", { withTimezone: true }),
  approvedBy: integer("approved_by"),
  deliveryDetails: text("delivery_details"),
  proofOfDeliveryUrl: text("proof_of_delivery_url"),
  userFrom: text("user_from").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

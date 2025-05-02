import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";

export const pharmacies = pgTable("pharmacies", {
  _id: serial("_id").primaryKey(),

  // New fields based on form
  email: text("email").notNull(),
  username: text("username").notNull(), // Updated to username
  passwordHash: text("password_hash").notNull(),
  contactName: text("contact_name").notNull(), // Updated to contact_name
  phone: text("phone").notNull(),
  timezone: text("timezone").notNull(),

  // Existing (slightly adjusted)
  pharmacyName: text("pharmacy_name").notNull(), // Renamed from 'name' to 'pharmacy_name'
  address: text("address").notNull(), // Address
  pharmacyCode: text("pharmacy_code").notNull().unique(),

  planType: text("plan_type").notNull(), // Subscription or Punch Card
  planName: text("plan_name").notNull(), // Basic / Premium etc.

  allocatedDeliveries: integer("allocated_deliveries").notNull(), // Deliveries Allocated (eg: 500)

  // Keeping old fields if needed for tracking usage
  currentCardNumber: integer("current_card_number"),
  membershipStartDate: timestamp("membership_start_date"),
  deliveriesUsedThisMonth: integer("deliveries_used_this_month").default(0),
  rolloverDeliveries: integer("rollover_deliveries").default(0),
  punchCardBalance: integer("punch_card_balance").default(0),
  membershipQuota: integer("membership_quota").default(0),
  role: text("role").default("pharmacy"),
  status: text("status").notNull(), // Active, Suspended etc.

  analytics: text("analytics"), // JSON maybe
  createdBy: integer("created_by"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

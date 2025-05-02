import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";

export const deliveryCards = pgTable("delivery_cards", {
  _id: serial("_id").primaryKey(),
  cardNumber: text("card_number").notNull(),
  type: text("type").notNull(),
  pharmacyId: integer("pharmacy_id").notNull(),
});

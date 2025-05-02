CREATE TABLE "analytics" (
	"_id" serial PRIMARY KEY NOT NULL,
	"pharmacy_id" integer NOT NULL,
	"date_range" text NOT NULL,
	"total_deliveries" integer DEFAULT 0,
	"delivery_types_breakdown" json NOT NULL,
	"used_from_punch_card" integer DEFAULT 0,
	"used_from_membership" integer DEFAULT 0,
	"generated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "delivery_cards" (
	"_id" serial PRIMARY KEY NOT NULL,
	"card_number" text NOT NULL,
	"type" text NOT NULL,
	"pharmacy_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_orders" (
	"_id" serial PRIMARY KEY NOT NULL,
	"pharmacy_id" integer NOT NULL,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"scheduled_date" timestamp with time zone,
	"approved_by" integer,
	"delivery_details" text,
	"proof_of_delivery_url" text,
	"user_from" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pharmacies" (
	"_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"contact" text,
	"pharmacy_code" text NOT NULL,
	"plan_type" text NOT NULL,
	"current_card_number" integer,
	"membership_start_date" timestamp,
	"deliveries_used_this_month" integer DEFAULT 0,
	"rollover_deliveries" integer DEFAULT 0,
	"punch_card_balance" integer DEFAULT 0,
	"membership_quota" integer DEFAULT 0,
	"status" text NOT NULL,
	"analytics" text,
	"created_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pharmacies_pharmacy_code_unique" UNIQUE("pharmacy_code")
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"_id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"monthly_quota" integer NOT NULL,
	"price" integer NOT NULL,
	"rollover_enabled" integer DEFAULT 0,
	"rollover_limit" integer DEFAULT 0,
	"expiration_policy" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"_id" serial PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"pharmacy_id" integer,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"phone" text NOT NULL,
	"last_login_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE "cart_items" (
	"id" text PRIMARY KEY,
	"cart_id" text NOT NULL,
	"product_id" integer NOT NULL,
	"variant_id" text NOT NULL,
	"color" text DEFAULT '' NOT NULL,
	"quantity" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" text PRIMARY KEY,
	"cart_id" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"location" text NOT NULL,
	"notes" text NOT NULL,
	"items" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "cart_selection" ON "cart_items" ("cart_id","product_id","variant_id","color");
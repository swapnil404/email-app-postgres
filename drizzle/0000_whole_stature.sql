CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"from" varchar(255) NOT NULL,
	"to" varchar(255) NOT NULL,
	"subject" varchar(500),
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

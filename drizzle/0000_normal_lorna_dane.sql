DO $$ BEGIN
 CREATE TYPE "public"."abte_label" AS ENUM('bug', 'feature', 'enhancement', 'documentation');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."abte_priority" AS ENUM('low', 'medium', 'high');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."abte_status" AS ENUM('todo', 'in-progress', 'done', 'canceled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "abte_tasks" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"code" varchar(256),
	"title" varchar(256),
	"status" "abte_status" DEFAULT 'todo' NOT NULL,
	"label" "abte_label" DEFAULT 'bug' NOT NULL,
	"priority" "abte_priority" DEFAULT 'low' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "abte_tasks_code_unique" UNIQUE("code")
);

CREATE TABLE "abte_User" (
	id SERIAL PRIMARY KEY,
	email VARCHAR(64),
	password VARCHAR(64)
);

CREATE TABLE "abte_charges" (
	id SERIAL PRIMARY KEY,
	rate DECIMAL(10, 2) NOT NULL,
	name VARCHAR(64) NOT NULL,
	created_at TIMESTAMP DEFAULT now() NOT NULL,
	updated_at TIMESTAMP DEFAULT current_timestamp
);
import { pgTable } from "@/db/utils"
import { sql } from "drizzle-orm"
import { timestamp, serial, varchar, integer } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

export const users = pgTable("User", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 64 }),
  password: varchar("password", { length: 64 }),
});

export const tasks = pgTable("tasks", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  code: varchar("code", { length: 128 }).notNull().unique(),
  description: varchar("description", { length: 128 }),
  status: varchar("status", {
    length: 30,
    enum: ["todo", "in-progress", "done", "canceled"],
  })
    .notNull()
    .default("todo"),
  label: varchar("label", {
    length: 30,
    enum: ["bug", "feature", "enhancement", "documentation"],
  })
    .notNull()
    .default("bug"),
  priority: varchar("priority", {
    length: 30,
    enum: ["low", "medium", "high"],
  })
    .notNull()
    .default("low"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
  
  height: integer("height").notNull().default(0),
  width: integer("width").notNull().default(0),
  length: integer("length").notNull().default(0),
  weight: integer("weight").notNull().default(0),
  volume: integer("volume").notNull().default(0),
  price: integer("price").notNull().default(0),
  
  invoice_url: varchar("invoice_url", { length: 256 }),
})

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert

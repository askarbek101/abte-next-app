import { pgTable, serial, text, varchar, integer, numeric, timestamp, pgEnum, uuid } from 'drizzle-orm/pg-core';

// Enums
export const DeliveryTypeEnum = pgEnum('delivery_type', ['door_to_terminal', 'door_to_door']);
export const StatusEnum = pgEnum('status', ['done', 'in_progress', 'todo', 'cancelled']);
export const PriorityEnum = pgEnum('priority', ['low', 'medium', 'high']);
export const RoleEnum = pgEnum('role', ['admin', 'user']);
export const LabelEnum = pgEnum('label', ['bug', 'feature', 'enhancement', 'documentation']);

// Tables
export const CityTable = pgTable('city', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
});

export const SenderTable = pgTable('sender', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  address: text('address').notNull(),
  role: RoleEnum('role').notNull(),
  password: varchar('password', { length: 255 }).notNull(),
});

export const PayerTable = pgTable('payer', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  address: text('address').notNull(),
  role: RoleEnum('role').notNull(),
  bin: varchar('bin', { length: 50 }).notNull(),
  abte_id: varchar('abte_id', { length: 50 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
});

export const RecipientTable = pgTable('recipient', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  address: text('address').notNull(),
  role: RoleEnum('role').notNull(),
  password: varchar('password', { length: 255 }).notNull(),
});

export const TaskTable = pgTable('task', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 100 }).notNull().unique(),
  description: text('description').notNull(),
  invoice_url: varchar('invoice_url', { length: 255 }).notNull(),
  label: LabelEnum('label').notNull(),
  status: StatusEnum('status').notNull(),
  priority: PriorityEnum('priority').notNull(),
  volume: numeric('volume').notNull(),
  height: numeric('height').notNull(),
  width: numeric('width').notNull() ,
  length: numeric('length').notNull(),
  weight: numeric('weight').notNull(),
  price: numeric('price').notNull(),
  from: uuid('from').notNull().references(() => CityTable.id),
  to: uuid('to').notNull().references(() => CityTable.id),
  delivery_type: DeliveryTypeEnum('delivery_type').notNull(),
  payer: uuid('payer').notNull().references(() => PayerTable.id),
  recipient: uuid('recipient').notNull().references(() => RecipientTable.id),
  sender: uuid('sender').notNull().references(() => SenderTable.id),
  insurance_cost: numeric('insurance_cost').notNull(),
  number_of_packages: integer('number_of_packages').notNull(),
  value_of_goods: numeric('value_of_goods').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export type TaskTableInsert = typeof TaskTable.$inferInsert;
export type TaskTableSelect = typeof TaskTable.$inferSelect;

export type RecipientTableInsert = typeof RecipientTable.$inferInsert;
export type RecipientTableSelect = Omit<typeof RecipientTable.$inferSelect, 'password'>

export type PayerTableInsert = typeof PayerTable.$inferInsert;
export type PayerTableSelect = Omit<typeof PayerTable.$inferSelect, 'password'>

export type SenderTableInsert = typeof SenderTable.$inferInsert;
export type SenderTableSelect = Omit<typeof SenderTable.$inferSelect, 'password'>

export type CityTableInsert = typeof CityTable.$inferInsert;
export type CityTableSelect = typeof CityTable.$inferSelect;


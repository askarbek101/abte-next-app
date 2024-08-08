import * as z from 'zod';
import { DeliveryTypeEnum, StatusEnum, PriorityEnum, RoleEnum, LabelEnum } from '@/db/schema';

// Search Parameters Schema
export const searchParamsSchema = z.object({
  code: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  id: z.string().optional(),
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  description: z.string().optional(),
  invoice_url: z.string().optional(),
  status: z.enum(StatusEnum.enumValues).optional(),
  priority: z.enum(PriorityEnum.enumValues).optional(),
  height: z.number().optional(),
  width: z.number().optional(),
  length: z.number().optional(),
  weight: z.number().optional(),
  volume: z.number().optional(),
  price: z.number().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
});

// Create Task Schema
export const createTaskSchema = z.object({
  description: z.string(),
  invoice_url: z.string(),
  label: z.enum(LabelEnum.enumValues),
  status: z.enum(StatusEnum.enumValues),
  priority: z.enum(PriorityEnum.enumValues),
  volume: z.number(),
  height: z.number(),
  width: z.number(),
  length: z.number(),
  weight: z.number(),
  price: z.number(),
  from: z.string(),
  to: z.string(),
  delivery_type: z.enum(DeliveryTypeEnum.enumValues),
  payer: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    role: z.enum(RoleEnum.enumValues),
    bin: z.string(),
    abte_id: z.string(),
  }),
  recipient: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    role: z.enum(RoleEnum.enumValues),
  }),
  sender: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    role: z.enum(RoleEnum.enumValues),
  }),
  insurance_cost: z.number(),
  number_of_packages: z.number(),
  value_of_goods: z.number(),
});


// Update Task Schema
export const updateTaskSchema = z.object({
  description: z.string(),
  invoice_url: z.string(),
  label: z.enum(LabelEnum.enumValues),
  status: z.enum(StatusEnum.enumValues),
  priority: z.enum(PriorityEnum.enumValues),
  volume: z.number(),
  height: z.number(),
  width: z.number(),
  length: z.number(),
  weight: z.number(),
  price: z.number(),
  from: z.string(),
  to: z.string(),
  delivery_type: z.enum(DeliveryTypeEnum.enumValues),
  payer: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    role: z.enum(RoleEnum.enumValues),
    bin: z.string(),
    abte_id: z.string(),
  }),
  recipient: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    role: z.enum(RoleEnum.enumValues),
  }),
  sender: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    role: z.enum(RoleEnum.enumValues),
  }),
  insurance_cost: z.number(),
  number_of_packages: z.number(),
  value_of_goods: z.number(),
});


export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
export type GetTasksSchema = z.infer<typeof getTasksSchema>;

export const getTasksSchema = searchParamsSchema;

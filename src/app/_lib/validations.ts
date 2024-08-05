import { tasks } from "@/db/schema"
import { use } from "react"
import * as z from "zod"

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
  length: z.number().optional(),
  weight: z.number().optional(),
  volume: z.number().optional(),
  price: z.number().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const getTasksSchema = searchParamsSchema

export type GetTasksSchema = z.infer<typeof getTasksSchema>

export const createTaskSchema = z.object({
  description: z.string(),
  label: z.enum(tasks.label.enumValues),
  status: z.enum(tasks.status.enumValues),
  priority: z.enum(tasks.priority.enumValues),
  volume: z.number().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
  length: z.number().optional(),
  weight: z.number().optional(),
  price: z.number().optional(),
})

export type CreateTaskSchema = z.infer<typeof createTaskSchema>

export const updateTaskSchema = z.object({
  description: z.string(),
  label: z.enum(tasks.label.enumValues),
  status: z.enum(tasks.status.enumValues),
  priority: z.enum(tasks.priority.enumValues),
  volume: z.number().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
  length: z.number().optional(),
  weight: z.number().optional(),
  price: z.number().optional(),
})

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>

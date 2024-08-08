import { TaskTable } from "@/db/schema"
import { Task } from "@/types/core"
import { faker } from "@faker-js/faker"
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"
import { customAlphabet } from "nanoid"

import { generateId } from "@/lib/id"
import { KeyValuePair } from "tailwindcss/types/config"
import { CreateTaskSchema } from "./validations"


export function CreateTaskBySchema(input: CreateTaskSchema): Task {
  const code = `TASK-${customAlphabet("0123456789", 4)()}`;
  return {
    id: generateId(),
    code: code,
    description: input.description,
    invoice_url: input.invoice_url,
    label: input.label,
    status: input.status,
    priority: input.priority,
    volume: input.volume,
    height: input.height,
    width: input.width,
    length: input.length,
    weight: input.weight,
    price: input.price,
    from: input.from,
    to: input.to,
    delivery_type: input.delivery_type,
    payer: input.payer,
    recipient: input.recipient,
    sender: input.sender,
    insurance_cost: input.insurance_cost,
    number_of_packages: input.number_of_packages,
    value_of_goods: input.value_of_goods,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
export function getStatusIcon(status: Task["status"]) {
  const statusIcons : KeyValuePair<string, React.ComponentType> = {
    'canceled': CrossCircledIcon,
    'done': CheckCircledIcon,
    "in-progress": StopwatchIcon,
    'todo': QuestionMarkCircledIcon,
  }

  return statusIcons[status] || CircleIcon
}

/**
 * Returns the appropriate priority icon based on the provided priority.
 * @param priority - The priority of the task.
 * @returns A React component representing the priority icon.
 */
export function getPriorityIcon(priority: Task["priority"]) {
  const priorityIcons = {
    high: ArrowUpIcon,
    low: ArrowDownIcon,
    medium: ArrowRightIcon,
  }

  return priorityIcons[priority] || CircleIcon
}

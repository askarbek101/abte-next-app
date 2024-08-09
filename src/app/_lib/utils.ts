import { DeliveryType, Label, Priority, Role, Status, Task } from "@/types/core"
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

import { KeyValuePair } from "tailwindcss/types/config"


export function getLabel(label: string) {
  switch (label) {
      case "bug":
          return Label.BUG
      case "feature":
          return Label.FEATURE
      case "enhancement":
          return Label.ENHANCEMENT
      case "documentation":
          return Label.DOCUMENTATION
      default:
          return Label.BUG
  }
}

export function getStatus(status: string) {
  switch (status) {
    case "done":
      return Status.DONE
    case "in_progress":
      return Status.IN_PROGRESS
    case "todo":
      return Status.TODO
    case "cancelled":
        return Status.CANCELLED
    default:
        return Status.TODO
  }
}

export function getPriority(priority: string) {
  switch (priority) {
      case "low":
          return Priority.LOW
      case "medium":
          return Priority.MEDIUM
      case "high":
          return Priority.HIGH
      default:
          return Priority.LOW
  }
}

export function getRole(role: string) {
  switch (role) {
      case "admin":
          return Role.ADMIN
      case "user":
          return Role.USER
      default:
          return Role.USER
  }
}

export function getDeliveryType(delivery_type: string) {
  switch (delivery_type) {
      case "door_to_terminal":
          return DeliveryType.DOOR_TO_TERMINAL
      case "door_to_door":
          return DeliveryType.DOOR_TO_DOOR
      default:
          return DeliveryType.DOOR_TO_DOOR
  }
}

export function getNumberFromString(str: string) {
  return parseInt(str) || -1;
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


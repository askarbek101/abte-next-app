
import { CityTableType, PayerTableType, RecipientTableType, SenderTableType } from "@/db/schema";
import { DeliveryType, Task, Priority, Role, Status, Label } from "@/types/core"
import { PgColumn, PgEnumColumn } from "drizzle-orm/pg-core";

export function formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    // Check the length of the input
    const length = digitsOnly.length;
    
    if (length < 9 || length > 11) {
      throw new Error('Invalid phone number length. Must be 9, 10, or 11 digits.');
    }
    
    let formattedNumber: string;
    
    switch (length) {
      case 9:
        // For 9 digits, assume it's without the country code and area code
        formattedNumber = `+7(${digitsOnly.slice(0, 3)})${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 8)}-${digitsOnly.slice(8)}`;
        break;
      case 10:
        // For 10 digits, assume it's without the country code
        formattedNumber = `+7(${digitsOnly.slice(0, 3)})${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 8)}-${digitsOnly.slice(8)}`;
        break;
      case 11:
        // For 11 digits, check if it starts with 7 or 8
        if (digitsOnly.startsWith('7') || digitsOnly.startsWith('8')) {
          formattedNumber = `+7(${digitsOnly.slice(1, 4)})${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7, 9)}-${digitsOnly.slice(9)}`;
        } else {
          throw new Error('For 11-digit numbers, it must start with 7 or 8.');
        }
        break;
      default:
        throw new Error('Unexpected error occurred.');
    }
    
    return formattedNumber;
  }

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
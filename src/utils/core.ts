'use server'

import { DeliveryType, Task, Priority, Role, Status, Label } from "@/types/core"
import { CityTableSelect, PayerTableSelect, RecipientTableSelect, SenderTableSelect, TaskTable, TaskTableInsert, TaskTableSelect } from "@/db/schema"
import { uploadPdfToUploadthing } from "@/uploadthing/service"
import { generateTaskPdfByTaskInsert } from "@/generator/pdf/core"
import { calculatePrice, calculateVolume } from "@/calculator/core"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import { CreateTaskSchema, UpdateTaskSchema } from "@/app/_lib/validations"
import { customAlphabet } from "nanoid"
import { getCity } from "@/app/_lib/queries"
import { getDeliveryType, getLabel, getPriority, getStatus } from "@/app/_lib/utils"

export async function formatPhoneNumber(phoneNumber: string): Promise<string> {
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


export async function getNumberFromString(str: string) {
  return parseInt(str) || -1;
}


export async function GetCreateTaskBySchema(input: CreateTaskSchema): Promise<TaskTableInsert> {
  const code = `TASK-${customAlphabet("0123456789", 4)()}`;
  const from = await getCity(input.from);
  const to = await getCity(input.to);    

  if (!from || !to) {
    throw new Error("City not found")
  }

  const task : TaskTableInsert = {
    code: code,
    description: input.description,
    label: getLabel(input.label),
    status: getStatus(input.status),
    priority: getPriority(input.priority),
    height: input.height.toString(),
    width: input.width.toString(),
    length: input.length.toString(),
    weight: input.weight.toString(),
    from: from.id,
    to: to.id,
    delivery_type: getDeliveryType(input.delivery_type),
    payer: input.payer.id,
    recipient: input.recipient.id,
    sender: input.sender.id,
    insurance_cost: input.insurance_cost.toString(),
    number_of_packages: input.number_of_packages,
    value_of_goods: input.value_of_goods.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    price: '0',
    volume: '0',
    invoice_url: "",
  }
  const pdfBytes = await generateTaskPdfByTaskInsert(task);
  var data = await uploadPdfToUploadthing(pdfBytes, task.code + '.pdf');

  task.invoice_url = data.data?.url ?? "";
  task.volume = await calculateVolume(input.height ?? 0, input.width ?? 0, input.length ?? 0).toString();
  task.price = await calculatePrice(input.volume, input.weight ?? 0).toString();

  return task;
}

export async function GetUpdateTaskBySchema(input: UpdateTaskSchema & {id: string}): Promise<TaskTableInsert> {
  const task : TaskTableInsert = {
    id: input.id,
    code: input.code,
    description: input.description,
    status: input.status,
    label: input.label,
    priority: input.priority,
    height: input.height.toString(),
    width: input.width.toString(),
    length: input.length.toString(),
    weight: input.weight.toString(),
    volume: input.volume.toString(),
    price: input.price.toString(),
    invoice_url: input.invoice_url,
    updatedAt: new Date(),
    from: input.from,
    to: input.to,
    payer: input.payer.id,
    recipient: input.recipient.id,
    sender: input.sender.id,
    delivery_type: input.delivery_type,
    insurance_cost: input.insurance_cost.toString(),
    number_of_packages: input.number_of_packages,
    value_of_goods: input.value_of_goods.toString(),
  }
  return task;
}


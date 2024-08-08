"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db/index"
import { TaskTable } from "@/db/schema"
import { Task } from "@/types/core"
import { takeFirstOrThrow } from "@/db/utils"
import { asc, count, eq, inArray, not } from "drizzle-orm"
import { customAlphabet } from "nanoid"

import { getErrorMessage } from "@/lib/handle-error"

import { CreateTaskBySchema } from "./utils"
import { type CreateTaskSchema, type UpdateTaskSchema } from "./validations"
import { calculateVolume, calculatePrice } from "@/calculator/core"
import { generateOrderDetailPdf } from "@/generator/pdf/core"
import { uploadPdfToUploadthing } from "@/uploadthing/service"

export async function createTask(input: CreateTaskSchema) {
  noStore()
  try {
    await db.transaction(async (tx) => {
      console.log("🚀 Creating task...")

      const task = await CreateTaskBySchema(input);

      const pdfBytes = await generateOrderDetailPdf(task);
      var data = await uploadPdfToUploadthing(pdfBytes, task.code + '.pdf');
      input.invoice_url = data.data?.url;

      input.volume = await calculateVolume(input.height ?? 0, input.width ?? 0, input.length ?? 0)
      input.price = await calculatePrice(input.volume, input.weight ?? 0)

      // create try catch block
      try {      
        const newTask = await tx
        .insert(TaskTable)
        .values({
          code: code,
          description: input.description,
          status: input.status,
          label: input.label,
          priority: input.priority,
          height: input.height,
          width: input.width,
          length: input.length,
          weight: input.weight,
          volume: input.volume,
          price: input.price,
          invoice_url: input.invoice_url,
        })
        .returning({
          id: tasks.id,
        })
        .then(takeFirstOrThrow)

      } catch (err) {
        console.error(err)
      }

        console.log("🚀 Task created")
    })

    revalidatePath("/")

    

    return {
      code: code,
      error: null,
    }
  } catch (err) {
    return {
      code: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateTask(input: UpdateTaskSchema & { id: string }) {
  noStore()
  try {
    let volume = await calculateVolume(input.height ?? 0, input.width ?? 0, input.length ?? 0)
    let price = await calculatePrice(volume, input.weight ?? 0)
    await db
      .update(TaskTable)
      .set({
        description: input.description,
        status: input.status,
        label: input.label,
        priority: input.priority,
        height: input.height,
        width: input.width,
        length: input.length,
        weight: input.weight,
        volume: volume,
        price: price,
      })
      .where(eq(TaskTable.id, input.id))

    revalidatePath("/")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}


export async function updateTasks(input: {
  ids: string[]
  description?: Task["description"]
  label?: Task["label"]
  status?: Task["status"]
  priority?: Task["priority"]
  height?: Task["height"]
  width?: Task["width"]
  length?: Task["length"]
  weight?: Task["weight"]
  volume?: Task["volume"]
  price?: Task["price"]
}) {
  noStore()
  try {
    let volume = await calculateVolume(input.height ?? 0, input.width ?? 0, input.length ?? 0)
    let price = await calcultePrice(volume, input.weight ?? 0)
    await db
      .update(tasks)
      .set({
        description: input.description,
        status: input.status,
        label: input.label,
        priority: input.priority,
        height: input.height,
        width: input.width,
        length: input.length,
        weight: input.weight,
        volume: volume,
        price: price,
      })
      .where(inArray(tasks.id, input.ids))

      
    revalidatePath("/")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteTask(input: { id: string }) {
  try {
    console.log('🚀 Deleting task...')
    await db.transaction(async (tx) => {
      await tx.delete(tasks).where(eq(tasks.id, input.id))

      // Create a new task for the deleted one
      await tx.insert(tasks).values(generateRandomTask())
    })
    console.log('🚀 Task deleted')

    revalidatePath("/")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteTasks(input: { ids: string[] }) {
  try {
    console.log('🚀 Deleting tasks...')
    await db.transaction(async (tx) => {
      await tx.delete(tasks).where(inArray(tasks.id, input.ids))
    })
    console.log('🚀 Tasks deleted')

    revalidatePath("/")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function getChunkedTasks(input: { chunkSize?: number } = {}) {
  try {
    const chunkSize = input.chunkSize ?? 1000

    const totalTasks = await db
      .select({
        count: count(),
      })
      .from(tasks)
      .then(takeFirstOrThrow)

    const totalChunks = Math.ceil(totalTasks.count / chunkSize)

    let chunkedTasks

    for (let i = 0; i < totalChunks; i++) {
      chunkedTasks = await db
        .select()
        .from(tasks)
        .limit(chunkSize)
        .offset(i * chunkSize)
        .then((tasks) =>
          tasks.map((task) => ({
            ...task,
            createdAt: task.createdAt.toString(),
            updatedAt: task.updatedAt?.toString(),
          }))
        )
    }

    return {
      data: chunkedTasks,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

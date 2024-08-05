"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db/index"
import { tasks, type Task } from "@/db/schema"
import { takeFirstOrThrow } from "@/db/utils"
import { asc, count, eq, inArray, not } from "drizzle-orm"
import { customAlphabet } from "nanoid"

import { getErrorMessage } from "@/lib/handle-error"

import { generateRandomTask } from "./utils"
import { createTaskSchema, type CreateTaskSchema, type UpdateTaskSchema } from "./validations"
import { generateOrderDetailPdf } from "@/generator/pdf/core"
import { uploadPdfToUploadthing } from "@/uploadthing/service"
import { calcultePrice, calculteVolume } from "@/calculator/core"
import { InputIcon } from "@radix-ui/react-icons"

export async function seedTasks(input: { count: number }) {
  const count = input.count ?? 100

  try {
    const allTasks: Task[] = []

    for (let i = 0; i < count; i++) {
      allTasks.push(generateRandomTask())
    }

    await db.delete(tasks)

    console.log("📝 Inserting tasks", allTasks.length)

    await db.insert(tasks).values(allTasks).onConflictDoNothing()
  } catch (err) {
    console.error(err)
  }
}

export async function createTask(input: CreateTaskSchema) {
  noStore()
  try {
    const code = `TASK-${customAlphabet("0123456789", 4)()}`;
    await db.transaction(async (tx) => {
      console.log("🚀 Creating task...")


      input.volume = await calculteVolume(input)
      input.price = await calcultePrice(input)

      // create try catch block
      try {      
        const newTask = await tx
        .insert(tasks)
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

    
    const pdfBytes = await generateOrderDetailPdf(input);
    await uploadPdfToUploadthing(pdfBytes, code + '.pdf');

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
        volume: input.volume,
        price: input.price,
      })
      .where(eq(tasks.id, input.id))

      await updateVolumeAndPrice(input)

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

async function updateVolumeAndPrice(input: UpdateTaskSchema & { id: string }) {
  noStore()
  try {
    await db
      .update(tasks)
      .set({
        volume: await calculteVolume(input),
        price: await calcultePrice(input),
      })
      .where(eq(tasks.id, input.id))

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
        volume: input.volume,
        price: input.price,
      })
      .where(inArray(tasks.id, input.ids))

      

      await updateVolumeAndPrice({
        height: input.height,
        width: input.width,
        length: input.length,
        weight: input.weight,
        id: input.ids[0],
      } as UpdateTaskSchema & { id: string })

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
    await db.transaction(async (tx) => {
      await tx.delete(tasks).where(eq(tasks.id, input.id))

      // Create a new task for the deleted one
      await tx.insert(tasks).values(generateRandomTask())
    })

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
    await db.transaction(async (tx) => {
      await tx.delete(tasks).where(inArray(tasks.id, input.ids))

      // Create new tasks for the deleted ones
      await tx.insert(tasks).values(input.ids.map(() => generateRandomTask()))
    })

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

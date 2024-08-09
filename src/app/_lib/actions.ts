"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db/index"
import { TaskTable, TaskTableInsert } from "@/db/schema"
import { Task } from "@/types/core"
import { takeFirstOrThrow } from "@/db/utils"
import { asc, count, eq, inArray, not, sql } from "drizzle-orm"
import { getErrorMessage } from "@/lib/handle-error"
import { updateTaskSchema, type CreateTaskSchema, type UpdateTaskSchema } from "./validations"
import { calculateVolume, calculatePrice } from "@/calculator/core"
import { GetCreateTaskBySchema, GetUpdateTaskBySchema } from "@/utils/core"

export async function createTask(input: CreateTaskSchema) {
  noStore()
  try {
    const taskInsert = await GetCreateTaskBySchema(input);


    await db.transaction(async (tx) => {
      console.log("🚀 Creating task...")
      // create try catch block
      try {      
        await tx.insert(TaskTable).values(taskInsert).returning();
      } catch (err) {
        console.error(err)
      }
        console.log("🚀 Task created")
    })

    revalidatePath("/")

    return {
      code: taskInsert.code,
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

    const task : TaskTableInsert = await GetUpdateTaskBySchema(input);

    await db
      .update(TaskTable)
      .set(task)
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
} & Partial<TaskTableInsert>) {
  noStore()
  try {
    const validatedInput = updateTaskSchema.partial().parse(input);
    const updateFields: Partial<TaskTableInsert> = {};

    // Update timestamp
    updateFields.updatedAt = new Date();

    // Only update if there are fields to update
    if (Object.keys(updateFields).length > 0) {
      for (const id of input.ids) {
        await db
          .update(TaskTable)
          .set(updateFields)
          .where(eq(TaskTable.id, id));
      }
    }

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
      await tx.delete(TaskTable).where(eq(TaskTable.id, input.id))
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
      await tx.delete(TaskTable).where(inArray(TaskTable.id, input.ids))
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
      .from(TaskTable)
      .then(takeFirstOrThrow)

    const totalChunks = Math.ceil(totalTasks.count / chunkSize)

    let chunkedTasks

    for (let i = 0; i < totalChunks; i++) {
      chunkedTasks = await db
        .select()
        .from(TaskTable)
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

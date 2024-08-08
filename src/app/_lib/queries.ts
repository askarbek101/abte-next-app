import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { CityTable, PayerTable, RecipientTable, SenderTable, TaskTable } from "@/db/schema"
import { Task } from "@/types/core"
import { type DrizzleWhere } from "@/types"
import { eq, and, asc, count, desc, gte, lte, or, sql, type SQL } from "drizzle-orm"

import { filterColumn } from "@/lib/filter-column"

import { type GetTasksSchema } from "./validations"
import { getLabel, getStatus, getPriority, getDeliveryType, getRole, getNumberFromString } from "@/utils/core"

export async function getTasks(input: GetTasksSchema) {
  noStore()
  const { page, per_page, sort, description, invoice_url, status, priority, height, width, length, weight, volume, price, operator, from, to, code, createdAt, updatedAt, id  } =
    input

  try {
    // Offset to paginate the results
    const offset = (page - 1) * per_page
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Task | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    const fromDay = from ? sql`to_date(${from}, 'yyyy-mm-dd')` : undefined
    const toDay = to ? sql`to_date(${to}, 'yyyy-mm-dd')` : undefined

    const expressions: (SQL<unknown> | undefined)[] = [
      description
        ? filterColumn({
            column: TaskTable.description,
            value: description,
          })
        : undefined,
      invoice_url
        ? filterColumn({
            column: TaskTable.invoice_url,
            value: invoice_url,
          })
        : undefined,
      // Filter tasks by status
      !!status
        ? filterColumn({
            column: TaskTable.status,
            value: status,
            isSelectable: true,
          })
        : undefined,
      // Filter tasks by priority
      !!priority
        ? filterColumn({
            column: TaskTable.priority,
            value: priority,
            isSelectable: true,
          })
        : undefined,
      // Filter tasks by height
      !!height
        ? filterColumn({
            column: TaskTable.height,
            value: height.toString(),
            isSelectable: true,
          })
        : undefined,
      // Filter tasks by width
      !!width
        ? filterColumn({
            column: TaskTable.width,
            value: width.toString(),
            isSelectable: true,
          })
        : undefined,
      // Filter tasks by length
      !!length
        ? filterColumn({
            column: TaskTable.length,
            value: length.toString(),
            isSelectable: true,
          })
        : undefined,
      // Filter tasks by weight
      !!weight
        ? filterColumn({
            column: TaskTable.weight,
            value: weight.toString(),
            isSelectable: true,
          })
        : undefined,
      // Filter tasks by volume
      !!volume
        ? filterColumn({
            column: TaskTable.volume,
            value: volume.toString(),
            isSelectable: true,
          })
        : undefined,
      // Filter tasks by price
      !!price
        ? filterColumn({
            column: TaskTable.price,
            value: price.toString(),
            isSelectable: true,
          })
        : undefined,
      // Filter tasks by code
      !!code
        ? filterColumn({
            column: TaskTable.code,
            value: code,
            isSelectable: true,
          })
        : undefined,
      // Filter by createdAt
      fromDay && toDay
        ? and(gte(TaskTable.createdAt, fromDay), lte(TaskTable.createdAt, toDay))
        : undefined,
      // Filter by updatedAt
      createdAt
        ? filterColumn({
            column: TaskTable.createdAt,
            value: createdAt,
            isSelectable: true,
          })
        : undefined,
      updatedAt
        ? filterColumn({
            column: TaskTable.updatedAt,
            value: updatedAt,
            isSelectable: true,
          })
        : undefined,
      id
        ? filterColumn({
            column: TaskTable.id,
            value: id,
            isSelectable: true,
          })
        : undefined,
    ]
    const where: DrizzleWhere<Task> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const db_data = await tx
      .select({
        task: TaskTable,
        fromCity: CityTable,
        toCity: CityTable,
        payer: PayerTable,
        recipient: RecipientTable,
        sender: SenderTable,
      })
      .from(TaskTable)
      .innerJoin(CityTable, eq(TaskTable.from, CityTable.id))
      .innerJoin(CityTable, eq(TaskTable.to, CityTable.id))
      .innerJoin(PayerTable, eq(TaskTable.payer, PayerTable.id))
      .innerJoin(RecipientTable, eq(TaskTable.recipient, RecipientTable.id))
      .innerJoin(SenderTable, eq(TaskTable.sender, SenderTable.id))
      .limit(per_page)
      .offset(offset)
      .where(where)
      .orderBy(
        column && column in TaskTable
          ? order === "asc"
            ? asc(TaskTable[column])
            : desc(TaskTable[column])
          : desc(TaskTable.id)
      )

      const data : Task[] = db_data.map(({task, fromCity, toCity, payer, recipient, sender}) => ({
        id: task.id,
        code: task.code,
        description: task.description,
        invoice_url: task.invoice_url,
        label: getLabel(task.label),
        status: getStatus(task.status),
        priority: getPriority(task.priority),
        volume: getNumberFromString(task.volume),
        height: getNumberFromString(task.height),
        width: getNumberFromString(task.width),
        length: getNumberFromString(task.length),
        weight: getNumberFromString(task.weight),
        price: getNumberFromString(task.price),
        insurance_cost: getNumberFromString(task.insurance_cost),
        number_of_packages: task.number_of_packages,
        value_of_goods: getNumberFromString(task.value_of_goods),
        from: {
          id: fromCity.id,
          name: fromCity.name,
        },
        to: {
          id: toCity.id,
          name: toCity.name,
        },
        delivery_type: getDeliveryType(task.delivery_type),
        payer: {
          id: payer.id,
          abte_id: payer.abte_id,
          name: payer.name,
          bin: payer.bin,
          email: payer.email,
          phone: payer.phone,
          address: payer.address,
          role: getRole(payer.role),
          password: payer.password,
        },
        recipient: {
          id: recipient.id,
          name: recipient.name,
          email: recipient.email,
          phone: recipient.phone,
          address: recipient.address,
          role: getRole(recipient.role),
          password: recipient.password,
        },
        sender: {
          id: sender.id,
          name: sender.name,
          email: sender.email,
          phone: sender.phone,
          address: sender.address,
          role: getRole(sender.role),
          password: sender.password,

        },
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      }))

      console.log(data)
    
      const total = await tx
        .select({
          count: count(),
        })
        .from(TaskTable)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)
    
      return {
        data,
        total,
      }
    })
    const pageCount = Math.ceil(total / per_page)
    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}

export async function getTaskCountByStatus() {
  noStore()
  try {
    return await db
      .select({
        status: TaskTable.status,
        count: count(),
      })
      .from(TaskTable)
      .groupBy(TaskTable.status)
      .execute()
  } catch (err) {
    return []
  }
}

export async function getTaskCountByPriority() {
  noStore()
  try {
    return await db
      .select({
        priority: TaskTable.priority,
        count: count(),
      })
      .from(TaskTable)
      .groupBy(TaskTable.priority)
      .execute()
  } catch (err) {
    return []
  }
}

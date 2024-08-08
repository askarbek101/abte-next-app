import { db } from "@/db/index";
import { SenderTable } from "@/db/schema";
import { Role, Sender } from "@/types/core";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { asc, count, eq, inArray, not } from "drizzle-orm"

export async function createSender(sender: Sender) {
    let salt = genSaltSync(10);
    sender.password = hashSync(sender.password, salt);
    sender.role = Role.USER;

    await db.insert(SenderTable).values({
        ...sender
    });
}

export async function getSender(email: string) {
  return await db.select().from(SenderTable).where(eq(SenderTable.email, email)).execute();
}
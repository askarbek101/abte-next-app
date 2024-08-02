import { db } from "@/db/index";
import { users } from "@/db/schema";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { asc, count, eq, inArray, not } from "drizzle-orm"

export async function createUser(email: string, password: string) {
    let salt = genSaltSync(10);
    let hash = hashSync(password, salt);
    await db.insert(users).values({ email, password: hash });
}

export async function getUser(email: string) {
  return await db.select().from(users).where(eq(users.email, email));
}
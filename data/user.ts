import 'server-only';
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
  try {
    const data = await db.select({
      id: sql<string>`cast(${users.id} as text)`.as("id"), // ← SQL で text に変換
      name: users.name,
      age: users.age,
      email: users.email,
      role: users.role,
      password: users.password,
    }).from(users).where(eq(users.email, email));

    const user =  data[0];

    return user;
  } catch {
    return null;
  }
}
export const getUserById = async (id: number) => { 
  try {
    const data = await db.select().from(users).where(eq(users.id, id));

    const user = data[0];
    return user;
  } catch {
    return null;
  }
}
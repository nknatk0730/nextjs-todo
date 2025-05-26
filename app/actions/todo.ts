'use server';

import { db } from "@/db/drizzle";
import { CreateTodoFormState, TodoCreateSchema } from "../lib/definitions";
import { todos } from "@/db/schema";
import { getUserByEmail } from "@/data/user";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createTodo = async (userEmail: string, state: CreateTodoFormState, formData: FormData) => {
  const validationResult = TodoCreateSchema.safeParse({
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    ownerEmail: userEmail,
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: 'Invalid input',
    }
  }

  const user = await getUserByEmail(validationResult.data.ownerEmail);

  if (!user) {
    return {
      message: "User not found",
    };
  }

  try {
    await db.insert(todos).values({
      ownerId: user?.id as unknown as number,
      title: validationResult.data.title,
      description: validationResult.data.description,
    });
  } catch (error) {
    console.error("Error creating todo:", error);
    return {
      message: "An error occurred while creating your todo.",
    };
  }

  redirect('/dashboard');
}

export const deleteTodo = async (formData: FormData) => {
  const slug = formData.get('slug') as string;
  try {
    await db.delete(todos).where(eq(todos.slug, slug));
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
  revalidatePath('/dashboard');
}
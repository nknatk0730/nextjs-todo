import { z } from "zod";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
        confirmPassword?: string[]
        age?: string[]
      }
      message?: string
    }
  | undefined

export type signinFormState = 
  | {
      error?: string
      message?: string
    }
  | undefined

export const signupFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).trim(),
  email: z.string().email({ message: 'Invalid email address' }).trim(),
  age: z.number().min(1, { message: 'Age is required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }).trim(),
  confirmPassword: z.string().min(8, { message: 'Confirm password is required' }).trim(),
})
.refine((data) => {
  const { password, confirmPassword } = data;
  return password === confirmPassword;
}, {
  message: 'Passwords do not match',
  path: ['confirmPassword'], 
})
.refine(async (data) => {
  const { email } = data;
  const user = await db.select().from(users).where(eq(users.email, email));

  return user.length === 0;
}, {
  message: 'Email already exists',
  path: ['email'],
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }).trim(),
  password: z.string().min(8, {
    message: 'Password is required',
  }).trim(),
  code: z.optional(z.string()),
});
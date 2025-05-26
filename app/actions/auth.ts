'use server';

import bcrypt from "bcryptjs";
import { FormState, SigninFormState, signupFormSchema } from "../lib/definitions";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const signup = async (state: FormState, formData: FormData): Promise<FormState> => {
  const validationResult = await signupFormSchema.safeParseAsync({
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    age: Number(formData.get('age')),
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: 'Invalid input',
    }
  }


  const { name, email, password, age } = validationResult.data;


  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const data = await db
      .insert(users)
      .values({
        name,
        email,
        age,
        password: hashedPassword,
      })
      .returning({ id: users.id });

    const user = data[0];

    if (!user) {
      return {
        message: "An error occurred while creating your account.",
      };
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return new Error("Error creating user");
  }

  redirect('/login');
}

export const login = async (
  state: SigninFormState,
  formData: FormData,
): Promise<SigninFormState> => {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await signIn("credentials", {
      email,
      password,
    });

    return { message: "Email sent" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.name) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "An unknown error occurred" };
      }
    }
    throw error;
  }
}

export const logout = async () => {
  await signOut();
  redirect('/login');
}
import bcrypt from "bcryptjs";

export const signup = async (state: FormState, formData: FormData): Promise<FormState> => {


  const { name, email, password } = validationResult.data;


  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      errors: {},
      message: 'User created successfully',
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return new Error('Error creating user');
  }
}
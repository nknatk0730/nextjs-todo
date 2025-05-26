import { auth } from '@/auth';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cache } from 'react';
import 'server-only';

export const getUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.email) return null

  const userEmail = session.user.email;

  try {
    const data = await db.query.users.findMany({
      where: eq(users.email, userEmail),
      columns: {
        name: true,
        age: true,
        email: true,
        role: true,
      },
      with: {
        todos: {
          columns: {
            slug: true,
            title: true,
            description: true,
          },
        }
      }
    });

    const user = data[0];

    return user;
  } catch (error) {
    console.log(error, 'Failed to fetch user')
    return null
  }
});
import { auth } from '@/auth';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import 'server-only';

export const getUser = async () => {
  const session = await auth();
  if (!session?.user) return null

  const userId = session.user.id as unknown as number

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, userId),
      columns: {
        id: true,
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
}
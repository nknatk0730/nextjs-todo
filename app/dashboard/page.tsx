import { Button, buttonVariants } from "@/components/ui/button";
import { logout } from "../actions/auth";
import { getUser } from "../lib/dal";
import Link from "next/link";
import { deleteTodo } from "../actions/todo";

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col gap-8">
      <form action={logout}>
        <Button type="submit">Logout</Button>
      </form>
      <Link
        className={buttonVariants({ variant: "outline" })}
        href="/todo/create"
      >
        Create New Todo
      </Link>
      <div>
        {user.todos.length === 0 ? (
          <p className="text-sm text-gray-500">No todos found.</p>
        ) : (
          <ul className="space-y-12">
            {user.todos.map((todo) => (
              <li
                key={todo.slug}
                className="p-4 flex items-center justify-between border rounded"
              >
                <Link
                  href={`/todo/${todo.slug}`}
                  className="text-lg font-semibold"
                >
                  {todo.title}
                </Link>
                <p className="text-sm text-gray-500">{todo.description}</p>
                <form action={deleteTodo}>
                  <input type="hidden" name="slug" value={todo.slug as string} />
                  <Button
                    type="submit"
                    variant='destructive'
                  >
                    Delete
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

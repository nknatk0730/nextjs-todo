import { Button } from "@/components/ui/button";
import { logout } from "../actions/auth";
import { getUser } from "../lib/dal";

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col gap-8">
      <p>{user.name}</p>
      <form action={logout}>
        <Button type="submit">Logout</Button>
      </form>
    </div>
  )
}

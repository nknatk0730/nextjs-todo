import { auth } from "@/auth"
import { Button } from "@/components/ui/button";
import { logout } from "../actions/auth";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <p>{session.user.name}</p>
      <form action={logout}>
        <Button type="submit">Logout</Button>
      </form>
    </div>
  )
}

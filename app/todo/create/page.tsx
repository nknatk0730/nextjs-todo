import { getUser } from "@/app/lib/dal";
import { TodoCreateForm } from "./_components/todo-create-form";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function page() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const userEmail = user.email;

  return (
    <div className=" space-y-8">
      <Link href='/dashboard' className={buttonVariants({ variant: "outline" })}>Back</Link>
      <TodoCreateForm userEmail={userEmail} />
    </div>
  )
}

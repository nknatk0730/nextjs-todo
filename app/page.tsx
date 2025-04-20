import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* このTodoアプリの説明 */}
      <div>
        <p>
          このTodoアプリは、Next.jsのサンプルアプリです。<br />
          Next.jsの機能を学ぶために作成されました。<br />
          ぜひ、使ってみてください。
        </p>
      </div>
      <div className="max-w-xs pt-24 flex flex-col gap-12">
        <Button variant='outline' asChild>
          <Link href="/register">Register</Link>
        </Button>
        <span className="text-center">OR</span>
        <Button variant='outline' asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}

'use client';

import { createTodo } from "@/app/actions/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";

export const TodoCreateForm = ({
  userEmail,
}: {
  userEmail: string;
}) => {
  const createTodoWithEmail = createTodo.bind(null, userEmail);
  const [state, action, isPending] = useActionState(createTodoWithEmail, undefined);
  return (
    <div>
      <form action={action} className={isPending ? 'opacity-50' : ''}>
        {state?.message && (
          <p className="mb-4 text-sm text-red-500">{state.message}</p>
        )}
        <div>
          <Label>Title</Label>
          <Input name="title" type="text" />
          <div>
            {state?.errors?.title && (
              state.errors.title.map((error: string) => (
                <p className="mt-2 text-sm text-rose-600" key={error}>{error}</p>
              ))
            )}
          </div>
        </div>
        <div className="mt-4">
          <Label>description</Label>
          <Textarea className="mt-1" name="description" />
        </div>

        <div className="mt-8 items-center">
          <Button disabled={isPending} className="ml-4" type="submit">Create</Button>
        </div>
      </form>
    </div>
  );
}
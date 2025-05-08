import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

const rolesEnum = pgEnum("roles", ["user", "admin"]);

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: rolesEnum().default("user"),
});

export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
}));

export const todos = pgTable(
  "todos",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    slug: varchar({ length: 16 }).$default(() => generateUniqueString(16)),
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }),
    ownerId: integer("owner_id").references(() => users.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [
    uniqueIndex("slug_idx").on(table.slug),
    index("title_idx").on(table.title),
  ]
);

export const todosRelations = relations(todos, ({ one }) => ({
  owner: one(users, {
    fields: [todos.ownerId],
    references: [users.id],
  }),
}));

function generateUniqueString(length: number = 12): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueString += characters[randomIndex];
  }
  return uniqueString;
}

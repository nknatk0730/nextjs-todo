import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  unique,
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
  emailVerified: timestamp("email_verified", {
    precision: 3,
    mode: "date",
    withTimezone: true,
  }),
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
      onUpdate: "cascade",
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

export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  token: varchar({ length: 64 }).notNull().unique(),
  email: varchar({ length: 255 }).references(() => users.email, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }).notNull(), 
  expiresAt: timestamp("expires_at", { precision: 3, mode: 'date', withTimezone: true }).notNull(),
},
  (table) => [
    unique().on(table.token, table.email),
    uniqueIndex("email_verification_email_idx").on(table.email),
    index("email_verification_expires_at_idx").on(table.expiresAt),
  ]
);

export const emailVerificationTokensRelations = relations(
  emailVerificationTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerificationTokens.email],
      references: [users.email],
    }),
  })
);

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  token: varchar({ length: 64 }).notNull().unique(),
  email: varchar({ length: 255 }).references(() => users.email, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }).notNull(),
  expiresAt: timestamp("expires_at", { precision: 3, mode: 'date', withTimezone: true }).notNull(),
},
  (table) => [
    unique().on(table.token, table.email),
    uniqueIndex("password_reset_email_idx").on(table.email),
    index("password_reset_expires_at_idx").on(table.expiresAt),
  ]
);

export const passwordResetTokensRelations = relations(
  passwordResetTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordResetTokens.email],
      references: [users.email],
    }),
  })
);

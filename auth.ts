import NextAuth from "next-auth"
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from "./db/drizzle";
import authConfig from "./auth.config";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
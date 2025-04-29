import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from "next-auth";
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './data/user';
import { LoginSchema } from './app/lib/definitions';
import { NextResponse } from 'next/server';
import { apiAuthPrefix, protectedRoutes, publicRoutes } from './routes';
 
export default {
  pages: {
    signIn: "/login", // 未認証の際にリダイレクトされるカスタムログインページ
  },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    // signIn: async ({ user, account }) => {
    //   if (account?.provider !== "credentials") {
    //     return true;
    //   }

    //   const existingUser = await getUserById(user.id as string);

    //   // Prevent sign in without email verification
    //   if (!existingUser?.emailVerified) {
    //     return false;
    //   }

    //   if (existingUser.isTwoFactorEnabled) {
    //     const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
    //       existingUser.id
    //     );

    //     if (!twoFactorConfirmation) {
    //       return false;
    //     };

    //     await db.twoFactorConfirmation.delete({
    //       where: {
    //         id: twoFactorConfirmation.id,
    //       },
    //     });
    //   };

    //   return true;
    // },
    authorized: async ({ auth, request }) => {
      const path = request.nextUrl.pathname;
      const isProtectedRoute = protectedRoutes.includes(path);
      const isPublicRoute = publicRoutes.includes(path);
      const isApiAuthRoute = path.startsWith(apiAuthPrefix);

      if (isApiAuthRoute) {
        return NextResponse.next();
      }

      if (isProtectedRoute && !auth?.user) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
      }

      // 5. Redirect to /dashboard if the user is authenticated
      if (
        isPublicRoute &&
        auth?.user &&
        !request.nextUrl.pathname.startsWith("/dashboard")
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
      }

      return NextResponse.next();
    },
    // session: async ({ session, token }) => {
    //   if (token.sub && session.user) {
    //     session.user.id = token.sub;
    //   }

    //   if (token.role && session.user) {
    //     session.user.role = token.role;
    //   }

    //   if (session.user) {
    //     session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
    //   };

    //   if (session.user) {
    //     session.user.name = token.name;
    //     session.user.email = token.email ?? '';
    //     session.user.isOAuth = token.isOAuth;
    //   };

    //   return session;
    // },
    // jwt: async ({ token }) => {
    //   if (!token.sub) {
    //     return token;
    //   };

    //   const existingUser = await getUserById(token.sub);

    //   if (!existingUser) {
    //     return token;
    //   };

    //   const existingAccount = await getAccountByUserId(existingUser.id);

    //   token.isOAuth = !!existingAccount;
    //   token.name = existingUser.name;
    //   token.email = existingUser.email;
    //   token.role = existingUser.role;
    //   token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
    //   return token;
    // },
  },
} satisfies NextAuthConfig;
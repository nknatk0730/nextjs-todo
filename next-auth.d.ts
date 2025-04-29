import { DefaultUser } from '@auth/core/types';

// declare module '@auth/core/types' {
//   interface ExtendedUser extends User {
//     role: string;
//   };
// };

// export type ExtendedUser = User & {
//   id: number
//   role: string;
//   age: number;
//   // isTwoFactorEnabled: boolean;
//   // isOAuth: boolean;
// };

declare module '@auth/core/types' {
  interface User extends DefaultUser {
    role: string | null;
  }
}

// declare module '@auth/core/types' {
//   interface Session extends DefaultSession {
//     user: User;
//   };
// };

declare module '@auth/core/jwt' {
  interface JWT extends DefaultJWT {
    role: string| null;
    age: number;
  };
};
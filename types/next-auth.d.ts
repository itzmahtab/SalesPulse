// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      businessId: string;
      role: 'owner' | 'admin' | 'user';
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    businessId: string;
    role: 'owner' | 'admin' | 'user';
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    businessId: string;
    role: 'owner' | 'admin' | 'user';
  }
}
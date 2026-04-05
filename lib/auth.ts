// lib/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {db} from "@/lib/db/index";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 1. Find user by email
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!dbUser || !dbUser.passwordHash) {
          return null;
        }

        // 2. Verify password
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          dbUser.passwordHash
        );

        if (!passwordsMatch) return null;

        // 3. Return user data to be encoded in the JWT
        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          businessId: dbUser.businessId,
          role: dbUser.role as 'owner' | 'admin' | 'user',
        };
      }
    })
  ],
  pages: {
    signIn: "/login", // We will build this page next
  },
  callbacks: {
    // Attach custom data to the JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.businessId = user.businessId;
        token.role = user.role;
      }
      return token;
    },
    // Pass the custom data from the JWT to the Session object
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.businessId = token.businessId as string;
        session.user.role = token.role as 'owner' | 'admin' | 'user';
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  secret: process.env.AUTH_SECRET,
});
// src/app/api/auth/[...nextauth]/authOptions.ts

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/pgsql";
import { users } from "@/db/schema/users";
import { pharmacies } from "@/db/schema/pharmacies";
import { eq } from "drizzle-orm";

declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user?: {
      role?: string;
    };
  }

  interface JWT {
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);

        if (user) {
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
          if (!isPasswordValid) return null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }

        const [pharmacyUser] = await db
          .select()
          .from(pharmacies)
          .where(eq(pharmacies.email, credentials.email))
          .limit(1);

        if (!pharmacyUser) return null;

        const isPharmacyPasswordValid = await bcrypt.compare(
          credentials.password,
          pharmacyUser.passwordHash
        );
        if (!isPharmacyPasswordValid) return null;

        return {
          id: pharmacyUser._id.toString(),
          name: pharmacyUser.contactName,
          email: pharmacyUser.email,
          role: "pharmacy",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

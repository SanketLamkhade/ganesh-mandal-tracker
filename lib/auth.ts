import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import { User } from "@/models/User";

if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            await wait(400);
            return null;
          }

          const username = credentials.username.trim();
          if (
            username.length < 1 ||
            username.length > 64 ||
            credentials.password.length < 1 ||
            credentials.password.length > 128
          ) {
            await wait(400);
            return null;
          }

          await connectDB();
          const user = await User.findOne({ username });

          if (!user) {
            await wait(400);
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash,
          );

          if (!isValid) {
            await wait(400);
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.displayName,
            email: user.username,
          };
        } catch (error) {
          console.error("Auth error:", error);
          await wait(400);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.email ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.email = (token.username as string) ?? "";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { authConfig } from "@/auth/auth.config";
import { getSender } from "@/use-cases/users.use-case";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize({ email, password }: any) {
        let user = await getSender(email);
        if (user === null || user === undefined || user.length === 0) return null;
        let passwordsMatch = await compare(password, user[0]!.password!);
        if (passwordsMatch) return user[0] as any;
        return null;
      },
    }),
  ],
});

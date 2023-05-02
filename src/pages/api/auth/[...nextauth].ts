import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import Email from "next-auth/providers/email";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async session({ session, user })
    {
      if (session.user)
      {
        const dbUser = await prisma.user.findFirst({
          where: {
            email: user.email,
          },
          select: {
            role: true,
          }
        });

        session.user.id = user.id;
        session.user.role = dbUser?.role ?? Role.USER;

      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [

    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: '/',
  }
};

export default NextAuth(authOptions);

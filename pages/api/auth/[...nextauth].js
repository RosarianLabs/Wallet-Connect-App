import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: "identify" } },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "Discord ID", type: "text" },
        name: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        accessToken: { label: "Access Token", type: "text" },
      },
      async authorize(credentials) {
        return {
          id: credentials.id,
          name: credentials.name,
          email: credentials.email || null,
          accessToken: credentials.accessToken,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub || session.user.id;
      session.accessToken = token.accessToken || session.user.accessToken;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.accessToken = user.accessToken;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
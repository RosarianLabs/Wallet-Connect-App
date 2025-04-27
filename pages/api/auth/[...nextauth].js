import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// Debug: Log environment variables
console.log("DISCORD_CLIENT_ID:", process.env.DISCORD_CLIENT_ID);
console.log("DISCORD_CLIENT_SECRET:", process.env.DISCORD_CLIENT_SECRET);

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: "identify" } },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub; // Store Discord ID in session
      return session;
    },
    async signIn({ user, account, profile }) {
      // Debug: Log the redirect URI being sent to Discord
      console.log("Redirect URI sent to Discord:", process.env.NEXTAUTH_URL + "/api/discord/callback");
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { discordId, username, accessToken } = router.query;

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/discord/callback`;
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Tales of Endaria Wallet Linking</h1>
      {!discordId ? (
        <a
          href={discordAuthUrl}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#5865F2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Login with Discord
        </a>
      ) : (
        <div>
          <p>Logged in as Discord ID: {discordId}</p>
          <p>Username: {username}</p>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#FF4D4D",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
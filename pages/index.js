import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Tales of Endaria Wallet Linking</h1>
      {!session ? (
        <button
          onClick={() => signIn("discord")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#5865F2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login with Discord
        </button>
      ) : (
        <div>
          <p>Logged in as Discord ID: {session.user.id}</p>
          <button
            onClick={() => signOut()}
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
import axios from "axios";

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    console.log("No code provided in query");
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/discord/callback`;
    console.log("Using redirectUri:", redirectUri);

    // Exchange the code for an access token
    console.log("Fetching token from Discord...");
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        scope: "identify",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const tokenData = tokenResponse.data;
    console.log("Token response:", tokenData);

    // Fetch user data using the access token
    console.log("Fetching user data from Discord...");
    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = userResponse.data;
    console.log("User data response:", userData);

    // Create a session object
    const session = {
      user: {
        id: userData.id,
        name: userData.username,
        email: userData.email || null,
      },
      accessToken: tokenData.access_token,
      expires: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
    };
    console.log("Session data prepared:", session);

    // Store the session data in a cookie or redirect with a token
    // Since signIn doesn't work reliably in API routes, we'll redirect with the user data
    const redirectUrl = new URL("/", baseUrl);
    redirectUrl.searchParams.set("discordId", userData.id);
    redirectUrl.searchParams.set("username", userData.username);
    redirectUrl.searchParams.set("accessToken", tokenData.access_token);

    console.log("Redirecting to:", redirectUrl.toString());
    res.redirect(302, redirectUrl.toString());
  } catch (error) {
    console.error("Callback error:", error.message);
    console.error("Error details:", error.response?.data || error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
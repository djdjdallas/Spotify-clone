import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

const NEXT_PUBLIC_CLIENT_SECRET = "e0cd68af12e84e8f882a4a518b875231"
const NEXT_PUBLIC_CLIENT_ID = "3eea149932f64656bec093ae927635a2"

async function refreshAccessToken(token) {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
        console.log("Refreshed Token is", refreshedToken);
        return{
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        };

    } catch (error) {
        console.log(error)
        return {
            ...token,
            error:'RefreshAccessTokenError',
        };
    }
    
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: "3eea149932f64656bec093ae927635a2",
      clientSecret: "e0cd68af12e84e8f882a4a518b875231",
      redirectUri: "/pages/index.tsx",
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
     signIn: '/login',
    },
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000,
                }
            }

            if (Date.now() < token.accessTokenExpires) {
                console.log("EXISTING ACCESs TOKEN IS VALID");
                return token;
                
            }
            console.log("EXISTING ACCES TOKEN IS EXPIRED, REFRESHING..");
            return await refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;

            return session;

        }
    },
});
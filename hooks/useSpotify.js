import React, { useEffect } from 'react'
import { signIn, useSession } from "next-auth/react"
import spotifyApi from '../lib/spotify';

function useSpotify() {
const { data:session, status } = useSession();
    
    useEffect(() => {
        if (session) {
            if(session.error === "RefreshAccessToken") {
                signIn();
            }
            spotifyApi.setAccessToken(session.user.accessToken);
        }
    }, [session]);

  return spotifyApi;
  
}

export default useSpotify
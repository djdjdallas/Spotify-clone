import type { NextPage } from 'next'
import  Sidebar from "../components/SIdeBar"
import Center from "../components/Center"
import { getSession } from 'next-auth/react'
import Player from "../components/Player"
import React from 'react'
import Login from './login'


const Home: NextPage = () => {
  return (
  
    <div className="bg-black h-screen overflow-hidden">
      {/* <Login /> */}
        <main className='flex'>
          <Sidebar />
          <Center />
        </main>
          <div className='sticky bottom-0' >
            <Player />
          </div>
    </div>
   
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    }
  }
}

export default Home

import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/Layout';
import About from '../components/About';
import Mint from '../components/Mint';
import React from 'react';
import { isMobile } from "react-device-detect";


const Home: NextPage = () => {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
      setHydrated(true);
  }, []);
  if (!hydrated) {
      // Returns null on first render, so the client and server match
      return null;
  }

  if (isMobile) {
    return (
      <Layout>
        <Head>
          <title>AI Horror</title>
        </Head>
      
        <div className="py-2">
            <About/>
        </div>
  
        <div className="py-2">
            <Mint/>
        </div>
      </Layout>
    )
  }else{
  return (
    <Layout>
      <Head>
        <title>AI Horror</title>
      </Head>
    
      <div className="py-16">
          <About/>
      </div>

      <div className="py-16">
          <Mint/>
      </div>
    </Layout>
  )
  }
}

export default Home

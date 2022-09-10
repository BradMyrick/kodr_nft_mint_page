import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/Layout';
import About from '../components/About';
import Mint from '../components/Mint';
import { useState } from 'react';



const Home: NextPage = () => {


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

export default Home

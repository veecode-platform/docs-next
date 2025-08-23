import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Footer, Header } from '../components';
import { Homescreen } from '../screens';
import Head from '@docusaurus/Head';


export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <>
      <Head>
        <title>VeeCode Platform Documentation</title>
        <meta
          name="description"
          content="Access the comprehensive documentation for VeeCode Platform, covering the DevPortal and Admin-UI. 
          Learn how to effectively use these powerful tools to build and deploy your applications with ease."
         />
      </Head>
      <Header/>
      <Homescreen/>
      <Footer/>
    </>
  );
}

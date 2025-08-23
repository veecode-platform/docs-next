import React from 'react';
import DemoSection from './demoSection';
import Features from './features';
import FirstSection from './firstSection';
import AgeRio from './ageRio';
import styles from '../../css/homescreen.module.css';

const Homescreen = () => {
  return (
    <main className={styles.main}>
      <FirstSection/>
      <Features/>
      <DemoSection/>
      <AgeRio/>
    </main>
  )
}

export default Homescreen
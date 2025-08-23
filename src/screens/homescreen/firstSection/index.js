import React from 'react';
import styles from './FirstSection.module.css';
import Video from '/img/assets/devportal.mp4';
import Poster from '/img/assets/poster.png';
import { Button } from '../../../components';

const FirstSection = () => {
  return (
    <section className={styles.firstSection}>
      <article className={styles.wrapper}>
        <h1 className={styles.title}>A Tool to <span>automate OpenAPI</span> applications development </h1>
        <video
          className={styles.video}
          src={Video}
          type="video/mp4"
          controls
          // autoPlay
          poster={Poster}
           />
           <Button>
            <a href="devportal/intro"> Start Now</a> 
           </Button>
      </article>
    </section>
  )
}

export default FirstSection
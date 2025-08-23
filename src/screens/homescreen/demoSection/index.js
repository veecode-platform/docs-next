import React from 'react';
import Image from '/img/assets/notebook.png';
import styles from './DemoSection.module.css';
import { Button } from '../../../components';

const DemoSection = () => {
  return (
    <section className={styles.demoSection}>
        <article className={styles.wrapper}>
            <figure className={styles.image}>
                <img src={Image} alt=""/>
            </figure>
            <div className={styles.desc}>
                <h3 className={styles.desc__text}>
                Centralize your APIs efficiently and securely with VeeCode Platform. Customize your workspace with pre-configured templates.
                </h3>
                <Button>
                  <a href="devportal/intro"> Try it out now</a> 
                </Button>   
            </div>
        </article>
    </section>
  )
}

export default DemoSection
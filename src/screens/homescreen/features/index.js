import React from 'react';
import styles from './Features.module.css';
import FeaturesData from './features.json';
import Feature from './feature';

const Features = () => {
  return (
    <section className={styles.features}>
            {
                FeaturesData.map(item => (
                    <Feature key={item.title} {...item}/>
                ))
            }
    </section>
  )
}

export default Features
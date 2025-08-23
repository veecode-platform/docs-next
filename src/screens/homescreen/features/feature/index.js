import React from 'react';
import styles from './Feature.module.css';

const Feature = ({title, icon, image, desc}) => {
  return (
      <article className={styles.feature}>
          <figure className={styles.feature__image}>
             <img src={image} alt={title} />
          </figure>
          <div className={styles.feature__details}>
              <div className={styles.titleWrapper}>
                  <h2 className={styles.titleWrapper__title}><img src={icon} alt="" className={styles.titleWrapper__icon} /> {title}</h2>
              </div>
                  <p className={styles.feature__text}>
                      {desc}
                  </p>
          </div>
      </article>
  )
}

export default Feature
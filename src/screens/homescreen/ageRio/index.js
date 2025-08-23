import React from 'react';
import Image from '/img/assets/ageriocard.png';
import Decorator from '/img/assets/ageriodecorator.png';
import SideDecorator from '/img/assets/ageriosidedecorator.png';
import styles from './AgeRio.module.css';

const AgeRio = () => {
    return (
        <section className={styles.ageRio}>
            <article className={styles.wrapper}>
                <div className={styles.desc}>
                    <h3 className={styles.desc__text}>
                        AgeRio works in partnership with FINEP to foster innovation in the state of Rio de Janeiro. VeeCode Platform is honored and privileged to be one of the companies supported.
                    </h3>
                </div>
                <figure className={styles.image}>
                    <img src={Image} alt="" />
                </figure>
            </article>
            <figure className={styles.ageRio__decorator}>
                <img src={Decorator} alt="" />
            </figure>
            <figure className={styles.ageRio__sideDecorator}>
                <img src={SideDecorator} alt="" />
            </figure>
        </section>
    )
}

export default AgeRio
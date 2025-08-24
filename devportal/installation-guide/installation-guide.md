---
sidebar_position: 0
sidebar_label: Installation Guides
title: Installation Guides
---

You can use VeeCode DevPortal for free in many possible ways. Find here a few setup guides to get started.

:::info
**VeeCode DevPortal** is "[free as in speech](https://www.gnu.org/philosophy/free-sw.html)" software. It preserves the same OSS license of Backstage itself ([Apache License](https://www.apache.org/licenses/LICENSE-2.0)), so you are free to use, modify and distribute it.
:::

import style from '../style.module.css';

<div className={style.wrapper}>

export const Card = ({children, title, link}) => (
   <div className={style.card}
      onClick={() => window.location = link }
      onKeyDown={(e) => e.key === 'Enter' && (window.location = link)}
      tabIndex={0}
      role="button"
      aria-label={`Navigate to ${title}`}>
      <div className={style.titlebar}>
         <h3 className={style.title}>{title}</h3>
      </div>
      <p className={style.desc}>
         {children}
      </p>
   </div>
);

<Card title="Local Setup" link="./local-setup">Learn how to install the Developer Portal locally on your own development machine.</Card>

<Card title="Simple Setup" link="./simple-setup">Learn how to install a self-hosted Developer Portal with a simple setup (trial, demo or small production environment).</Card>

<Card title="Production Setup" link="./production-setup">Learn how to install a self-hosted and production-ready Developer Portal on your own infrastructure.</Card>

<Card title="Customization" link="./Customization">Learn how to customize your Developer Portal.</Card>

<Card title="FAQs" link="./FAQs">Frequently Asked Question.</Card>

</div>

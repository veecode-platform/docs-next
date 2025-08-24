---
sidebar_position: 1
sidebar_label: Platform Intro
title: Platform Intro
---

import style from './style.module.css';

:::tip
We are currently revamping the whole documentation, please come back later to check our improved guides and docs. In the meantime check the other sections of the documentation ([DevPortal](../devportal/intro), [Admin-UI](../admin-ui/intro) and [VKDR-CLI](../vkdr/intro)).
:::


# Intro

VeeCode Platform is a set of tools and services that help you to build your own Internal Developer Platform. It follows the principles of "batteries included but swappable", meaning that you can use the platform as is or customize it to meet your specific needs and to embrace your own DevOps culture and tools.


## Hot Shortcuts

You may want to skip documents and go straight to a few key sections, if you are feeling brave.

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

<Card title="📄️ Self-Service Demo" link="">Explore the platform's features through a simple interactive demo.</Card>

</div>

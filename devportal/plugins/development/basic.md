---
sidebar_position: 4
sidebar_label: Basics
title: Basics & Pre-reqs
---

## Prerequisites

The same requirements for Backstage development described in [Backstage documentation](https://backstage.io/docs/getting-started/#prerequisites) apply to plugin development. We repeat below the most important ones:

- Node.js current LTS version (we recommend using `nvm` to manage it)
    - Install nvm from [here](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
- Yarn version 4.4.1
    - Use `corepack enable` and then run `yarn set version 4.4.1`
- Git
- A proper IDE (like VS Code)

## Guidelines for plugins

A few critical points to consider when developing plugins:

- You will write plugin code in TypeScript
- Your project structure and folders will be planned to accelerate the development process
- Plugins will be released as npm packages
- Do not reinvent the wheel - check if there is a plugin that already does what you need
- Construct your UI with [Backstage components](https://backstage.io/storybook/) and [Material UI](https://mui.com/material-ui/)

## Original documentation

Backstage original documentation has some good info on plugin development. We recommend reading it to get a better understanding of the plugin development process.

- [Backstage Introduction to plugins](https://backstage.io/docs/plugins/)
- [Backstage Design Guidelines](https://backstage.io/docs/dls/design)
- [Backstage Plugin Development](https://backstage.io/docs/plugins/plugin-development)
- [Backstage Plugin Structure](https://backstage.io/docs/plugins/structure-of-a-plugin)

:::important
Backstage fronted and backend systems have changed considerably over time. You will find outdated documentation in many places as well as legacy plugins that may work, but won't adapt to the new systems or work as dynamic plugins.
:::

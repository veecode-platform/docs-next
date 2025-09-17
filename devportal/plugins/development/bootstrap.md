---
sidebar_position: 6
sidebar_label: Bootstrap
title: Bootstrapping a Plugin Project
---

This guide walks you through creating a Backstage plugin project from scratch. The most important concept is that a plugin under development lives inside a "vanilla" Backstage app repository. You first create a Backstage app (the host), then scaffold one or more plugins inside it.

You will later package the plugin as a static plugin and a dynamic plugin, so that it can be installed in a DevPortal instance.

## Configure yarn

A recently installed Node.js version may not have yarn configured. If that is the case, run the following command:

```sh
corepack enable
```

## Create a Backstage app (plugin host)

Create the Backstage app that will host your plugin(s). This app provides the frontend shell, the backend runtime, and routing where your plugin will run.

Using the official Backstage app creator:

```bash
npx @backstage/create-app@latest
# Follow the prompts, e.g. enter an app name like "my-devportal"
```

Then move into the created directory and run it locally to validate the baseline works:

```bash
cd my-devportal
yarn install
yarn start
```

This starts both the frontend (usually on http://localhost:3000) and backend (http://localhost:7007), so make sure these ports are not used by other applications. Keep this running in a terminal while developing.

:::important
Please note this entire project should be versioned in order to be able to mantain it continuously. You should make it clear on the README file the project intent and help future onboarding.
:::

## Bootstrap the plugin

Inside the Backstage app repository root, you may create a new plugin using a simple interactive command:

```sh
yarn new
? What do you want to create? (Use arrow keys)
❯ frontend-plugin - A new frontend plugin 
  backend-plugin - A new backend plugin 
  backend-plugin-module - A new backend module that extends an existing backend plugin 
  plugin-web-library - A new web library plugin package 
  plugin-node-library - A new Node.js library plugin package 
  plugin-common-library - A new isomorphic common plugin package 
  web-library - A library package, exporting shared functionality for web environments
  node-library - A library package, exporting shared functionality for Node.js environments 
  scaffolder-backend-module - A module exporting custom actions for @backstage/plugin-scaffolder-backend
```

At this point you must choose the type of plugin you want to create.

You may avoid the interactive prompt by telling the command which type of plugin you want to create. Check the examples below:

```sh
# create a new frontend plugin
yarn new --select frontend-plugin --option pluginId=my-front-plugin
# create a new backend plugin
yarn new --select backend-plugin --option pluginId=my-back-plugin
# create a new custom action module
yarn new --select scaffolder-backend-module --option moduleId=my-scaffold-plugin
```

You get for every created plugin a new package at `plugins/your-plugin-id/`.



## 3) Scaffold a backend plugin (optional)



## 4) Develop locally

- Run `yarn dev` at the repo root to start the frontend and backend together.
- Edit your plugin source under `packages/my-plugin/` (frontend) and rerun the page.
- For backend code, edit under `packages/backend/plugins/my-backend-plugin/` and watch the backend reload.

## 5) Next steps

- Add UI elements (cards, widgets) using [Backstage components](https://backstage.io/storybook/) and [Material UI](https://mui.com/material-ui/).
- Add routes, entity pages, or catalog integrations as needed.
- If your plugin will be distributed, plan for two packages: a static plugin and a dynamic plugin variant. See the distribution and dynamic plugin docs in this section.

## Troubleshooting tips

- If `yarn backstage-cli` is not found, ensure `node_modules/.bin` is on your PATH or invoke via `yarn backstage-cli` from the repo root.
- Version mismatches can cause scaffolded code to differ. Use the latest Backstage app and CLI when starting a new project.
- Clear `node_modules` and reinstall (`yarn install`) if you encounter odd build errors.

## References

- Backstage: Create an app — https://backstage.io/docs/getting-started/create-an-app
- Backstage: Plugin development — https://backstage.io/docs/plugins/plugin-development

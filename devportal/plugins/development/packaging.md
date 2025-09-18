---
sidebar_position: 14
sidebar_label: Packaging
title: "Packaging your Plugin"
---

Plugins must be built and packaged before being being published or distributed. We have been using for local plugin development a "vanilla" Backstage project created with the Backstage CLI, and we will always keep it clean and simple.

A real-world Backstage build will refer to released plugins as dependencies during build time. A real world VeeCode DevPortal instance may also dynamically load plugins during start time.

## Build the plugin

To build all plugins under the host Backstage project just go to its root folder and run:

```bash
yarn tsc
yarn build:all
```

This will generate a `dist` folder under each plugin folder and a `dist-types` folder under the root folder.

## Package the plugin

You can now package the plugin using the `npm pack` command:

```bash
cd plugins/<your-plugin>
npm pack
```

:::warning
If you get "missing a backstage.pluginPackages" error, run `yarn fix --publish` at the project root folder and try again.
:::

## Publish the plugin

A published plugin becomes available to other Backstage projects who wish to statically link it.

Check if your plugin is marked as "private" in its `package.json` file. If it is, remove the "private" field or set it to `false`:

```json
{
  "name": "@something/your-plugin",
  "private": false,
  ...
}
```

You can now publish the plugin to npm using the `npm publish` command:

```bash
cd plugins/<your-plugin>
npm publish
```

:::tip
You can rely on a local npm registry like [Verdaccio](https://verdaccio.org/) for development and testing purposes.
:::

If you are using a local registry like Verdaccio, just add its URL:

```bash
npm publish --registry http://localhost:4873
```

## Publish a Dynamic Plugin

A dynamic plugin is a plugin that can be loaded at runtime. It is a plugin that is not statically linked to the host Backstage project, but is loaded at start time.

Technically, a dynamic plugin is just a slightly different repackaging of a regular plugin, but with a different name.

To create a dynamic package run this command at the plugin folder *after you have already built and packaged it successfully* as a "normal" plugin:

```bash
cd plugins/<your-plugin>
npx @red-hat-developer-hub/cli@latest plugin export
```

The distributed version of the plugin will now be available in a new `dist-dynamic` folder. You can now package and publish it as a dynamic plugin:

```bash
cd dist-dynamic
npm pack
npm publish --registry <your-local-registry-url>
```

:::info
The `@red-hat-developer-hub/cli` replaced the old `@janus-idp/cli` tool for dynamic plugin exporting. You may still find references to the old tool in the documentation or pages that were not yet updated.
:::

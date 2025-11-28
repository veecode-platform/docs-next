---
sidebar_position: 6
sidebar_label: Custom home plugin
title: Custom home plugin
---

The entire DevPortal “home” can be replaced by your own custom dynamic plugin.

:::info
Please understand this is a development effort that involves coding a custom plugin and packaging it as an NPM package.
:::

The process for creating a “plugin-home” is described in the official Backstage documentation at [Backstage homepage - Setup and Customization](https://backstage.io/docs/getting-started/homepage).

## Dynamic config

This plugin requires a dynamic config to define its dynamicRoute:

```yaml
dynamicPlugins:
  frontend:
    veecode-platform.plugin-veecode-homepage:
      dynamicRoutes:
        - path: /
          importName: VeecodeHomepagePage
          config:
            props:
              width: 1500
              height: 800
```

## Branding

Config elements under `appConfig` that affect the home plugin (most are branding related):

```yaml
branding:
  fullLogo: string
  fullLogoDarkMode: string
  theme:
    light:
      primaryColor: string
      headerColor1: string
      headerColor2: string
      navigationIndicatorColor: string
    dark:
      primaryColor: string
      headerColor1: string
      headerColor2: string
      navigationIndicatorColor: string
support:
  url: string
```

## Source code

The source code for the current DevPortal home plugin is at [VeeCode Header Plugin](https://github.com/veecode-platform/devportal-plugins/tree/main/workspace/homepage)

---
sidebar_position: 4
sidebar_label: Adding Plugins
title: Adding Plugins
---

You can add new dynamic plugins to your DevPortal instance at any time to enrich your developer experience with new features and integrations.

:::important
Please understand that **in the future** our recommended way to add plugins to your DevPortal instance will be through the [VeeCode Admin-UI](/admin-ui/intro). This will provide a marketplace-like experience for customers to discover and install plugins (under development).
:::

## Prerequisites

- Ability to run a DevPortal instance.
- The dynamic Backstage plugin that you want to add to your DevPortal instance.
- Good defaults for the plugin configuration (or a detailed configuration guide).

For the examples in this page we will use a custom frontend dynamic plugin forked from its [public repo](https://github.com/redhat-developer/rhdh-plugins/tree/main/workspaces/global-floating-action-button/plugins/global-floating-action-button) and adapted for this use case.

TODO: plugin image

## Using Admin-UI

TODO

## Using VKDR (local setup)

If you are using VKDR to manage your local DevPortal instance, you can add new plugins to DevPortal by using the `--merge` argument during DevPortal install referencing a YAML file with a `dynamic` section:

```bash
vkdr devportal install \
  --github-token=$GITHUB_TOKEN \
  --install-samples \
  --merge ./floating.yaml
```

The `floating.yaml` file should have a `dynamic` section with the plugin you want to add:

```yaml
global:
  dynamic:
    plugins:
      - package: '@veecode-platform/backstage-plugin-global-floating-action-button-dynamic@1.4.0'
        disabled: false
        integrity: sha512-XrXfTDGWtrUMF9VOQ/0mMsqXY4J0V2yos6guhMDzczgM2kxNepDSnL5NkIzUPSw5bdS46ATIkYEk9nt/oLJnjw==
        pluginConfig:
          dynamicPlugins:
            frontend:
              red-hat-developer-hub.backstage-plugin-global-floating-action-button:
                mountPoints:
                  - mountPoint: application/listener
                    importName: DynamicGlobalFloatingActionButton
                  - mountPoint: global.floatingactionbutton/config
                    importName: NullComponent
                    config:
                      icon: github
                      label: 'Git'
                      toolTip: 'Github'
                      to: https://github.com/veecode-platform/devportal
```

## Using Helm

If you are using Helm to manage your DevPortal instance, you can add a new plugin to your DevPortal instance by adding the plugin config above to the `global.dynamic` section in the `values.yaml` file:

```yaml
global:
  dynamic:
    plugins:
      ...   
```

:::warning
Please note that the plugin list under `global.dynamic.plugins` is an array, so you can add multiple plugins to your DevPortal instance. You may also want to remember you are overriding the default value for the plugin list: check this section in the chart's [values.yaml](https://github.com/veecode-platform/next-charts/blob/main/veecode-devportal-chart/values.yaml) file if you are uncertain about it.
:::

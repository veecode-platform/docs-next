---
sidebar_position: 1
sidebar_label: Customizing DevPortal
title: Customizing DevPortal
---

VeeCode DevPortal follows Backstage's standards for customizing the UI and adds a few extra options:

- **Simple branding:** there is an entire branding section in the `appConfig` section of DevPortal configuration (also under `values.yaml`) that lets you pick one of the pre-defined theme variants and its light/dark options, allowing you top customize every single aspect from it.
  
- **Custom theme hacking:** a few simple properties in the `global.theme` section of the `values.yaml` file can help you hack some custom colors into whatever theme variant you are using.

- **Custom home page plugin:** the entire home page can be customized by using the Backstage plugin system (https://backstage.io/docs/getting-started/homepage)

- **Custom header plugin:** the header shared by all pages can also be customized by using the Backstage plugin system

Usually the branding option is all you need to customize the look and feel of your DevPortal. If you need to go beyond that, you can use the custom theme hacking option or even create a custom plugin if you are feeling brave.

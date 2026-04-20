---
sidebar_position: 6
sidebar_label: Configure Git integration
title: Configure Git provider integration
---

## Why do we need this?

In order to create and manage catalog repositories or to interact with your Git provider's APIs, we need to configure DevPortal with your credentials. There are many useful GitHub related plugins that make your experience with VeeCode DevPortal even better and they all require this Git provider integration.

:::info
Our documentation is still in progress and we currently provide information on integration against GitHub and GitLab. There are Backstage plugins that provide integration against other Git providers, such as Bitbucket and Azure DevOps, and those should work too.
:::

## Choose your provider

Follow the detailed setup instructions for your Git provider in the [Auth & Integrations](/devportal/integrations/integrations) section:

- [GitHub](/devportal/integrations/github/github) — authentication, backend integrations, and personal access tokens
- GitLab — coming soon

Once you have your credentials configured, add the corresponding values to your `values.yaml` file under `upstream.backstage.appConfig` and redeploy.

---
sidebar_position: 0
sidebar_label: Simple setup
title: Simple setup
---

While in the previous [Local Setup](../vkdr-local/vkdr-setup.md) section we have installed VeeCode DevPortal on a local temporary cluster, in this guide we will install it on a real live Kubernetes cluster in the simplest possible way, so other people may try it.

This setup is a little more elaborated:

- You will use the official Helm chart to install VeeCode DevPortal
- You will provide a GitHub organization (or Gitlab group) to host your catalog
- You will provide a minimal values file to configure the installation
- You will deploy and then configure the integration with your Git provider

These steps should suffice for smaller teams for testing purposes or even for production use.

- [Check prerequisites and accounts](./check-prerequisites.md)
- [Create or choose a target organization/group](./target-organization-group.md)
- [Choose a base template catalog](./choose-template-catalog.md)
- [Create a "values" file](./create-values-file.md)
- [Deploy VeeCode DevPortal](./deploy-devportal.md)
- [Configure Git provider integration](./configure-git-integrations.md)

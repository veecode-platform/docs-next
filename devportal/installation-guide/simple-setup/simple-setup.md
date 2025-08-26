---
sidebar_position: 0
sidebar_label: Simple setup
title: Simple setup
---

While in the previous [Local Setup](./local-setup) section we have installed VeeCode DevPortal on a local temporary cluster, in this guide we will install it on a real live Kubernetes cluster in the simplest possible way, so other people mey try it a little bit.

Thi setup is a little more elaborated:

- You will use the official Helm chart to install VeeCode DevPortal
- You will provide a GitHub organization (or Gitlab group) to host your catalog
- You will configure the integration with your Git provider (GitHub or Gitlab)
- You will provide a values file to configure the installation

These steps should suffice for smaller teams for testing purposes or even for production use.

- [Check prerequisites and accounts](./check-prerequisites)
- [Create or choose a target organization/group](./target-organization-group)
- [Choose a base template catalog](./choose-template-catalog)
- [Configure Github/Gitlab integration](./configure-git-integrations)
- [Create a "values" file](./create-values-file)
- [Deploy VeeCode DevPortal](./deploy-devportal)

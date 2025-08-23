---
sidebar_position: 1
sidebar_label: VKDR Intro
title: VKDR Intro
---

import style from './style.module.css';


# Intro

VKDR stands for "VeeCode Kubernetes Development Runtime", a simple command-line tool that aids on running a local Kubernetes cluster and a few tools that otherwise are quite a bit cumbersome to get them right.

This is a **very** opinionated tool, and it is designed mostly for local executions. It is not meant to be used for production setups (except the simplest ones), but rather a tool that helps developers to get started with both Kubernetes and VeeCode products and stacks.

## Pre-reqs

A container engine like [Docker](https://docs.docker.com/engine/install/) or [Docker Desktop](https://docs.docker.com/desktop/) is required to run the local Kubernetes cluster. The `vkdr` tool uses `k3d` internally to start clusters - although this is transparent to the user. Check on [k3d site](https://k3d.io/) for more information on supported container engines.

:::note
The `vkdr` CLI may work with other container engines like `podman` or `orbstack`, but it has not been tested in them. Feel free to try and push a PR if you want to add support for any of those.
:::

## Installing VKDR

Just use the convenience script:

```bash
curl -s https://get-vkdr.vee.codes | bash
```

VKDR must be initialized before it can be used. This is done by running:

```bash
vkdr init
```

VKDR can also be upgraded by itself:

```bash
vkdr upgrade
vkdr init
```

Alternatively, you can install VKDR manually by downloading the latest release from the [releases page](https://github.com/veecode-platform/vkdr/releases) and placing it in your PATH (we sugest `/usr/local/bin/`).
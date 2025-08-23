---
sidebar_position: 2
sidebar_label: nginx
title: nginx
---

# vkdr nginx

Use these commands to install (or remove) NGinx as an ingress controller in your `vkdr` cluster.

## vkdr nginx install

Install NGinx as an ingress controller in your `vkdr` cluster:

```bash
vkdr infra start # default ports are 8001 (http) and 8001 (https)
vkdr nginx install --default-ic # NGinx as default ingress controller (optional)
```

You can start the cluster using the `--http` and `--https` flags to pick specific ports for HTTP and HTTPS traffic, respectively:

```bash
vkdr infra start --http 80 --https 443
vkdr nginx install --default-ic # NGinx as default ingress controller (optional)
```

## vkdr nginx remove

Remove NGinx from your `vkdr` cluster:

```bash
vkdr nginx remove
```

---
sidebar_position: 3
sidebar_label: infra
title: infra
---

# vkdr infra

The `vkdr infra` commands are used to manage the single local cluster where `vkdr` may be able to install other tools.

## vkdr infra start

This command will start the local `vkdr` cluster. The `vkdr` cluster is a single-node `k3d` cluster with a few opinionated settings and optimizations.

This command will also start a pass-through local registry in port 6000. All image pulls from the `vkdr` cluster will be redirected to this local registry transparently, avoiding Docker Hub current limits.

```bash

This example starts the cluster with Traefik as its ingress controller exposed in 8000/8001 ports:
    
```bash
# default ports are 8000/8001
vkdr infra start --traefik
```

This example starts the cluster without an ingress controller, but ready to expose one in ports 80/443:
    
```bash
vkdr infra start --http 80 --https 443
```

## vkdr infra stop

This command stops the local `vkdr` cluster.

```bash
vkdr infra stop
```

## vkdr infra up

This is just a shortcut for `vkdr infra start` with all defaults.

```bash
# no ingress controller, default ports are 8000/8001
vkdr infra up
```

## vkdr infra down

This is just a shortcut for `vkdr infra stop` with all defaults.

```bash
# no ingress controller, default ports are 8000/8001
vkdr infra down
```

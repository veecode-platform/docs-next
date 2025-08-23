---
sidebar_position: 1
sidebar_label: Overview
title: Overview
---

# Ingress Commands

## Overview

These commands are related to exposing `vkdr` applications through exposed TCP ports (mostly HTTP/HTTPS).

# Overview

When starting the `vkdr` cluster you have an option to enable Traefik as its default ingress controller, but there are other ingress controllers available in `vkdr` too: NGinx, Kong and others to come. You can use our own commands to install Traefik, NGinx or Kong - they may even coexist in different ports.

## Examples:

### Traefik as default ingress

Starts a `vkdr` cluster and install NGinx as its ingress controller:

```bash
vkdr infra start --traefik # 8000/8001 ports
curl localhost:8000 # should return 404 error after Traefik starts
curl -k https://localhost:8001 # same
vkdr infra stop
```

### NGinx as default ingress

Starts a `vkdr` cluster and install NGinx as its ingress controller:

```bash
vkdr infra up # 8000/8001 ports, no ingress
vkdr nginx install --default-ic # NGinx as default ingress
curl localhost:8000 # should return 404 error after NGinx starts
curl -k https://localhost:8001 # same
vkdr infra stop
```

## Notes

A "default ingress controller" is a somewhat deprecated (but still useful) Kubernetes concept: any Ingress object that does not define an ingress class will be served by the default ingress controller.

Most `vkdr` commands that install applications will rely the default ingress controller (for the time being).

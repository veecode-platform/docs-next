---
sidebar_position: 1
sidebar_label: Overview
title: Overview
---

# Basic Commands

## Overview

These commands are related to basic `vkdr` operations, like starting and stopping a local cluster.

A local `vkdr` cluster defines:

- Both "http" and "https" ports to expose a LoadBalancer service (usually an *ingress controller*)
- A port range for NodePort services
- A port to expose Kubernetes admin API

## Example

A simple local `vkdr` cluster setup would be like this:

```bash
# default ports are 8000/8001
vkdr infra start --traefik
# sample app
vkdr whoami install
# test whoami
curl http://whoami.localhost:8000/
```


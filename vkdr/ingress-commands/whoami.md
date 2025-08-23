---
sidebar_position: 4
sidebar_label: whoami
title: whoami
---

# vkdr whoami

Use these commands to install/remove a sample `whoami` application to test cluster ingress behaviour.

## vkdr whoami install

```bash
vkdr infra up
vkdr nginx install --default-ic
vkdr whoami install
curl whoami.localhost:8000
```

## vkdr whoami remove

```bash
vkdr whoami remove
```

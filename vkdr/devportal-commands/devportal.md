---
sidebar_position: 4
sidebar_label: devportal
title: devportal
---

# vkdr devportal

Use these to install/remove VeeCode DevPortal (our own ready-to-use Backstage distro).

Note: currently DevPortal requires Kong as `vkdr` ingress controller.

## vkdr devportal install

```bash
vkdr infra up
vkdr kong install --default-ic
vkdr devportal install
```

## vkdr devportal remove

```bash
vkdr devportal remove
```

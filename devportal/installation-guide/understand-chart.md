---
sidebar_position: 6
sidebar_label: Understand the Helm Chart
title: Understand the Helm Chart
---

VeeCode DevPortal Helm chart can be used to install and configure our Backstage distribution and a whole set of plugins to provide a full Internal Development Portal experience.

The chart is available on [ArtifactHub](https://artifacthub.io/packages/helm/veecode-platform/devportal) and is mantained in a dedicated [GitHub repository](https://github.com/veecode-platform/next-charts).

## Important sections

A few sections are worth some deeper analysis:

- **Global settings**

The `host`, `protocol` and `port` settings define the domain you will use to access the portal:

```yaml
global:
  host: yourhost.yourdomain.com # change to your domain
  protocol: https # usually https
  port: '' # must start with ':', defaults to empty
```

They actually work as a convenience to define the default value for several other settings:

- `upstream.backstage.appConfig.app.baseUrl`
- `upstream.backstage.appConfig.backend.baseUrl`
- `upstream.backstage.appConfig.backend.cors.baseUrl`
- `upstream.ingress.host`

TODO: add more sections
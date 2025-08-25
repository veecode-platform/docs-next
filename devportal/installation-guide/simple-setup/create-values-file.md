---
sidebar_position: 5
sidebar_label: Create a "values" file
title: Create a values.yaml file
---

## Helm values file

Create a `values.yaml` in a safe place where you can keep it (and share with other admins). Populate it with host, auth, token, and catalog settings for your provider.

:::tip
Note that the official Backstage chart is a subchart of VeeCode DevPortal chart, referenced as "upstream" on the values file. This means that you can refer to [Backstage Helm chart repo](https://github.com/backstage/charts/tree/main/charts/backstage) for more information on its fields and behaviour.
:::

### Backstage appConfig

It is also worth noticing that both Backstage and VeeCode DevPortal main configuration are the same `app-config.yaml` file mentioned all over [Backstage documentation](https://backstage.io/docs/), so usually any settings you find on Backstage or in a plugin documentation are usually valid for VeeCode DevPortal as well - after all VeeCode DevPortal is a Backstage distribution.

The whole content of the `app-config.yaml` file is rendered by the Helm chart installation and can be coded on the `values.yaml` file under `upstream.backstage.appConfig` (just as defined on Backstage official Helm chart).

:::warning
Please understand that the resulting `app-config.yaml` file is a merge from what you define on the `values.yaml` file you provide with the default values from VeeCode DevPortal Helm chart. A lot of effort went into making these defaults easy to use and good to go from the start, but feel free to [revise the default values](https://github.com/veecode-platform/next-charts/blob/main/veecode-devportal-chart/values.yaml).
:::

### Sample values file

You may find below a sample `values.yaml` file that you can use as a starting point for a simple setup. For now you can replace the `${}` placeholders with the values you got from the previous steps. You can also use some random value for the `${BACKEND_AUTH_SECRET_KEY}` placeholders.

```yaml
global:
  host: localhost # change to your domain
  protocol: http # usually https
  port: '8000' # need quotes, defaults to empty
upstream:
  enabled: true
  fullnameOverride: veecode-devportal # do not change
  ingress:
    enabled: true
  backstage:
    appConfig:
      auth:
        environment: "development"
        session:
          secret: "${BACKEND_AUTH_SECRET_KEY}"
        providers:
          #guest:
          #  dangerouslyAllowOutsideDevelopment: true
          github:
            development:
              clientId: ${GITHUB_CLIENT_ID}
              clientSecret: ${GITHUB_CLIENT_SECRET}
              signIn:
                resolvers:
                  - resolver: usernameMatchingUserEntityName
                  - resolver: emailMatchingUserEntityProfileEmail
                  - resolver: emailLocalPartMatchingUserEntityName
      app:
        analytics:
          ga4:
            measurementId: something
            identity: optional
            testMode: false
            debug: true
      backend:
        auth:
          externalAccess:
            - type: static
              options:
                token: ${BACKEND_AUTH_SECRET_KEY}
                subject: secret
      scaffolder:
        providers:
          github:
            - host: "github.com"
              token: ${GITHUB_TOKEN}
      platform:
        guest:
          enabled: false
      catalog:
        providers:
          githubOrg:
            id: providerId
            githubUrl: https://github.com
            orgs:
              - "YOUR_CHOSEN_ORGANIZATION"
            schedule:
              frequency:
                minutes: 20
              timeout:
                minutes: 3
      integrations:
        github:
          - host: "github.com"
            apps:
              - appId: ${GITHUB_APP_ID}
                clientId: ${GITHUB_CLIENT_ID}
                clientSecret: ${GITHUB_CLIENT_SECRET}
      grafana:
        domain: grafana.localhost
        unifiedAlerting: true
```

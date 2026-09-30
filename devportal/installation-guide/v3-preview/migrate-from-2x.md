---
sidebar_label: Migrate from 2.x
sidebar_position: 3
title: Migrate from DevPortal 2.x to 3.x
---

# Migrate from DevPortal 2.x to 3.x

:::warning Preview status
DevPortal 3.x is a preview. DevPortal 2.x remains the supported production line until 3.x is released.
:::

This guide moves a self-hosted DevPortal **2.x** that you installed with the Helm chart `veecode-devportal-platform` to DevPortal **3.x**. The 2.x chart keeps its data in an external PostgreSQL database by default, or in SQLite if you chose that.

The migration goes to a **fresh database**. Nothing is converted in place:

- The 3.x release gets its own databases. It never opens the 2.x databases.
- The 2.x release stays installed but stopped. Going back to 2.x means removing the 3.x release and restoring the 2.x one, on the data it already has.
- The portal is down from the moment you stop 2.x until the 3.x portal has started for the first time, usually a few minutes.

## What comes back and what does not

| | After the migration |
|---|---|
| Catalog entities from the locations in your configuration (`catalog.locations`) | Come back on their own. The catalog reads them again from their sources at first start. |
| Users and groups from your identity provider | Come back on their own. The catalog provider reads them again, and people sign in through the provider as before. |
| Marketplace installs | **Do not carry over.** List them in step 1 and install them again in step 7. |
| Locations registered in the portal (Catalog, Register existing component) | **Do not carry over.** List them in step 1 and register them again in step 7. |
| Scaffolder task history | **Does not carry over.** |
| User settings, such as the theme | **Do not carry over.** |

Step 4 translates the settings this guide was tested with: external PostgreSQL, Keycloak sign-in and catalog locations. Any other setting in your 2.x values has no automatic translation. Map it by hand against the `values.yaml` of the 3.x chart.

:::danger Guest sign-in is on by default in 3.x
The 3.x chart turns guest sign-in on and maps every guest to the `admin` user. Anyone who can reach the portal URL enters as an administrator. The values file in step 4 turns it off and configures a real identity provider. Do not expose the portal before both are in place.
:::

## Before you start

You need:

- `kubectl`, `helm` 3 and `jq`, with access to the namespace of the 2.x release;
- the PostgreSQL server of the 2.x install and its user. The 3.x portal creates its own databases, so the user needs the `CREATEDB` privilege, as in 2.x;
- a real identity provider for the 3.x portal. The examples use Keycloak, which is what the 2.x `keycloak` preset configured;
- the 3.x install guide ("Install DevPortal 3.x"), which covers everything about installing 3.x that this page does not repeat.

This guide was followed end to end with chart `veecode-devportal-platform` 0.5.2 (DevPortal 2.x) moving to chart `devportal` 0.1.26, which installs image 3.0.0-beta.10, on Kubernetes with PostgreSQL 16 and Keycloak 26.

Set these variables once. Every command below uses them:

```bash
export NAMESPACE=devportal
export V2_RELEASE=devportal
export V2_SECRET=devportal-credentials
export V3_RELEASE=devportal3
```

- `NAMESPACE` and `V2_RELEASE` come from `helm list --all-namespaces`.
- `V2_SECRET` is the Secret named by `existingSecret` in your 2.x values (`helm get values "$V2_RELEASE" -n "$NAMESPACE"`).
- `V3_RELEASE` is the name of the new release. It must differ from `V2_RELEASE`.

## Step 1: Take stock of the 2.x install

Save the 2.x values and note the current revision of the release. You need both for the way back:

```bash
helm get values "$V2_RELEASE" -n "$NAMESPACE" -o yaml > v2-values.yaml
export V2_REVISION=$(helm history "$V2_RELEASE" -n "$NAMESPACE" -o json | jq -r 'map(select(.status == "deployed")) | last | .revision')
echo "2.x chart revision: $V2_REVISION"
export V2_DEPLOYMENT=$(kubectl -n "$NAMESPACE" get deploy -l app.kubernetes.io/instance="$V2_RELEASE" -o name)
```

List the **marketplace installs**. The 2.x portal keeps them in a file that mirrors its database:

```bash
kubectl -n "$NAMESPACE" exec "$V2_DEPLOYMENT" -- cat /app/data/extensions-install.yaml | tee marketplace-installs-2x.yaml | grep 'package:'
```

List the **locations registered in the portal**. In the catalog, set the Kind filter to Location and write down the target of each entry. Locations that come from `catalog.locations` in your values need no action: they are in `v2-values.yaml` and come back by themselves.

Count the entities of your own sources for the check in step 6. Compare only those. The portal also adds entities of its own, such as the marketplace catalog, and their number differs between 2.x and 3.x.

## Step 2: Stop the 2.x release

Scale the 2.x release to zero and remove its ingress, so that the 3.x release can take over the host name. The release, its Secret, its volumes and its databases stay where they are:

```bash
helm upgrade "$V2_RELEASE" veecode-devportal-platform --repo https://veecode-platform.github.io/next-charts -n "$NAMESPACE" --reuse-values --set replicaCount=0 --set ingress.enabled=false
```

Add `--version` with the chart version that `helm list` shows for your release if you want to be certain that the upgrade leaves it unchanged.

## Step 3: Create the 3.x runtime Secret

The 3.x chart reads its database settings and secrets from a Secret named `veecode-runtime-secrets`. Copy every key of the 2.x Secret, which already holds the `PG_*` keys, and add the `BACKEND_SECRET` key that 3.x requires:

```bash
kubectl -n "$NAMESPACE" get secret "$V2_SECRET" -o json \
  | jq --arg backend "$(openssl rand -hex 16 | base64 -w0)" '{apiVersion: "v1", kind: "Secret", metadata: {name: "veecode-runtime-secrets"}, type: "Opaque", data: (.data + {BACKEND_SECRET: $backend})}' \
  | kubectl -n "$NAMESPACE" apply -f -
```

## Step 4: Write the 3.x values

The 3.x chart has no presets. What the `recommended` preset enabled in 2.x ships with the 3.x image, and the settings that the `keycloak` preset applied become plain configuration. The file below translates a 2.x install with the `recommended` and `keycloak` presets, external PostgreSQL and one catalog location. Save it as `values-v3.yaml` and replace the example addresses with your own:

```yaml title="values-v3.yaml"
global:
  veecode:
    guestAuth:
      enabled: false
  dynamic:
    plugins:
      - package: ./dynamic-plugins/dist/backstage-community-plugin-catalog-backend-module-keycloak-dynamic
        disabled: false
upstream:
  backstage:
    extraEnvVarsSecrets:
      - veecode-runtime-secrets
    appConfig:
      app:
        baseUrl: https://devportal.example.com
      backend:
        baseUrl: https://devportal.example.com
        cors:
          origin: https://devportal.example.com
        database:
          prefix: devportal3_plugin_
      signInPage: oidc
      auth:
        environment: production
        session:
          secret: ${AUTH_SESSION_SECRET}
        providers:
          oidc:
            production:
              metadataUrl: ${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}
              clientId: ${KEYCLOAK_CLIENT_ID}
              clientSecret: ${KEYCLOAK_CLIENT_SECRET}
              prompt: auto
              signIn:
                resolvers:
                  - resolver: oidcSubClaimMatchingKeycloakUserId
                  - resolver: preferredUsernameMatchingUserEntityName
                  - resolver: emailMatchingUserEntityProfileEmail
                  - resolver: emailLocalPartMatchingUserEntityName
      catalog:
        providers:
          keycloakOrg:
            default:
              baseUrl: ${KEYCLOAK_BASE_URL}
              loginRealm: ${KEYCLOAK_REALM}
              realm: ${KEYCLOAK_REALM}
              clientId: ${KEYCLOAK_CLIENT_ID}
              clientSecret: ${KEYCLOAK_CLIENT_SECRET}
              schedule:
                frequency: { minutes: 10 }
                initialDelay: { seconds: 15 }
                timeout: { minutes: 10 }
        locations:
          - type: url
            target: https://github.com/example-org/catalog/blob/main/catalog-info.yaml
```

How the 2.x settings map:

| 2.x | 3.x in `values-v3.yaml` |
|---|---|
| `presets: [recommended]` | Nothing to set. The marketplace, the Tech Radar and the other defaults ship with the image. |
| `presets: [keycloak]` | `signInPage`, `auth` and the `keycloakOrg` catalog provider. They read the same `KEYCLOAK_*` and `AUTH_SESSION_SECRET` variables, which the Secret of step 3 carries over. The Keycloak catalog module is a plugin in 3.x, so the `global.dynamic.plugins` entry enables it. |
| `existingSecret` | `upstream.backstage.extraEnvVarsSecrets`, pointing at the Secret of step 3. |
| `database.external.enabled: true` | Nothing to set. 3.x always uses your PostgreSQL, through the `PG_*` keys of that Secret. |
| `appConfig.app`, `appConfig.backend`, `appConfig.catalog.locations` | The same keys under `upstream.backstage.appConfig`. |
| (new in 3.x) | `global.veecode.guestAuth.enabled: false` turns guest sign-in off. |
| (new in 3.x) | `backend.database.prefix` gives the 3.x release its own databases. |

:::warning Always set `backend.database.prefix`
Backstage does not keep a plugin's data in the database named by `PG_DATABASE`. It creates one database per plugin and names it after a prefix: `backstage_plugin_catalog`, `backstage_plugin_scaffolder` and so on. A new `PG_DATABASE` value isolates nothing. A 3.x release that keeps the default prefix on the same server opens the 2.x databases and changes them, and the way back is gone. The value `devportal3_plugin_` above gives 3.x its own set and leaves the 2.x set alone. If you point 3.x at a different PostgreSQL server, you do not need the prefix.
:::

## Step 5: Install 3.x

Add the chart repository and install the release. The first start pulls every plugin image and can take several minutes:

```bash
helm repo add veecode https://veecode-platform.github.io/next-charts
helm repo update
helm install "$V3_RELEASE" veecode/devportal --version 0.1.26 -n "$NAMESPACE" -f values-v3.yaml --wait --timeout 20m
```

The Keycloak client of your 2.x install must list the address of the 3.x portal among its redirect URIs. If the address is the same as in 2.x, nothing changes.

## Step 6: Check the result

Wait for the 3.x portal to become ready:

```bash
kubectl -n "$NAMESPACE" rollout status "deploy/$V3_RELEASE-developer-hub"
```

Then check:

1. **Sign-in.** Open the portal at its address, sign in through Keycloak as a user who signed in before, and as a second user.
2. **Users and groups.** They appear in the catalog under Kind: User and Kind: Group, read again from Keycloak.
3. **Catalog.** The entities from your `catalog.locations` are back, and the count of your own sources matches the count from step 1.
4. **Guest sign-in is off.** The sign-in page offers Keycloak only.

## Step 7: Install the marketplace plugins and locations again

Open the Marketplace in the portal and install each plugin from `marketplace-installs-2x.yaml` again. Register again the locations you wrote down in step 1.

## Going back to 2.x

The 2.x databases were not touched, so going back is a rollback of the 2.x release:

```bash
helm uninstall "$V3_RELEASE" -n "$NAMESPACE"
helm rollback "$V2_RELEASE" "$V2_REVISION" -n "$NAMESPACE"
```

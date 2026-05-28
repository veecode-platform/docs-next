---
sidebar_position: 16
sidebar_label: Loading
title: "Loading a Dynamic Plugin"
---

Dynamic plugins can be loaded by VeeCode DevPortal at start time. They are usually published to a private npm registry or OCI registry, and the DevPortal instance will load them from there according to the configuration.

## Configuration

There are two configuration surfaces depending on your deployment model:

### `dynamic-plugins.yaml` (distro container / SaaS)

For the standard DevPortal container (docker-compose, SaaS, or VKDR), edit `dynamic-plugins.yaml` directly:

```yaml
plugins:
  # npm plugin
  - package: '@yourorg/yourplugin@x.y.z'
    disabled: false
    integrity: sha512-xxxxxxxxx
  # preloaded plugin (uses path relative to the dynamic-plugins directory)
  - package: ./dynamic-plugins/dist/another-plugin-dynamic
    disabled: false
```

### Helm `values.yaml` (Kubernetes deployment)

For Kubernetes deployments using the VeeCode Helm chart, configure plugins under `global.dynamic.plugins`:

```yaml
global:
  dynamic:
    plugins:
      # npm plugin
      - package: '@yourorg/yourplugin@x.y.z'
        disabled: false
        integrity: sha512-xxxxxxxxx
      # preloaded plugin
      - package: ./dynamic-plugins/dist/another-plugin-dynamic
        disabled: false
```

Both surfaces accept the same plugin entry format. The `dynamic-plugins.yaml` approach is recommended for non-Helm deployments.

## Generating the `integrity` hash

The `integrity:` field is **required for remote npm packages** (unless the env var `SKIP_INTEGRITY_CHECK=true` is set). The installer downloads the package, recomputes its SHA-512, and refuses to load it on mismatch.

It is **not used** for:

- OCI packages (`oci://...`) — these are validated by digest comparison via `skopeo inspect`.
- Local paths (`./dynamic-plugins/dist/...`) — pre-bundled in the image; no download involved.

Expected format: `sha512-<base64>`. Two ways to generate it:

**Method A — query the npm registry directly (preferred for public packages):**

```bash
npm view <package>@<version> dist.integrity
# example
npm view @backstage/plugin-catalog@2.0.5 dist.integrity
```

Returns the hash in exactly the format the installer compares against. **Always pin the version** — `npm view <package> dist.integrity` (no version) returns the latest, which will mismatch if you have a specific version pinned in your `package:` field.

**Method B — compute it locally (fallback for private registries or when `npm view` fails):**

```bash
npm pack <package>@<version> && \
  HASH=$(cat <package>-<version>.tgz | openssl dgst -sha512 -binary | openssl base64 -A) && \
  echo "sha512-$HASH"
```

This replicates the exact pipeline the installer uses internally (`cat archive | openssl dgst -sha512 -binary | openssl base64 -A`), so the produced hash is guaranteed to match a successful install.

## Private npm registry

Due to security and compliance reasons you may not want VeeCode DevPortal to load plugins from public npm registries. You may prefer to use a private npm registry, like Nexus, Artifactory or even Verdaccio.

VeeCode DevPortal can be configured to rely on a private npm registry - you just have to configure a special secret named "veecode-devportal-dynamic-plugins-npmrc" (where "veecode-devportal" is the Helm release name) in the same namespace as the DevPortal deployment:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: veecode-devportal-dynamic-plugins-npmrc
  namespace: <your-namespace>
type: Opaque
stringData:
  .npmrc: |
    registry=<registry-url>
    //<registry-url>:_authToken=<auth-token>
```

Alternatively you can create the secret using the `kubectl` command:

```bash
kubectl create secret generic veecode-devportal-dynamic-plugins-npmrc \
  "--from-literal=.npmrc=registry=your-registry-url"
```

## Wiring plugins

Dynamic plugins wire themselves to the DevPortal instance through configuration. Unlike static plugins, they cannot modify the host Backstage project's code — wiring happens at runtime, declared in YAML.

**The wiring rule depends on the plugin's role**, declared in its `package.json` under `backstage.role`:

| Role | `pluginConfig` needed? | Where does its config go? |
|---|---|---|
| `frontend-plugin` | **Yes** — describes mount points, tabs, routes | Inside `pluginConfig.dynamicPlugins.frontend.<plugin-id>` |
| `backend-plugin` | **No** — auto-discovered by the loader | Plain top-level keys in `app-config.yaml` (e.g., `sonarqube:`, `gitlab:`) |
| `backend-plugin-module` | **No** — auto-attaches to its parent plugin | Plain top-level keys in `app-config.yaml` (parent plugin's config) |

There is no `dynamicPlugins.backend.*` key. Backend plugins never wire themselves through `pluginConfig` — the loader detects them by their package role and registers them automatically.

### Backend plugin example (no `pluginConfig`)

```yaml
plugins:
  - package: oci://quay.io/veecode/sonarqube:bs_1.49.4!backstage-community-plugin-sonarqube-backend
    disabled: false
    # No pluginConfig — backend role is auto-discovered
```

The plugin's runtime configuration goes in your regular `app-config.yaml` (or `app-config.local.yaml`) as a normal top-level section:

```yaml
sonarqube:
  baseUrl: ${SONARQUBE_URL}
  apiKey: ${SONARQUBE_TOKEN}
```

Same pattern for `backend-plugin-module` (e.g., a scaffolder action module attaches itself to the scaffolder plugin):

```yaml
plugins:
  - package: oci://quay.io/veecode/roadie-backstage-plugins:bs_1.49.4!roadiehq-scaffolder-backend-argocd
    disabled: false
    # No pluginConfig — module auto-attaches to the scaffolder backend
```

### Frontend plugin example (`pluginConfig` required)

Frontend plugins must declare where their UI components mount, because Backstage's frontend has no auto-discovery for routes, sidebars, tabs, or cards:

```yaml
plugins:
  - package: oci://quay.io/veecode/sonarqube:bs_1.49.4!backstage-community-plugin-sonarqube
    disabled: false
    pluginConfig:
      dynamicPlugins:
        frontend:
          backstage-community.plugin-sonarqube:
            mountPoints:
              - mountPoint: entity.page.overview/cards
                importName: EntitySonarQubeCard
                config:
                  if:
                    allOf:
                      - isSonarQubeAvailable
```

The plugin-id under `dynamicPlugins.frontend.<plugin-id>` is the npm package name with `@` removed and `/` replaced by `.` (note: `.`, not `-`, for this key specifically — different from the OCI reference convention).

See [Wiring a Frontend Plugin](wiring.md) for the full list of frontend mount points, tab paths, and the `scalprum` mechanism that processes these declarations at runtime.

## Tips

You can check the loaded plugins using this URL:

```bash
curl <your-devportal-url>/api/dynamic-plugins-info/loaded-plugins
```

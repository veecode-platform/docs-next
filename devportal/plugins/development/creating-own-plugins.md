---
sidebar_position: 20
sidebar_label: Creating Your Own Plugin
title: "Creating Your Own Plugin"
---

[Bootstrapping](./bootstrap.md) through [Wiring](./wiring.md) cover the mechanical steps of building a plugin. This page strings those steps into one loop you can run end to end: scaffold, build, export, load into devportal-local, and see the plugin run.

You need a Linux machine with Docker, Node 22 or 24, and Yarn 4.12.0. Clone the two public repositories side by side:

```bash
git clone https://github.com/veecode-platform/devportal-plugins.git
git clone https://github.com/veecode-platform/devportal-local.git
```

## 1. Scaffold a workspace

From the `devportal-plugins` checkout, create a workspace for the plugin type you need:

```bash
cd devportal-plugins
yarn create-workspace my-workspace --role frontend-plugin
cd workspaces/my-workspace
yarn install
```

See [Bootstrapping](./bootstrap.md) for the roles and the host Backstage line.

## 2. Build the plugin

Develop the plugin as described in [Example: Frontend Plugin](./frontend-plugin.md), [Example: Backend Plugin](./backend-plugin.md), or [Example: Custom Action](./custom-action.md). Then check and build every package in the workspace:

```bash
yarn tsc
yarn build:all
```

## 3. Export each plugin

Set the path to the side-by-side `devportal-local` checkout from the workspace root, then export each plugin package with the Backstage CLI:

```bash
export DEVPORTAL_LOCAL_DIR="$(cd ../../../devportal-local && pwd -P)"
cd plugins/my-front-plugin
npx --yes --package=@red-hat-developer-hub/cli@1.11.2 -- rhdh-cli plugin export --dev --dynamic-plugins-root "$DEVPORTAL_LOCAL_DIR/dynamic-plugins-src-dev"
```

For a backend-only workspace, return to the workspace root and run the same command from its package directory, such as `plugins/my-back-plugin-backend`. The command writes each export under `devportal-local/dynamic-plugins-src-dev`.

## 4. Load the export in devportal-local

In the `devportal-local` checkout, create the directory for the local files:

```bash
mkdir -p dynamic-plugins-root-dev
```

Create `dynamic-plugins-root-dev/dynamic-plugins.local.yaml`. Add the default plugin index and each exported package. Use the directory name created under `dynamic-plugins-src-dev`:

```yaml
includes:
  - dynamic-plugins.default.yaml
plugins:
  - package: ./dynamic-plugins-src/internal-backstage-plugin-my-front-plugin
    disabled: false
    pluginConfig:
      dynamicPlugins:
        frontend:
          internal.backstage-plugin-my-front-plugin:
            dynamicRoutes:
              - path: /my-front-plugin
                importName: MyFrontPluginPage
                menuItem:
                  icon: LibraryBooks
                  text: My Plugin Page
                  enabled: true
  - package: ./dynamic-plugins-src/internal-backstage-plugin-my-back-plugin-backend-dynamic
    disabled: false
```

Replace each sample package path with the exported directory name. A backend entry has no `pluginConfig`.

Create `dynamic-plugins-root-dev/docker-compose.dynamic-plugins-root.local.yml` with these mounts:

```yaml
services:
  install-dynamic-plugins:
    volumes:
      - ./dynamic-plugins-root-dev/dynamic-plugins.local.yaml:/opt/app-root/src/dynamic-plugins.operator.yaml:ro
      - ./dynamic-plugins-src-dev:/opt/app-root/src/dynamic-plugins-src
```

Start the stack with all three Compose files:

```bash
docker compose -f docker-compose.yml -f docker-compose.dynamic-plugins-root.yml -f dynamic-plugins-root-dev/docker-compose.dynamic-plugins-root.local.yml up -d
```

DevPortal 3.1 does not include `/opt/app-root/src/dynamic-plugins/`. The Compose mount supplies local exports at `/opt/app-root/src/dynamic-plugins-src/`, so the operator file must use `./dynamic-plugins-src/<exported-directory>`. An entry that still points to `./dynamic-plugins/dist/...` is skipped because that directory is absent.

Open [http://localhost:7007](http://localhost:7007) and sign in as guest. After a frontend edit, export the package again and refresh the portal. After a backend edit, export the package again and restart the stack with the same Compose files.

## 5. Confirm the plugin loaded

Get a guest token, then check the loaded plugins endpoint:

```bash
TOKEN=$(curl -s http://localhost:7007/api/auth/guest/refresh -H 'X-Requested-With: XMLHttpRequest' | python3 -c 'import sys,json; print(json.load(sys.stdin)["backstageIdentity"]["token"])')
curl -H "Authorization: Bearer $TOKEN" http://localhost:7007/api/dynamic-plugins-info/loaded-plugins
```

This works while guest sign-in is on, which is the local stack default. If the token request fails right after the portal starts, wait a few seconds and run it again: the backend can answer 503 for a short time after `/healthcheck` returns 200.

Your package appears in the list. Then confirm it runs: open the configured frontend route in the browser, request a backend route such as `/api/my-back-plugin/ping`, or open `/create/actions` for a Scaffolder action module.

## 6. Publish and install

When the plugin works locally, publish it as an OCI image in a registry your DevPortal can pull from and install it with a plugin entry, as described in [Packaging your Plugin](./packaging.md) and [Configure dynamic plugins for the local stack](../../installation-guide/docker-local/custom-plugins.md).

## Notes from the loop

- Frontend and backend plugins configure differently. A frontend plugin needs a `pluginConfig.dynamicPlugins.frontend` block with its routes, menu items, and mount points, described in [Wiring a Frontend Plugin](./wiring.md). A backend plugin needs no `pluginConfig`: the loader discovers it by its package role, and its runtime settings go in regular top-level app configuration.
- An OCI reference to an image that holds one plugin can leave out the `!<plugin path>` suffix: the installer reads the path from the image manifest. An entry that overrides a default plugin keeps the full suffix, as [Adding Plugins](../adding.md) describes.
- Some things genuinely require forking the base image because no configuration reaches them: the shell structure itself (`Sidebar`, `AppRouter`), the base entity-tab component (you can add tabs, but not replace the tab shell), catalog table columns, and icons imported directly into a component rather than resolved through the icon registry. If your requirement lands on one of these, plan for a fork or a support request rather than looking for a YAML key that does not exist.

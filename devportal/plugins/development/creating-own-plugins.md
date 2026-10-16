---
sidebar_position: 20
sidebar_label: Creating Your Own Plugin
title: "Creating Your Own Plugin"
---

[Bootstrapping](./bootstrap.md) through [Wiring](./wiring.md) cover the mechanical steps of building a plugin. This page strings those steps into one loop: scaffold, build, export, load into devportal-local, and see the plugin run.

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

## 3. Export and start devportal-local

Run the workspace helper from the workspace root:

```bash
yarn dev:dynamic
```

The helper's DevPortal 3.1 compatibility fix must be present in the `devportal-plugins` checkout; until then, use the manual fallback below.

The helper exports the packages listed in the workspace's `dynamic-plugins.yaml` with the Red Hat Developer Hub CLI package `@red-hat-developer-hub/cli` (`rhdh-cli`). It writes exports to `devportal-local/dynamic-plugins-src-dev/`, creates `devportal-local/dynamic-plugins-root-dev/dynamic-plugins.local.yaml`, and creates `devportal-local/dynamic-plugins-root-dev/docker-compose.dynamic-plugins-root.local.yml`. The `devportal-local` checkout supplies `docker-compose.yml` and `docker-compose.dynamic-plugins-root.yml`. The helper prints the command to start the stack with all three Compose files; run it from the `devportal-local` directory:

```bash
docker compose -f docker-compose.yml \
  -f docker-compose.dynamic-plugins-root.yml \
  -f dynamic-plugins-root-dev/docker-compose.dynamic-plugins-root.local.yml up -d
```

The `dynamic-plugins.local.yaml` operator file uses `./dynamic-plugins-src/<exported-directory>` for each exported package. DevPortal 3.1 does not include `/opt/app-root/src/dynamic-plugins/`; the local Compose override mounts `dynamic-plugins-src-dev` at `/opt/app-root/src/dynamic-plugins-src` for the installer. An entry that still points to `./dynamic-plugins/dist/...` is skipped because that directory is absent.

Unlike RHDH's local loop, which copies the export into `dynamic-plugins-root` without an installer, DevPortal 3.1 leaves exports in `dynamic-plugins-src-dev` for its installer to copy, because an export inside the plugin root would be loaded twice.

The end-to-end loop with DevPortal 3.1 has not yet been verified. After a frontend or backend edit, rerun `yarn dev:dynamic`, stop the stack with the same three Compose files, then run the helper's printed start command again. Do not use `-v` when stopping the stack.

## Manual fallback without the helper

If you cannot use `yarn dev:dynamic`, build and export each package manually. From the workspace root, set the path to the side-by-side local checkout:

```bash
yarn tsc
yarn build:all
export DEVPORTAL_LOCAL_DIR="$(cd ../../../devportal-local && pwd -P)"
```

Then run the Red Hat Developer Hub CLI from each plugin package directory, replacing the package path as needed:

```bash
cd plugins/my-front-plugin
npx --yes --package=@red-hat-developer-hub/cli@1.11.2 -- rhdh-cli plugin export --dev --dynamic-plugins-root "$DEVPORTAL_LOCAL_DIR/dynamic-plugins-src-dev"
```

Create `dynamic-plugins-root-dev/dynamic-plugins.local.yaml` in `devportal-local`. Add the default plugin index and each exported package:

```yaml
includes:
  - dynamic-plugins.default.yaml
plugins:
  - package: ./dynamic-plugins-src/<exported-directory>
    disabled: false
```

Create `dynamic-plugins-root-dev/docker-compose.dynamic-plugins-root.local.yml` with the same mounts used by the helper:

```yaml
services:
  install-dynamic-plugins:
    volumes:
      - ./dynamic-plugins-root-dev/dynamic-plugins.local.yaml:/opt/app-root/src/dynamic-plugins.operator.yaml:ro
      - ./dynamic-plugins-src-dev:/opt/app-root/src/dynamic-plugins-src
```

Start the stack from the `devportal-local` directory with the three Compose files shown above. For a frontend plugin, add its `pluginConfig` under the entry as described in [Wiring a Frontend Plugin](./wiring.md).

## 4. Confirm the plugin loaded

Get a guest token, then check the loaded plugins endpoint:

```bash
TOKEN=$(curl -s http://localhost:7007/api/auth/guest/refresh -H 'X-Requested-With: XMLHttpRequest' | python3 -c 'import sys,json; print(json.load(sys.stdin)["backstageIdentity"]["token"])')
curl -H "Authorization: Bearer $TOKEN" http://localhost:7007/api/dynamic-plugins-info/loaded-plugins
```

This works while guest sign-in is on, which is the local stack default. If the token request fails right after the portal starts, wait a few seconds and run it again: the backend can answer 503 for a short time after `/healthcheck` returns 200.

Your package appears in the list. Then confirm it runs: open the configured frontend route in the browser, request a scaffolded backend route such as `http://localhost:7007/api/my-back-plugin/todos`, or open `/create/actions` for a Scaffolder action module.

## 5. Publish and install

When the plugin works locally, publish it as an OCI image in a registry your DevPortal can pull from and install it with a plugin entry, as described in [Packaging your Plugin](./packaging.md) and [Configure dynamic plugins for the local stack](../../installation-guide/docker-local/custom-plugins.md).

## Notes from the loop

- Frontend and backend plugins configure differently. A frontend plugin needs a `pluginConfig.dynamicPlugins.frontend` block with its routes, menu items, and mount points, described in [Wiring a Frontend Plugin](./wiring.md). A backend plugin needs no `pluginConfig`: the loader discovers it by its package role, and its runtime settings go in regular top-level app configuration.
- An OCI reference to an image that holds one plugin can leave out the `!<plugin path>` suffix: the installer reads the path from the image manifest. An entry that overrides a default plugin keeps the full suffix, as [Adding Plugins](../adding.md) describes.
- Some things genuinely require forking the base image because no configuration reaches them: the shell structure itself (`Sidebar`, `AppRouter`), the base entity-tab component (you can add tabs, but not replace the tab shell), catalog table columns, and icons imported directly into a component rather than resolved through the icon registry. If your requirement lands on one of these, plan for a fork or a support request rather than looking for a YAML key that does not exist.

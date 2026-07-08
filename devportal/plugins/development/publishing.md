---
sidebar_position: 15
sidebar_label: Contributing to the Catalog
title: "Contributing a Plugin to the VeeCode Catalog"
---

[Packaging your Plugin](./packaging.md) covers publishing a dynamic plugin to a registry you control. This page covers a different path: contributing it to VeeCode's shared OCI catalog at `quay.io/veecode`, so any DevPortal instance can load it by reference without you hosting or maintaining a registry.

## When to use this path

- The plugin is on npm but isn't in the VeeCode Marketplace yet
- You need the same plugin (internal or third-party) available across multiple instances
- You maintain a fork or customization of an existing plugin

If you only need the plugin for a single instance you control, [Packaging your Plugin](./packaging.md) plus a [self-hosted `dynamic-plugins.yaml` override](../adding.md#self-hosted-docker--kubernetes) is simpler — no PR or CI review involved.

## Contributing via `devportal-plugin-export-overlays`

The [`devportal-plugin-export-overlays`](https://github.com/veecode-platform/devportal-plugin-export-overlays) repo builds and publishes every OCI artifact under `quay.io/veecode`. Each upstream source maps to one **workspace**:

```
workspaces/<name>/
  source.json
  backstage.json
  plugins-list.yaml
  metadata/
    <plugin-name>.yaml
```

### `source.json`

Points at the upstream repository and the Backstage version it was built against:

```json
{
  "repo": "https://github.com/org/repo",
  "repo-ref": "v1.2.3",
  "repo-flat": "true",
  "repo-backstage-version": "1.42.5"
}
```

:::warning
`repo-backstage-version` must match the upstream repo's own `backstage.json` at that exact `repo-ref`. A mismatch here is the most common cause of CI failure — see the error table below.
:::

### `backstage.json`

Mirrors the same version, at the workspace root:

```json
{ "version": "1.42.5" }
```

### `plugins-list.yaml`

Lists which packages in the upstream repo to export, using their path inside that repo (`plugins/`, `packages/`, or whatever the upstream layout uses):

```yaml
packages/your-plugin:
packages/your-plugin-backend:
```

A commented-out entry (`# packages/something:`) means the plugin is intentionally excluded, not that it's missing.

### `metadata/<plugin-name>.yaml`

One `Package` entity per exported plugin — this is what the Marketplace and `dynamicArtifact` lookups read:

```yaml
apiVersion: extensions.backstage.io/v1alpha1
kind: Package
metadata:
  name: your-plugin-name
  namespace: default
  title: "Your Plugin"
spec:
  packageName: "@scope/your-plugin"
  version: "1.2.3"
  backstage:
    role: frontend-plugin
    supportedVersions: "1.42.5"
  author: Your Organization
  support: community
  lifecycle: active
```

`spec.dynamicArtifact` (the `oci://quay.io/veecode/<workspace>:bs_<version>!<plugin-name>` reference readers copy into their `dynamic-plugins.yaml`) is written by CI on publish — you don't set it by hand.

### Publishing

1. Open a PR against the repo with your new/updated workspace files.
2. CI validates the metadata automatically.
3. Comment `/publish` on the PR — CI builds and pushes a preview artifact tagged `pr_<number>__<version>`, then posts the OCI reference back on the PR so you can smoke-test it.
4. Once merged, CI publishes the stable `bs_<backstage-version>` tag used by `dynamicArtifact`.

:::note
Prose docs in that repo drift faster than its actual CI behavior and published artifacts — the same caution [Adding Plugins](../adding.md#finding-the-oci-reference-for-a-plugin) already makes about the README. If something here looks off, trust the workflow files and an existing workspace's files over any doc, including this one.
:::

### Common CI errors

| Error | Cause | Fix |
|---|---|---|
| `repo-backstage-version` mismatch | `source.json` disagrees with the upstream's `backstage.json` at that ref | Re-check the upstream `backstage.json` at the exact pinned ref |
| Invalid `dynamicArtifact` registry | Metadata references a registry other than `quay.io/veecode` | CI writes this field — don't hand-author it; let publish generate it |
| Version mismatch | `spec.version` differs from the upstream `package.json` at the pinned ref | Copy the exact upstream version, don't guess |

## Consuming what you published

Once published, load it into an instance the same way as any other plugin — see [Adding Plugins](../adding.md#via-yaml-override) for the YAML override syntax and [Wiring Plugins](./wiring.md) for frontend mount points. Check the [MUI compatibility note](../adding.md) before pinning a plugin version — the VeeCode distro ships MUI v5, and plugins built against MUI v7 crash at runtime.

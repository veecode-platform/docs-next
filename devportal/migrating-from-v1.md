---
sidebar_position: 3
sidebar_label: Migrating from V1
title: Migrating from V1 to V2
---

# Migrating from V1 to V2

This guide is for operators running **V1** — the split-image topology
(`veecode/devportal-base` + `veecode/devportal`, profiles via
`VEECODE_PROFILE`) — who want to move to **V2**, the unified
`veecode/devportal:2.0.0` image driven by composable presets.

:::info Migration is optional and reversible
V1 stays on its maintenance line (security backports). Upgrade when it
suits you; rollback is a single config change (swap the image back and
restore `VEECODE_PROFILE`). Not sure which version you run? See
[Which version am I running?](./which-version.md).
:::

## What changes

| V1 (split image) | V2 (unified image) |
|---|---|
| Two images: `veecode/devportal-base` + `veecode/devportal` | One image: `veecode/devportal:2.0.0` |
| Plugins baked into the distro at build time | Plugins ship **disabled by default**, resolved at boot via `oci://` refs, enabled by presets |
| One profile via `VEECODE_PROFILE=<github\|gitlab\|…>` (loads one `app-config.<profile>.yaml`) | Composable presets via `VEECODE_PRESETS=a,b,c` — SCM and identity are **separate** presets you compose |
| VeeCode look baked into `packages/app` | Same look opt-in via the `veecode-theme` preset |

## Required: `VEECODE_PRESETS=recommended`

V1 shipped RBAC, marketplace, tech-radar, and pending-changes **enabled
by default**. V2 ships those same plugins **disabled by default**, gated
behind the `recommended` preset. **Every migrating deployment must set
`VEECODE_PRESETS=recommended`** to keep the previous experience, and add
`veecode-theme` to restore the VeeCode palette and branding:

```sh
VEECODE_PRESETS=recommended,veecode-theme,<your-integration-presets>
```

## Profile → preset translation

This table is the contract. Compose each row with `recommended,veecode-theme`.
Each preset's authoritative required-variable list lives in its
`presets/<name>.yaml` (`requires.variables`); a missing required variable
fails the boot with **exit code 78** naming the preset and the variable.

| V1 `VEECODE_PROFILE` | V2 preset(s) | Required env vars | Carry-over via `app-config.local.yaml` |
|---|---|---|---|
| `github-pat` | `github` | `GITHUB_PAT`, `GITHUB_ORG` | None — rename your env var `GITHUB_TOKEN` → `GITHUB_PAT`. |
| `github` | `github,github-auth` | `GITHUB_PAT`, `GITHUB_ORG`, `GITHUB_AUTH_CLIENT_ID`, `GITHUB_AUTH_CLIENT_SECRET` | None, unless you used GitHub **App** integration (`integrations.github[].apps`) — then lift that block. |
| `gitlab` | `gitlab` | `GITLAB_HOST`, `GITLAB_AUTH_CLIENT_ID`, `GITLAB_AUTH_CLIENT_SECRET`, `GITLAB_TOKEN`, `GITLAB_GROUP` (optional `GITLAB_GROUP_PATTERN`) | None. |
| `azure` | `azure,azure-auth` | `AZURE_DEVOPS_TOKEN`, `AZURE_DEVOPS_HOST`, `AZURE_DEVOPS_ORG`, `AZURE_DEVOPS_PROJECT`, `AZURE_AUTH_TENANT_ID`, `AZURE_AUTH_CLIENT_ID`, `AZURE_AUTH_CLIENT_SECRET` | None. |
| `keycloak` | `keycloak` | `KEYCLOAK_BASE_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`, `AUTH_SESSION_SECRET` | None. |
| `ldap` | `ldap` | `LDAP_URL`, `LDAP_DN`, `LDAP_SECRET`, `LDAP_USERS_BASE_DN`, `LDAP_GROUPS_BASE_DN` (optional `LDAP_USERS_FILTER`, `LDAP_GROUPS_FILTER`) | None. |
| `ldap-ad` | `ldap,ldap-ad` | Same as `ldap` | None — `ldap-ad` overrides the AD attributes/filters. **Order matters: list `ldap` before `ldap-ad`.** |

Presets compose: `VEECODE_PRESETS=recommended,veecode-theme,github,sonarqube`
adds SonarQube on top of the GitHub stack and demands both sets of vars.

:::warning Two behavior changes to plan for
- **`GITHUB_TOKEN` → `GITHUB_PAT`.** Most variable names carry over unchanged; this one renamed. Check each preset's `requires.variables` rather than assuming the legacy name.
- **`app.title` is baked at image build time** and cannot be overridden by a runtime-mounted `app-config.local.yaml`. Logos and palette override correctly at runtime; the title does not.
:::

## What the preset already configures (do not copy over)

The preset owns these — copying them from your legacy
`app-config.<profile>.yaml` only invites drift:
integration base config (`integrations.<provider>`), the catalog provider
(`catalog.providers.<provider>`), the auth provider + sign-in page, and the
theme palette/branding (owned by `veecode-theme`). You **do** carry over
everything *outside* a preset's scope: custom catalog `locations`, a custom
RBAC policy, extra integration hosts, proxy entries, feature flags.

## Installing V2

Pick the path that matches V1's:

- **Production Kubernetes** → the published `veecode-devportal-platform` Helm chart. See [Kubernetes (Helm chart)](./installation-guide/production-setup/plan.md).
- **Local Kubernetes (VKDR)** → `vkdr devportal-platform install`. See [VKDR (Local Kubernetes)](./installation-guide/vkdr-local/vkdr-setup.md).
- **Docker** → `veecode/devportal:2.0.0` with `VEECODE_PRESETS`. See [Docker Run](./installation-guide/docker-local/intro.md).

## What is NOT part of this migration

- **No automated config translation.** No script reads `VEECODE_PROFILE` and emits `VEECODE_PRESETS` — the per-integration preset is intentionally narrower than the legacy profile, so the mapping is documented (this table), not code.
- **No Backstage version bump.** Both V1 and V2 ship on Backstage 1.49.4.
- **No visual redesign.** `veecode-theme` repackages the same palette and logos.

# ADR-001: Preview site workflow via branch sync

## Status

Accepted

## Date

2026-04-02

## Context

The documentation site has two deployment targets:

- **Production** at `https://docs.platform.vee.codes/` (repo: `veecode-platform/docs`)
- **Staging** at `https://docs-next.platform.vee.codes/` (repo: `veecode-platform/docs-next`)

Previously, the two repos were maintained independently. Content was authored in `docs-next` and then manually merged or copied into `docs`. This caused drift between the repos, made it hard to track what was reviewed vs. deployed, and required contributors to work across two repositories.

The [VeeCode-site](https://github.com/veecode-platform/VeeCode-site) project solved the same problem by using a single source repo with a `develop` branch that is force-synced to a preview mirror repo.

## Decision

Adopt the same workflow used by VeeCode-site:

1. The `docs` repo has two long-lived branches: `develop` (default) and `main`.
2. A GitHub Actions workflow (`.github/workflows/deploy_preview.yml`) force-pushes `develop` to `docs-next:main` on every push.
3. The `docs-next` repo's existing GitHub Pages deploy workflow builds and publishes the staging site automatically.
4. The `docs` repo's existing deploy workflow (`.github/workflows/deploy.yml`) publishes to production on push to `main`.
5. `docs-next` becomes a read-only mirror — no direct commits.

```pre
docs repo                          docs-next repo
─────────                          ──────────────
develop branch ──force push──►     main branch ──► GitHub Pages (staging)
main branch    ──────────────────────────────────► GitHub Pages (production)
```

### Requirements

- A `PREVIEW_DEPLOY_TOKEN` secret on the `docs` repo, containing a PAT with `contents: write` access to `docs-next`.

## Consequences

- Single source of truth — all content lives in one repo.
- Staging is always an exact reflection of the `develop` branch.
- Contributors only need to know one repo.
- `docs-next` history is overwritten on each sync (force push). This is acceptable since it is a preview mirror, not a source of truth.

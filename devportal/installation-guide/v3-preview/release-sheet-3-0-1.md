---
sidebar_position: 6
sidebar_label: DevPortal 3.0.1
title: DevPortal 3.0.1 release sheet
---

# DevPortal 3.0.1 release sheet

Release date: @@RELEASE_DATE@@

## What changed

### New features and enhancements

- None.

### Breaking changes and upgrade notes

- None.

### Deprecated and removed features

- None.

### Fixed issues

- The backend moves `better-sqlite3` from 12.11.1 to 13.0.3. This fixes a startup crash when DevPortal uses SQLite under Node.js 24.19.0. PostgreSQL-backed installations were not affected.
- Marketplace 0.3.1 fixes two regressions in the Marketplace card. After you confirm an install or removal, the card shows the matching pending status. The confirm click no longer opens the details drawer.

### Fixed security issues

@@FIXED_SECURITY_ISSUES@@

## What goes together

Use these values together. Pin the image by its digest.

| Part | Value |
| --- | --- |
| Image | `docker.io/veecode/devportal:3.0.1@@@IMAGE_DIGEST@@` |
| Image digest | `@@IMAGE_DIGEST@@` |
| Chart | `devportal` 1.0.1 |
| Chart checksum (SHA-256) | `@@CHART_SHA256@@` |
| Backstage version | 1.52.0 |
| Plugin tag line | `bs_1.52.0` |
| Catalog index | `quay.io/veecode/plugin-catalog-index:bs_1.52.0`, qualified at `@@CATALOG_INDEX_DIGEST@@` |
| Catalog index tag for pinning | `quay.io/veecode/plugin-catalog-index:@@CATALOG_INDEX_TIMESTAMPED_TAG@@` |
| Qualified on | Kubernetes @@QUALIFIED_KUBERNETES_VERSION@@, PostgreSQL @@QUALIFIED_POSTGRESQL_VERSION@@ |

`bs_1.52.0` names the Backstage version the plugin artifacts target. The catalog index tag moves when the catalog is republished. During an incident, pin the timestamped tag above.

### Backstage packages

| Package | Version |
| --- | --- |
@@BACKSTAGE_PACKAGE_ROWS@@

## Vulnerability report

- Image scanned: `docker.io/veecode/devportal@@@IMAGE_DIGEST@@`
- Scanner: Trivy `@@TRIVY_VERSION@@`, database dated `@@TRIVY_DB_DATE@@`.
- Critical vulnerabilities with a fix and no live exception: `@@BLOCKING_CRITICAL_COUNT@@`.
- Qualification run: `@@QUALIFICATION_RUN_URL@@`.

| Severity | Reported | With a fix | Accepted as an exception |
| --- | ---: | ---: | ---: |
@@IMAGE_SCAN_ROWS@@

A release does not ship with a critical vulnerability that has a fix and no live exception.

### Exceptions

| ID | Package | Severity | Reason | Expires |
| --- | --- | --- | --- | --- |
@@IMAGE_SCAN_EXCEPTIONS@@

An exception expires on the date shown. After that date, the finding counts again and blocks a release.

### Plugins enabled by default

The table contains one row for each OCI artifact enabled by the product face, including the Marketplace card. These artifact scans are reports and do not block the image release.

@@PLUGIN_SCAN_ROWS@@

## Known limitations

The 3.0.0 release sheet also lists these limitations. The 3.0.1 changes do not address them.

- The product face ships the Red Hat dynamic Home page entry disabled. Enabling it (for example from its Marketplace card) leaves the portal's pages empty, because it registers the same frontend API as the DevPortal home page. Keep it disabled.
- An offline install must mirror the catalog index as well as the OCI plugin artifacts. In beta.10 tests, the installer fetched the index before loading cached plugin artifacts and stopped when Quay was unreachable.
- In beta.10 measurements, median readiness took 67.237 seconds with an empty plugin volume and 19.514 seconds with a populated volume. These are beta.10 measurements, not measurements of the final 3.0.1 candidate.

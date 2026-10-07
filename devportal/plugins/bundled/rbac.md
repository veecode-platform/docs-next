---
sidebar_position: 1
sidebar_label: RBAC
title: RBAC Plugin
---

# RBAC Plugin

The RBAC plugin provides a page for managing role-based access control policies in DevPortal. It adds a `/rbac` route under the **Administration** menu section.

**Status:** The RBAC screens ship enabled among the default plugins listed in the default plugin file (`dynamic-plugins.veecode.yaml`). The enforcing backend is built in and turns on through configuration. No plugin entry is needed.

---

## Package

`backstage-community-plugin-rbac`

---

## What it does

The RBAC page shows the role table with columns **Name**, **Users and groups**, **Accessible plugins** and **Actions**, with **Create**, **Filter** and **Export CSV** controls. **Create** opens a wizard with three steps: "Enter name, description, and owner of role", "Add users and groups", and "Add permission policies". You can also manage roles through the permission REST API or a CSV policy file.

An admin creates a role with `POST /api/permission/roles` and adds policies with `POST /api/permission/policies`, where the body must be a JSON array. Roles and policies created this way persist across restarts. See [How to Create a Role](../../rbac/creating-role.md) for the full steps.

---

## Access

The RBAC page is available at `/rbac` and sits under **Administration** in the sidebar. Users and groups listed in `superUsers` can open it.

---

## Roles

DevPortal 3.x ships no roles. Users and groups in `superUsers` get full access, including role and policy management. The policy list shows their admin policies under `role:default/rbac_admin`, and that role does not appear in the role list. Every other role is your own. Do not treat example `viewer` or `developer` roles from local samples as product defaults.

---

## App configuration

RBAC is configured in app configuration under `permission.rbac`. The CSV settings are optional and point at a file mounted into the container:

```yaml
permission:
  enabled: true
  rbac:
    admin:
      superUsers:
        - name: group:default/backstage-admins
    defaultPermissions:
      defaultRole: role:default/viewer
      basicPermissions:
        - permission: catalog.entity.read
          action: read
        - permission: catalog-entity
          action: read
    policies-csv-file: /opt/app-root/src/rbac/rbac-policy.csv
    policyFileReload: true
```

On Kubernetes, place the permission settings under `upstream.backstage.appConfig` in the chart values:

```yaml
upstream:
  backstage:
    appConfig:
      permission:
        enabled: true
        rbac:
          admin:
            superUsers:
              - name: group:default/backstage-admins
          defaultPermissions:
            defaultRole: role:default/viewer
            basicPermissions:
              - permission: catalog.entity.read
                action: read
              - permission: catalog-entity
                action: read
```

The chart ships with `permission.enabled: false`. With checks off, the permission API returns 404 and no request is checked against roles. For example, a location registration that a reader's role denies with 403 when checks are on passes the permission check when they are off.

See [RBAC Permissions](../../rbac/permissions.md) for the permission names.

---
sidebar_position: 3
sidebar_label: Composing a Portal
title: Composing a Portal
---

# Composing a Portal

A DevPortal installation out of the box is a service catalog and a template runner. Teams can register their services, create new ones from templates, and browse the software landscape. That is Day-0: the portal knows what exists and can create things, but it doesn't connect to anything live yet.

The value engineers actually care about — seeing pod status, triggering a deployment, checking code quality, browsing Grafana dashboards without leaving the service page — comes from plugin composition. Understanding how composition works is what separates "I ran the YAML" from "I built an operational hub."

---

## Three levels of composition

Every plugin activates across three layers. All three must be in place before a developer sees anything.

### 1. Load — `dynamic-plugins.yaml`

This controls which plugins are present at all. Flip `disabled: false` for a bundled plugin, or add an OCI reference for an external one. No image rebuild required.

```yaml
plugins:
  - package: ./dynamic-plugins/dist/backstage-plugin-kubernetes-dynamic
    disabled: false
```

Enabling a plugin here loads its code. UI components are available. But nothing appears to the developer yet.

### 2. Context — entity annotations

Plugins are **context-aware by design**. They do not add global tabs. They add tabs and cards to specific catalog entities — and only when those entities carry the right annotation.

```yaml
# catalog-info.yaml
metadata:
  annotations:
    backstage.io/kubernetes-label-selector: 'app=my-service'
```

Without this annotation on the entity, the Kubernetes plugin is loaded but idle. With it, the Kubernetes tab appears on that entity only, and shows pods matching the selector.

This is intentional. A platform with dozens of services doesn't need every plugin visible on every entity. Each service declares what it uses. The portal surfaces exactly what belongs to that service.

### 3. Backend — `app-config.yaml`

The tab appears. But it needs to know where to fetch data from. The backend configuration provides that:

```yaml
kubernetes:
  clusterLocatorMethods:
    - type: config
      clusters:
        - name: production
          url: ${K8S_CLUSTER_URL}
          serviceAccountToken: ${K8S_CLUSTER_TOKEN}
```

Without this, the tab loads and shows an error or empty state. With all three layers in place, the tab displays live data.

### The diagnostic model

A plugin that fails silently has failed at one of these three levels:

| Symptom | Cause | Fix |
|---|---|---|
| Tab not visible on entity | Annotation missing | Add annotation to `catalog-info.yaml` |
| Tab visible, empty or error | Backend not configured | Check `app-config.yaml` for the relevant integration |
| Nothing plugin-related works | Plugin not loaded | Check `disabled: false` in `dynamic-plugins.yaml` |

---

## The Day-0 → Day-1 → Day-2 progression

This isn't a checklist you complete once. It is a deliberate sequence.

### Day-0: Foundation

- Catalog populated — services, APIs, and resources registered via `catalog-info.yaml`
- Software templates defined — teams can create new services following the organization's Golden Paths
- Authentication configured via `VEECODE_PROFILE` — sets auth provider, catalog discovery, and SCM integrations in one step (see [Configuration Profiles](/devportal/concepts/configuration-profiles))

The portal knows what exists. Engineers can create new services from opinionated templates. Value: reduced onboarding time and consistent project structure.

### Day-1: Connecting services to their tooling

- Enable plugins in `dynamic-plugins.yaml`
- Add annotations to catalog entities — each annotation is a claim: "this entity owns this Kubernetes workload / this GitLab project / this Grafana dashboard"
- Configure backends in `app-config.yaml` — tell the backend where to find the external systems

### Day-2: The operational hub

- Developers operate services without leaving the portal
- CI/CD tabs show pipeline status alongside the service entity
- Kubernetes tab shows pod health and live logs
- Grafana cards show dashboards scoped to that specific service
- Code Quality tab surfaces SonarQube results

The portal is no longer a catalog. It is the operational interface for the service.

---

## Example: internal team portal

A concrete composition — GitLab CI, Grafana observability, and Kubernetes workloads — across the three layers:

**`dynamic-plugins.yaml` — what to load:**

```yaml
plugins:
  # Kubernetes — bundled in the image, enable it
  - package: ./dynamic-plugins/dist/backstage-plugin-kubernetes-dynamic
    disabled: false

  # GitLab Pipelines — OCI plugin, downloaded at startup
  - package: oci://quay.io/veecode/gitlab:bs_1.48.4!immobiliarelabs-backstage-plugin-gitlab
    disabled: false

  # Grafana — OCI plugin, downloaded at startup
  - package: oci://quay.io/veecode/<workspace>:<tag>!roadiehq-backstage-plugin-grafana
    disabled: false
```

**Each service's `catalog-info.yaml` — what it owns:**

```yaml
metadata:
  annotations:
    backstage.io/kubernetes-label-selector: 'app=my-service,env=production'
    gitlab.com/project-slug: my-group/my-service
    grafana/dashboard-selector: "tags @> 'my-service'"
```

**`app-config.yaml` — where to fetch data from:**

```yaml
kubernetes:
  serviceLocatorMethod:
    type: multiTenant
  clusterLocatorMethods:
    - type: config
      clusters:
        - name: production
          url: ${K8S_CLUSTER_URL}
          serviceAccountToken: ${K8S_CLUSTER_TOKEN}

grafana:
  domain: ${GRAFANA_URL}

integrations:
  gitlab:
    - host: gitlab.com
      token: ${GITLAB_TOKEN}
```

Result: each service entity has a Kubernetes tab, a CI tab with GitLab pipeline history, and an overview card with Grafana dashboards scoped to that service. Developers see the operational state of their service in one place.

---

## Choosing the right plugins for your context

The question isn't "which plugins are available" — it's "what does my team need to stop context-switching for?"

| If your team uses... | Enable... | Required annotation |
|---|---|---|
| GitHub CI | GitHub Actions | `github.com/project-slug: org/repo` |
| GitHub workflow triggers | GitHub Workflows | `github.com/project-slug` + `github.com/workflows` |
| GitLab CI | GitLab Pipelines | `gitlab.com/project-slug: group/project` |
| Jenkins | Jenkins | `jenkins.io/job-full-name: folder/job` |
| Azure Pipelines | Azure DevOps | `dev.azure.com/project-repo: project/repo` |
| Kubernetes | Kubernetes | `backstage.io/kubernetes-label-selector: app=name` |
| Grafana | Grafana | `grafana/dashboard-selector: "tags @> 'name'"` |
| SonarQube | SonarQube | `sonarqube.org/project-key: project-key` |
| HashiCorp Vault | Vault | `vault.io/secrets-path: secret/data/service` |

For plugins not in the bundled set, see [Finding Plugins](/devportal/plugins/finding).

---

## References

- [Bundled Plugin Catalog](/devportal/plugins/bundled) — what ships with DevPortal and its default state
- [Finding Plugins](/devportal/plugins/finding) — plugins beyond the bundled set
- [Adding Plugins](/devportal/plugins/adding) — OCI and npm download configuration
- [Configuration Profiles](/devportal/concepts/configuration-profiles) — how `VEECODE_PROFILE` sets Day-0 auth and integrations
- [Build Your Own Platform](/platform/how-to/build-your-own-platform) — operational playbook for starting from scratch

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

A plugin that fails silently has failed at one of these three levels. Diagnose in layer order — load before context before backend, because each layer assumes the previous one succeeded.

| Symptom | Layer | Fix |
|---|---|---|
| Plugin entirely absent (no tab, no card, nothing) on any entity | Load — declared but installer failed | See [Diagnosing "plugin not loaded"](#diagnosing-plugin-not-loaded) below |
| Tab not visible on a specific entity | Context — annotation missing | Add the annotation to that entity's `catalog-info.yaml` |
| Tab visible, empty or error | Backend — configuration missing or unreachable | Check `app-config.yaml` for the relevant integration |

#### Diagnosing "plugin not loaded"

This is the trickiest failure to spot because **the portal still boots normally** — there is no startup error, no banner, no warning in the UI. The plugin is simply absent.

The DevPortal entrypoint runs `install-dynamic-plugins.py` before starting Backstage. The installer reads `dynamic-plugins.yaml`, downloads each OCI/npm artifact, and writes the merged config that Backstage reads on boot. The installer is best-effort: when it fails for a specific plugin, it logs an error, **skips that plugin, and continues**. Backstage then boots without it. If you're not looking at the logs, the plugin just isn't there.

Check the container logs for the specific install lifecycle lines the installer prints:

```bash
docker logs devportal 2>&1 | grep -E "======= (Installing|Skipping|Successfully|ERROR|Using pre-installed)"
```

What you should see for a healthy load:

```
======= Installing dynamic plugin <package>
==> Successfully installed dynamic plugin <package>
```

Common failure signatures and what they mean:

| Log signature | What happened | Likely cause |
|---|---|---|
| `======= ERROR: Failed to install plugin ... npm ERR! 404` | npm package or version doesn't exist | Typo in `package:`, or version not published |
| `======= ERROR: Failed to install OCI plugin ... skopeo ... non-zero exit status 1` | OCI image not found or unreachable | Wrong workspace, wrong tag, registry unreachable, or plugin commented out in [`devportal-plugin-export-overlays`](https://github.com/veecode-platform/devportal-plugin-export-overlays) — see [Finding the OCI reference](/devportal/plugins/adding#finding-the-oci-reference-for-a-plugin) |
| `======= ERROR: ... hash of the downloaded package ... does not match the provided integrity hash` | Tampered or wrong-version artifact | Regenerate or remove the `integrity:` field |
| `yaml.scanner.ScannerError:` or `yaml.parser.ParserError:` | `dynamic-plugins.yaml` itself doesn't parse | YAML syntax error — duplicate keys, bad indentation. **No plugins load at all when this happens.** |
| `InstallException: Config key '...' defined differently for 2 dynamic plugins` | Two plugins set the same config key incompatibly | Reconcile the conflicting `pluginConfig` entries |
| `InstallException: skopeo executable not found in PATH` | OCI install attempted on an image that doesn't have skopeo | Use the official VeeCode image, or switch to npm packages |
| No `Installing` line for the plugin at all | The package name in your YAML doesn't match anything that was processed | Typo in `package:`, or the entry is inside an `includes:` file that wasn't found |

:::caution Installer crashes are non-fatal
A Python crash in `install-dynamic-plugins.py` does not abort the boot. The portal starts anyway, with `app-config.dynamic-plugins.yaml` either stale or empty. After any change to `dynamic-plugins.yaml`, verify the install lifecycle lines above before assuming the plugin is active.
:::

#### Diagnosing "tab appears but is empty or errors"

The plugin is loaded and the annotation is correct, but the data isn't showing. Check in this order:

1. **Backend section exists in `app-config.yaml`** — for Kubernetes: `kubernetes.clusterLocatorMethods`. For Grafana: `grafana.domain`. For SonarQube: `sonarqube.baseUrl` + `apiKey`. Without the backend config, the plugin frontend has no source to query.

2. **The annotation value matches reality** — `backstage.io/kubernetes-label-selector: 'app=my-service'` must match the actual labels on the pods in the cluster. If the pods are labeled `app=myservice` (no hyphen), the plugin returns empty with no UI error.

3. **Credentials and reachability** — the service account token, OAuth credentials, or API key must have read access. The backend must be able to reach the external system (cluster URL, Grafana URL, etc.) from the DevPortal container's network.

4. **TLS settings** — for self-signed certs in `kubernetes.clusterLocatorMethods`, set `skipTLSVerify: true`. Otherwise the connection fails silently from the frontend's perspective.

5. **Backend logs** — connection errors surface in the container logs, not the UI:

   ```bash
   docker logs devportal | grep -i <plugin-name>
   ```

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

  # Grafana — see note below; reference is illustrative
  - package: oci://quay.io/veecode/<workspace>:<tag>!roadiehq-backstage-plugin-grafana
    disabled: false
```

:::note Grafana is not currently published as an OCI artifact by VeeCode
The `@roadiehq/backstage-plugin-grafana` package exists upstream but is not in any active workspace in [`devportal-plugin-export-overlays`](https://github.com/veecode-platform/devportal-plugin-export-overlays). To use Grafana today you have two options: reference the npm package directly (`package: '@roadiehq/backstage-plugin-grafana'`) if upstream publishes a dynamic build, or fork `devportal-plugin-export-overlays` and add the plugin to a workspace. For ready-to-use observability and quality plugins that ARE published as OCI, see [Tech Insights](/devportal/plugins/bundled), [SonarQube](/devportal/plugins/Sonar), or `kiali` (service mesh).

The composition model below applies identically — once loaded by either route, Grafana follows the same Layer 1 / 2 / 3 rules.
:::

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

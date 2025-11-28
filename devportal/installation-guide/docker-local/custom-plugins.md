---
sidebar_position: 3
sidebar_label: Dynamic Plugins
title: Custom Dynamic Plugins
---

# Custom Dynamic Plugins

DevPortal supports dynamic plugins that can be enabled, disabled, and configured at runtime without rebuilding the container image. This guide shows you how to customize plugin behavior using a custom `dynamic-plugins.yaml` file.

## Understanding Dynamic Plugins

The DevPortal image comes with pre-installed plugins that can be optionally loaded. The configuration is controlled by two files:

- **`dynamic-plugins.default.yaml`**: Default plugin configuration (built into the image)
- **`dynamic-plugins.yaml`**: Your custom overrides (mounted at runtime)

## Creating a Custom Plugins File

Create a `dynamic-plugins.yaml` file in your project directory:

```yaml
plugins:
  # Enable a pre-installed plugin
  - package: '@backstage/plugin-catalog-backend-module-github'
    disabled: false
    
  # Disable a plugin
  - package: '@backstage/plugin-techdocs'
    disabled: true
    
  # Configure plugin with custom settings
  - package: '@backstage/plugin-kubernetes-backend'
    disabled: false
    pluginConfig:
      kubernetes:
        serviceLocatorMethod:
          type: 'multiTenant'
        clusterLocatorMethods:
          - type: 'config'
            clusters: []
```

## Mounting with Docker Run

```bash
docker run --rm --name devportal -d \
  -p 7007:7007 \
  -v $(pwd)/dynamic-plugins.yaml:/app/dynamic-plugins.yaml:ro \
  veecode/devportal:latest
```

## Mounting with Docker Compose

Update your `docker-compose.yml`:

```yaml
services:
  devportal:
    image: veecode/devportal:latest
    ports:
      - "7007:7007"
    volumes:
      - ./dynamic-plugins.yaml:/app/dynamic-plugins.yaml:ro
```

## Common Plugin Configurations

### GitHub Integration Plugin

```yaml
plugins:
  - package: '@backstage/plugin-catalog-backend-module-github'
    disabled: false
    pluginConfig:
      catalog:
        providers:
          github:
            organization:
              organization: 'your-org'
              catalogPath: '/catalog-info.yaml'
              filters:
                branch: 'main'
```

### Kubernetes Plugin

```yaml
plugins:
  - package: '@backstage/plugin-kubernetes-backend'
    disabled: false
    pluginConfig:
      kubernetes:
        serviceLocatorMethod:
          type: 'multiTenant'
        clusterLocatorMethods:
          - type: 'config'
            clusters:
              - url: https://kubernetes.default.svc
                name: local-cluster
                authProvider: 'serviceAccount'
```

### TechDocs Plugin

```yaml
plugins:
  - package: '@backstage/plugin-techdocs-backend'
    disabled: false
    pluginConfig:
      techdocs:
        builder: 'local'
        generator:
          runIn: 'docker'
        publisher:
          type: 'local'
```

## Loading External Plugins

You can also load plugins from external registries (NPM or OCI):

```yaml
plugins:
  # Load from NPM registry
  - package: 'npm://my-custom-plugin@1.0.0'
    disabled: false
    
  # Load from OCI registry
  - package: 'oci://ghcr.io/my-org/my-plugin:latest'
    disabled: false
```

## Plugin Configuration Priority

The configuration is merged in this order (later overrides earlier):

1. `dynamic-plugins.default.yaml` (built into image)
2. `dynamic-plugins.yaml` (your custom file)
3. Environment variables (if applicable)

## Viewing Available Plugins

To see which plugins are pre-installed in your image, check the logs when the container starts:

```bash
docker logs devportal | grep "dynamic-plugins"
```

## Next Steps

- [Custom App Configuration](./custom-config)
- [Add Custom Catalog](./custom-catalog)

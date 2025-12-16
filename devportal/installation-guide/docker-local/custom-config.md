---
sidebar_position: 3
sidebar_label: Custom Configuration
title: Custom App Configuration
---

## Custom App Configuration

You can use a combination of `docker compose`, profiles, configuration files, and environment variables to customize the behavior of the DevPortal instance.

You can customize your DevPortal by mounting a custom `app-config.local.yaml` file. This allows you to override default settings without modifying the container image.

## Creating a Custom Config File

Create an `app-config.local.yaml` file in your project directory:

```yaml
app:
  title: My Company DevPortal
  baseUrl: http://localhost:7007

organization:
  name: My Company

backend:
  baseUrl: http://localhost:7007
  listen:
    port: 7007
  cors:
    origin: http://localhost:7007
    methods: [GET, HEAD, PATCH, POST, PUT, DELETE]
    credentials: true

# Example: Configure GitHub integration
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}

# Example: Configure catalog locations
catalog:
  locations:
    - type: url
      target: https://github.com/your-org/your-repo/blob/main/catalog-info.yaml
```

## Mounting with Docker Run

Use the `-v` flag to mount your config file:

```bash
docker run --rm --name devportal -d \
  -p 7007:7007 \
  -v $(pwd)/app-config.local.yaml:/app/app-config.local.yaml:ro \
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
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    volumes:
      - ./app-config.local.yaml:/app/app-config.local.yaml:ro
```

Then run:

```bash
docker compose up -d
```

## Common Configuration Examples

### GitHub Authentication

```yaml
auth:
  environment: development
  providers:
    github:
      development:
        clientId: ${GITHUB_CLIENT_ID}
        clientSecret: ${GITHUB_CLIENT_SECRET}
```

### Custom Theme

```yaml
app:
  branding:
    theme:
      light:
        primaryColor: '#2196F3'
      dark:
        primaryColor: '#90CAF9'
```

### Database Configuration

```yaml
backend:
  database:
    client: pg
    connection:
      host: ${POSTGRES_HOST}
      port: ${POSTGRES_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
```

## Environment Variables

You can use environment variables in your config file using the `${VAR_NAME}` syntax. Pass them via Docker:

```bash
docker run --rm --name devportal -d \
  -p 7007:7007 \
  -e GITHUB_TOKEN=your_token_here \
  -v $(pwd)/app-config.local.yaml:/app/app-config.local.yaml:ro \
  veecode/devportal:latest
```

## Next Steps

- [Configure Dynamic Plugins](./custom-plugins)
- [Add Custom Catalog](./custom-catalog)

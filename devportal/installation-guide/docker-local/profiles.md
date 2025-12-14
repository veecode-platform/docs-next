---
sidebar_position: 2
sidebar_label: Profiles
title: Quick Setup with Profiles
---

## Using VeeCode Profiles

VeeCode DevPortal supports **profiles** as a convenient way to quickly configure authentication and catalog integration for common Git providers. Instead of manually configuring `app-config.local.yaml`, you can use the `VEECODE_PROFILE` environment variable and DevPortal will merge specific config elements during start time.

## What are Profiles?

Profiles are pre-configured setups that automatically configure:

- **Authentication**: Login integration against your Git provider
- **Catalog Integration**: Automatic discovery of repositories and catalog files
- **Organizational Data**: Replicate your organization's users and groups structure in DevPortal
- **Default Settings**: Sensible defaults for common use cases

A profile is activated by setting the `VEECODE_PROFILE` environment variable to one of the supported profile names:

| Profile | Auth | Org Data | Discovery |
|---------|------|----------|-----------|
| github  | GitHub Auth | Teams and members | Repos in org |
| gitlab  | GitLab Auth | Groups and members | Repos in group |
| azure   | Azure Entra | Groups and members | Repos in org/project |

These settings are somewhat opinionated to provide a good starting point. They are somewhat cumbersome to get right manually (specially on the first time), so using profiles can save time and effort.

These settings can also be further customized or overridden by providing a custom `app-config.local.yaml` file if needed.

## Available Profiles

### GitHub Profile

Create a `docker-compose.yml`:

```yaml
services:
  devportal:
    image: veecode/devportal:latest
    ports:
      - "7007:7007"
    environment:
      - VEECODE_PROFILE=github
      - GITHUB_ORG
      - GITHUB_APP_ID
      - GITHUB_CLIENT_ID
      - GITHUB_CLIENT_SECRET
      - GITHUB_PRIVATE_KEY
      - GITHUB_TOKEN
```

Then run:

```bash
docker compose up --no-log-prefix
```

**What it configures:**
- GitHub App authentication
- GitHub catalog provider for automatic repository discovery
- GitHub integration for actions, issues, pull requests, and more

**Required environment variables:**

- `GITHUB_ORG`: Organization name
- `GITHUB_APP_ID`: GitHub App ID (for authentication)
- `GITHUB_CLIENT_ID`: OAuth App client ID (for authentication)
- `GITHUB_CLIENT_SECRET`: OAuth App client secret (for authentication)
- `GITHUB_PRIVATE_KEY`: GitHub App private key (for authentication)
- `GITHUB_TOKEN`: Personal access token or GitHub App token

**Optional environment variables:**
- `GITHUB_ORG`: Organization name (defaults to all accessible orgs)
- `GITHUB_HOST`: GitHub Enterprise hostname (defaults to `github.com`)

Check a complete configuration on our [GitHub Profile example](https://github.com/veecode-platform/devportal-samples/tree/main/github).

### GitLab Profile

Create a `docker-compose.yml`:

```yaml
services:
  devportal:
    image: veecode/devportal:latest
    ports:
      - "7007:7007"
    environment:
      - VEECODE_PROFILE=gitlab
      - GITLAB_TOKEN=${GITLAB_TOKEN}
      - GITLAB_CLIENT_ID=${GITLAB_CLIENT_ID}
      - GITLAB_CLIENT_SECRET=${GITLAB_CLIENT_SECRET}
      - GITLAB_GROUP=my-group  # optional
```

Then run:

```bash
docker compose up --no-log-prefix
```

**What it configures:**
- GitLab OAuth authentication
- GitLab catalog provider
- GitLab integration

**Required environment variables:**
- `GITLAB_TOKEN`: Personal access token
- `GITLAB_CLIENT_ID`: OAuth App client ID
- `GITLAB_CLIENT_SECRET`: OAuth App client secret

**Optional environment variables:**
- `GITLAB_HOST`: GitLab instance hostname (defaults to `gitlab.com`)
- `GITLAB_GROUP`: Group name for catalog discovery

### Azure DevOps Profile

Create a `docker-compose.yml`:

```yaml
services:
  devportal:
    image: veecode/devportal:latest
    ports:
      - "7007:7007"
    environment:
      - VEECODE_PROFILE=azure
      - AZURE_TENANT_ID
      - AZURE_CLIENT_ID
      - AZURE_CLIENT_SECRET
      - AZURE_ORGANIZATION
      - AZURE_PROJECT
      - AZURE_TOKEN
```

Then run:

```bash
docker compose up --no-log-prefix
```

**What it configures:**
- Azure DevOps authentication
- Azure Repos catalog provider
- Azure DevOps integration

**Required environment variables:**

- `AZURE_TENANT_ID`: Azure tenant ID for authentication
- `AZURE_CLIENT_ID`: Azure application client ID
- `AZURE_CLIENT_SECRET`: Azure application client secret
- `AZURE_ORGANIZATION`: Azure DevOps organization name
- `AZURE_TOKEN`: Personal access token

**Optional environment variables:**
- `AZURE_PROJECT`: Specific project name (defaults to all projects)

## Combining Profiles with Custom Config

You can use a profile as a base and override specific settings with a custom config file:

```yaml
services:
  devportal:
    image: veecode/devportal:latest
    ports:
      - "7007:7007"
    environment:
      - VEECODE_PROFILE=github
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    volumes:
      - ./app-config.local.yaml:/app/app-config.local.yaml:ro
```

The configuration is merged in this order:
1. Default configuration (built into image)
2. Profile configuration (from `VEECODE_PROFILE`)
3. Custom configuration (from `/app/app-config.local.yaml`)

## Creating OAuth Apps

### GitHub OAuth App

1. Go to **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. Set **Homepage URL**: `http://localhost:7007`
3. Set **Authorization callback URL**: `http://localhost:7007/api/auth/github/handler/frame`
4. Copy the **Client ID** and generate a **Client Secret**

### GitLab OAuth App

1. Go to **User Settings** → **Applications**
2. Set **Redirect URI**: `http://localhost:7007/api/auth/gitlab/handler/frame`
3. Select scopes: `read_user`, `read_repository`, `write_repository`, `openid`, `profile`, `email`
4. Copy the **Application ID** and **Secret**

### Azure DevOps Token

1. Go to **User settings** → **Personal access tokens**
2. Create a new token with scopes: `Code (Read)`, `Graph (Read)`, `Project and Team (Read)`
3. Copy the token value

## Troubleshooting

### Profile not working

Check the container logs:

```bash
docker logs devportal
```

Look for profile-related messages during startup.

### Authentication fails

Verify your OAuth callback URLs match exactly:
- GitHub: `http://localhost:7007/api/auth/github/handler/frame`
- GitLab: `http://localhost:7007/api/auth/gitlab/handler/frame`

### Catalog not populating

Ensure your token has the correct permissions:
- GitHub: `repo` scope for private repos, `public_repo` for public
- GitLab: `read_repository` scope
- Azure: `Code (Read)` scope

## Next Steps

- [Custom Configuration](./custom-config) for advanced customization
- [Dynamic Plugins](./custom-plugins) to enable additional features
- [Custom Catalog](./custom-catalog) to add manual catalog entries

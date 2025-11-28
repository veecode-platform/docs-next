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
- **Default Settings**: Sensible defaults for common use cases

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
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
      - GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
      - GITHUB_ORG=my-organization  # optional
```

Create a `.env` file:

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_CLIENT_ID=Iv1.xxxxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxx
```

Then run:

```bash
docker compose up -d
```

Alternatively, using `docker run`:

```bash
docker run --rm --name devportal -d \
  -p 7007:7007 \
  -e VEECODE_PROFILE=github \
  -e GITHUB_TOKEN=your_github_token \
  -e GITHUB_CLIENT_ID=your_oauth_client_id \
  -e GITHUB_CLIENT_SECRET=your_oauth_client_secret \
  veecode/devportal:latest
```

**What it configures:**
- GitHub OAuth authentication
- GitHub catalog provider for automatic repository discovery
- GitHub integration for fetching repository data

**Required environment variables:**
- `GITHUB_TOKEN`: Personal access token or GitHub App token
- `GITHUB_CLIENT_ID`: OAuth App client ID (for authentication)
- `GITHUB_CLIENT_SECRET`: OAuth App client secret (for authentication)

**Optional environment variables:**
- `GITHUB_ORG`: Organization name (defaults to all accessible orgs)
- `GITHUB_HOST`: GitHub Enterprise hostname (defaults to `github.com`)

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

Create a `.env` file:

```bash
GITLAB_TOKEN=glpat-xxxxxxxxxxxx
GITLAB_CLIENT_ID=xxxxxxxxxxxx
GITLAB_CLIENT_SECRET=xxxxxxxxxxxx
```

Then run:

```bash
docker compose up -d
```

Alternatively, using `docker run`:

```bash
docker run --rm --name devportal -d \
  -p 7007:7007 \
  -e VEECODE_PROFILE=gitlab \
  -e GITLAB_TOKEN=your_gitlab_token \
  -e GITLAB_CLIENT_ID=your_oauth_client_id \
  -e GITLAB_CLIENT_SECRET=your_oauth_client_secret \
  veecode/devportal:latest
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
      - AZURE_TOKEN=${AZURE_TOKEN}
      - AZURE_ORG=${AZURE_ORG}
      - AZURE_PROJECT=my-project  # optional
```

Create a `.env` file:

```bash
AZURE_TOKEN=xxxxxxxxxxxx
AZURE_ORG=my-organization
```

Then run:

```bash
docker compose up -d
```

Alternatively, using `docker run`:

```bash
docker run --rm --name devportal -d \
  -p 7007:7007 \
  -e VEECODE_PROFILE=azure \
  -e AZURE_TOKEN=your_azure_token \
  -e AZURE_ORG=your_organization \
  veecode/devportal:latest
```

**What it configures:**
- Azure DevOps authentication
- Azure Repos catalog provider
- Azure DevOps integration

**Required environment variables:**
- `AZURE_TOKEN`: Personal access token
- `AZURE_ORG`: Azure DevOps organization name

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
3. Custom configuration (from `app-config.local.yaml`)

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

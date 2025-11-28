---
sidebar_position: 2
sidebar_label: GitHub Auth
title: GitHub Authentication
---
<!-- LLM: DO NOT TOUCH ABOVE -->

<!-- LLM: Explain in this page content how to configure the github auth provider in VeeCode DevPortal (VeeCode DevPortal is a Backstage distribution).

Explain what that this provider does and how to configure it.

Useful links to follow (you can include these links in the page):
- GitHub Authentication Provider Docs: https://backstage.io/docs/auth/github/provider/
- GitHub Authentication Provider README: https://github.com/backstage/backstage/blob/master/docs/auth/github/provider.md

DO NOT ERASE THIS BLOCK COMMENT
-->

## GitHub Authentication Provider

The GitHub Authentication Provider enables users to sign in to VeeCode DevPortal using their GitHub accounts. This integration provides a secure and familiar authentication experience.

## Features

- OAuth 2.0 based authentication and SSO
- GitHub App and Github OAuth App authentication support
- Better rate limits against GitHub APIs (GitHub App)

## Prerequisites

1. A GitHub account with admin access to your organization
2. Choose what authentication method you want to use:
   - OAuth App (simpler)
   - GitHub App (better rate limits and organization access)

## Option A: OAuth App Authentication

### Step 1: Create an OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on "New OAuth App"
3. Fill in the application details:
   - **Application name**: VeeCode DevPortal
   - **Homepage URL**: `https://your-veecode-instance.com`
   - **Authorization callback URL**: `https://your-veecode-instance.com/api/auth/github/handler/frame`
4. Click "Register application"
5. Note down the **Client ID** and generate a new **Client Secret**

### Step 2. Configure VeeCode DevPortal

Add the following configuration to your `app-config.yaml`:

```yaml
auth:
  environment: development
  providers:
    github:
      development:
        clientId: ${AUTH_GITHUB_CLIENT_ID}
        clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
        # Optional: Set to true to enable GitHub App authentication
        # appAuth: ${AUTH_GITHUB_APP_AUTH}
        # Optional: Set to true to require organization membership
        # requireOrgMembership: true
        # Optional: Restrict access to specific organizations
        # allowedOrganizations: [your-org]
```

:::note
Please notice that the `app-config.yaml` file content is defined by the Helm "values-yaml" file, right under `upstream.backstage.appConfig`.
:::

### Step 3: Advanced Configuration (Organization/Team Access)

To restrict access to specific GitHub organizations or teams:

```yaml
# app-config.yaml
auth:
  providers:
    github:
      development:
        # ... other config ...
        allowedOrganizations: [your-org]
        # Or for specific teams:
        # allowedOrganizations: [your-org/team-name]
```

## Option B: GitHub App Authentication (recommended)

### Step 1: Create a GitHub App

For enhanced security and rate limiting, use GitHub App authentication.

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on "New Github App"
3. Fill in the application details:
   - **GitHub App name**: VeeCode DevPortal
   - **Homepage URL**: `https://your-veecode-instance.com`
   - **Authorization callback URL**: `https://your-veecode-instance.com/api/auth/github/handler/frame`
   - **Webhook URL**: xxx
   - **Webhook secret**: xxx
   - **Permissions**:
     - TODO
   - **Where can this GitHub App be installed**: only your account or any organization
     
4. Click "Register application"

1. Create a GitHub App in your organization
2. Install the app to your organization
3. Generate a private key
4. Update your configuration:

```yaml
# app-config.yaml
auth:
  providers:
    github:
      development:
        clientId: ${AUTH_GITHUB_CLIENT_ID}
        clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
        appId: ${AUTH_GITHUB_APP_ID}
        privateKey: ${AUTH_GITHUB_PRIVATE_KEY}
        appAuth: true
```

## Troubleshooting

- **Callback URL Mismatch**: Ensure the callback URL in your GitHub OAuth app matches exactly with your VeeCode DevPortal URL.
- **Insufficient Permissions**: Verify that the OAuth app has the required scopes (`read:user`, `user:email`).
- **Rate Limiting**: Consider using GitHub App authentication for higher rate limits.

## Security Considerations

- Never commit client secrets or private keys to version control
- Use environment variables for sensitive configuration
- Regularly rotate your client secrets and private keys
- Enable 2FA for your GitHub organization

## References

- [Backstage GitHub Auth Provider Docs](https://backstage.io/docs/auth/github/provider/)
- [BackstageGitHub Authentication Provider 'README'](https://github.com/backstage/backstage/blob/master/docs/auth/github/provider.md)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [GitHub App Authentication](https://docs.github.com/en/developers/apps/getting-started-with-apps/about-apps)

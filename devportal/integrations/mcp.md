---
sidebar_position: 7
sidebar_label: MCP Actions
title: Expose DevPortal tools to AI clients
---

MCP Actions runs an MCP server inside DevPortal 3.x that lets external AI clients use catalog, scaffolder, TechDocs, and Kubernetes tools. Clients can authenticate in one of two ways. A static token connects the client as one shared service identity. OAuth 2.1 signs each user in as their own DevPortal identity, so the tools run with that user's permissions. This page covers MCP Actions only.

## Install the MCP server

The `mcp-actions-backend` module is a Marketplace plugin. Install it from the Extensions page, or add this entry to an operator plugin file (see [Configure dynamic plugins for the local stack](../installation-guide/docker-local/custom-plugins.md)):

```yaml
plugins:
  - package: oci://quay.io/veecode/backstage-plugin-mcp-actions-backend@sha256:d4d24e08d7630eb352fa7e6dc1da797ebc4e667aba347575dd94d4bcde82e8e2
    disabled: false
    pluginConfig:
      backend:
        auth:
          externalAccess:
            - type: static
              options:
                token: ${MCP_TOKEN}
                subject: mcp-clients
```

Set `MCP_TOKEN` to a long random value of your choice (at least 8 characters) and pass it as an environment variable on the `devportal` service in a Compose override, or through a Kubernetes Secret referenced with `${...}`. The token goes in the `Authorization: Bearer <token>` header of every MCP client request. Anyone holding it can call the MCP tools, so treat it as a secret.

## Add tool extras

The tool sets for each domain come from separate Marketplace modules. Install the ones you want from the Extensions page, or add their entries to the same operator plugin file:

```yaml
plugins:
  - package: oci://quay.io/veecode/red-hat-developer-hub-backstage-plugin-software-catalog-mcp-extras@sha256:908e807eb7733d34cd5c1bb2061df41905ac8565c17ba46c7eea63c94c02ca5d
    disabled: false
  - package: oci://quay.io/veecode/red-hat-developer-hub-backstage-plugin-techdocs-mcp-extras@sha256:f8ddd8242bab97849548c5acdb212c98bd979b19948279122fc116d40f910947
    disabled: false
  - package: oci://quay.io/veecode/red-hat-developer-hub-backstage-plugin-scaffolder-mcp-extras@sha256:43bed3ca2ed9f8b737d8c4a58f99260a35fc853013183969140e55cc3af62098
    disabled: false
  - package: oci://quay.io/veecode/red-hat-developer-hub-backstage-plugin-kubernetes-mcp-extras@sha256:1a75f47882b587fca47c5fb509814115c89ef6fcafa7f50e027e4abb041bbc4f
    disabled: false
```

The extras register their tools with the MCP server:

- `software-catalog-mcp-extras`: query catalog entities and their metadata.
- `techdocs-mcp-extras`: read TechDocs documentation.
- `scaffolder-mcp-extras`: scaffolder tools.
- `kubernetes-mcp-extras`: Kubernetes tools.

Recreate the stack after changing the operator file so the installer picks the entries up (see [Configure dynamic plugins for the local stack](../installation-guide/docker-local/custom-plugins.md)).

## Connect a client

The MCP server uses streamable HTTP at `http(s)://<portal-host>/api/mcp-actions/v1`. Check your MCP client's documentation for which endpoint style it needs.

### Authenticate with the static token

Send the static token in the `Authorization` header. Every client that holds the token connects as the `mcp-clients` subject from the install entry above.

Example client configuration, with `<portal-host>` replaced by your portal address and `<token>` by the `MCP_TOKEN` value:

```json
{
  "mcpServers": {
    "devportal-actions": {
      "url": "https://<portal-host>/api/mcp-actions/v1",
      "headers": {
        "Authorization": "Bearer <token>"
      }
    }
  }
}
```

To have each user sign in with their own identity, see [Sign in as the user with OAuth](#sign-in-as-the-user-with-oauth).

## Sign in as the user with OAuth

With OAuth, each user signs in to DevPortal and approves the client on a consent page. The tools then run with that user's permissions. The client sends no `Authorization` header. It opens the browser for sign-in and consent instead.

### Turn on OAuth in app config

Add this block to the portal's app config. On Kubernetes, put it under `upstream.backstage.appConfig` in the chart values, as described in [Install DevPortal with Helm](../installation-guide/production-setup/setup.md). On the local stack, add it to the configuration fragment described in [Add configuration to the local stack](../installation-guide/docker-local/custom-config.md).

```yaml
auth:
  clientIdMetadataDocuments:
    enabled: true
    allowedRedirectUriPatterns:
      - 'http://127.0.0.1:*/callback'
      - 'http://localhost:*/callback'
      - 'https://claude.ai/api/mcp/auth_callback'
  experimentalRefreshToken:
    enabled: true
    tokenLifetime: { days: 30 }
    maxRotationLifetime: { years: 1 }
    maxTokensPerUser: 20
```

The loopback patterns serve clients such as Claude Code, Codex, and Cursor. These clients open a local callback on a random port. The claude.ai pattern serves claude.ai and Claude Desktop connectors.

The `experimentalRefreshToken` block lets clients refresh their sign-in. The values above set a 30-day token lifetime, a one-year maximum rotation lifetime, and up to 20 tokens per user.

### Client ID Metadata Documents (recommended)

Client ID Metadata Documents (CIMD) is the recommended path. The client sends an HTTPS URL as its `client_id`. The portal fetches that document, with a 10-second timeout, a 64 KiB size limit, and no redirects. It reads the client's name and allowed redirect URIs from the document.

Claude's document is `https://claude.ai/oauth/mcp-oauth-client-metadata`. Claude Code's document is `https://claude.ai/oauth/claude-code-client-metadata`. The portal must reach claude.ai over outbound HTTPS to fetch them.

By default, `allowedClientIdPatterns` accepts documents from claude.ai, vscode.dev, the Codex documents on chatgpt.com, and the portal's own CLI document at `<portal-host>/api/auth/.well-known/oauth-client/cli.json`. Set `allowedClientIdPatterns` only to narrow that list.

### Enable the consent page

After sign-in, the browser opens the consent page at `/oauth2/authorize/<session>`. The frontend route comes from the `backstage-plugin-auth` plugin, which the catalog index ships disabled. Without it, the authorize redirect ends on a 404 page.

Enable the plugin with this entry. On the local stack, add it to the operator plugin file. On Kubernetes, add it under `global.dynamic.plugins` in the chart values.

```yaml
plugins:
  - package: oci://quay.io/veecode/backstage-plugin-auth:{{inherit}}!backstage-plugin-auth
    disabled: false
```

On Kubernetes, write the tag as `{{ "{{inherit}}" }}` and nest the entry under `global.dynamic.plugins`. The `{{inherit}}` tag keeps the version the catalog index gives the plugin. The index entry already declares the `/oauth2/*` route, so do not add a `pluginConfig` block here. An override that sets `pluginConfig` replaces the index configuration.

### Connect with OAuth

Once `mcp-actions-backend` is installed, the portal serves the OAuth discovery documents. The client finds the authorization server on its own, so you configure nothing else for discovery.

With OAuth, the client configuration has no `Authorization` header. The client opens the browser for sign-in and consent. For Claude Code, run this command:

```shell
claude mcp add --transport http devportal https://<portal-host>/api/mcp-actions/v1
```

claude.ai and Claude Desktop add the same URL as a custom connector.

### Dynamic Client Registration (deprecated)

Dynamic Client Registration (DCR) lets a client register itself with the portal. Backstage 1.53 deprecated DCR. DCR still works in DevPortal 3.1. While it is on, the backend logs a deprecation warning at startup.

Keep DCR on only for clients that cannot use CIMD. claude.ai and Claude Code prefer CIMD when the portal advertises it. You can turn on CIMD and DCR at the same time.

```yaml
auth:
  experimentalDynamicClientRegistration:
    enabled: true
    allowedRedirectUriPatterns:
      - 'http://127.0.0.1:*/callback'
      - 'http://localhost:*/callback'
```

## Troubleshooting

- Client gets `401 Unauthorized`: the `Authorization` header is missing or the token does not match `MCP_TOKEN`. Confirm the environment variable reached the backend.
- No tools listed: the extras modules are not installed or the stack was not recreated after adding them. Check the install service logs for their entries.
- Connection refused on the local stack: use the published portal address and port (`DEVPORTAL_PORT`), not the container-internal address.
- Client gets `400 Failed to fetch client metadata`: the portal cannot reach the metadata URL that the client sent as its `client_id`. Check outbound HTTPS from the portal to that host.
- Client gets `Invalid redirect_uri`: the callback address does not match any entry in `allowedRedirectUriPatterns`. Add a pattern for that address.
- Browser shows a 404 after sign-in: the `backstage-plugin-auth` plugin is not enabled. See [Enable the consent page](#enable-the-consent-page).
- Startup log shows a DCR deprecation warning: this is expected while `experimentalDynamicClientRegistration` is on. Turn DCR off when no client needs it.

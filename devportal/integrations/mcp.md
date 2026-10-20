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
  - package: oci://quay.io/veecode/backstage-plugin-mcp-actions-backend:{{inherit}}
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
  - package: oci://quay.io/veecode/red-hat-developer-hub-backstage-plugin-software-catalog-mcp-extras:{{inherit}}
    disabled: false
  - package: oci://quay.io/veecode/red-hat-developer-hub-backstage-plugin-techdocs-mcp-extras:{{inherit}}
    disabled: false
  - package: oci://quay.io/veecode/red-hat-developer-hub-backstage-plugin-scaffolder-mcp-extras:{{inherit}}
    disabled: false
  - package: oci://quay.io/veecode/red-hat-developer-hub-backstage-plugin-kubernetes-mcp-extras:{{inherit}}
    disabled: false
```

The `{{inherit}}` tag installs the version that the catalog index of your DevPortal release ships. On Kubernetes, put the same entries under `global.dynamic.plugins` and write the tag as `{{ "{{inherit}}" }}`, as the example in [Upgrade DevPortal 3.x](../installation-guide/production-setup/upgrade.md) shows.

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

With OAuth, each user signs in to DevPortal and approves the client on a consent page. The tools then run with that user's permissions. Per-user OAuth needs DevPortal 3.1 or later. The client configuration contains no token. The client opens the browser for sign-in and consent, then sends the access token it receives.

### Turn on OAuth in app config

Add this block to the portal's app config. On Kubernetes, put it under `upstream.backstage.appConfig` in the chart values, as described in [Install DevPortal with Helm](../installation-guide/production-setup/setup.md). On the local stack, add it to the configuration fragment described in [Add configuration to the local stack](../installation-guide/docker-local/custom-config.md).

```yaml
auth:
  clientIdMetadataDocuments:
    enabled: true
    allowedRedirectUriPatterns:
      - 'http://127.0.0.1:*/*'
      - 'http://localhost:*/*'
      - 'https://claude.ai/api/mcp/auth_callback'
  experimentalRefreshToken:
    enabled: true
```

Setting `allowedRedirectUriPatterns` replaces the default loopback patterns, so the list repeats them and adds the claude.ai callback. The loopback patterns accept any port and any path. Local clients need that: they pick a free port, and some, such as Codex, add an ID to the callback path. The claude.ai pattern serves claude.ai, Claude Desktop, and the other hosted Claude apps.

The `experimentalRefreshToken` block lets clients renew their sign-in. By default, a refresh token lasts 30 days before rotation (`tokenLifetime`). A session lasts up to one year across rotations (`maxRotationLifetime`). Each user holds up to 20 refresh tokens (`maxTokensPerUser`). Refresh also needs the user's entity in the catalog.

### Client ID Metadata Documents (recommended)

Client ID Metadata Documents (CIMD) is the recommended path. The client sends an HTTPS URL as its `client_id`. The portal fetches that document, with a 10-second timeout, a 64 KiB size limit, and no redirects. It reads the client's name and allowed redirect URIs from the document.

Claude's document is `https://claude.ai/oauth/mcp-oauth-client-metadata`. Claude Code's document is `https://claude.ai/oauth/claude-code-client-metadata`. The portal must reach claude.ai over outbound HTTPS to fetch them.

By default, `allowedClientIdPatterns` accepts documents from claude.ai, vscode.dev, the Codex documents on chatgpt.com, and the portal's own CLI document at `<portal-host>/api/auth/.well-known/oauth-client/cli.json`. Setting `allowedClientIdPatterns` replaces that list. The one exception is the portal's own CLI document, which the portal always adds back. Repeat the other defaults you want to keep.

### Enable the consent page

After sign-in, the browser opens the consent page at `/oauth2/authorize/<session>`. The frontend route comes from the `backstage-plugin-auth` plugin, which the catalog index ships disabled. Without it, the authorize redirect ends on a 404 page.

Enable the plugin with this entry. On the local stack, add it to the operator plugin file. On Kubernetes, add it under `global.dynamic.plugins` in the chart values.

```yaml
plugins:
  - package: oci://quay.io/veecode/backstage-plugin-auth:{{inherit}}
    disabled: false
```

On Kubernetes, use this form in the chart values:

```yaml
global:
  dynamic:
    plugins:
      - package: oci://quay.io/veecode/backstage-plugin-auth:{{ "{{inherit}}" }}
        disabled: false
```

The `{{inherit}}` tag keeps the version the catalog index gives the plugin. The index entry already declares the `/oauth2/*` route, so do not add a `pluginConfig` block here. An override that sets `pluginConfig` replaces the index configuration.

### Connect with OAuth

With DevPortal 3.1, `mcp-actions-backend` serves the OAuth discovery documents when CIMD or Dynamic Client Registration (DCR) is on. The documents list the scopes clients should request. The client finds the authorization server on its own, so you configure nothing else for discovery.

With OAuth, the client configuration has no `Authorization` header. The client opens the browser for sign-in and consent. For Claude Code, run these two commands:

```shell
claude mcp add-json devportal '{"type":"http","url":"https://<portal-host>/api/mcp-actions/v1","oauth":{"scopes":"openid offline_access"}}' --scope user
claude mcp login devportal
```

The `oauth.scopes` value asks for `offline_access`, so the client gets a refresh token and stays signed in after the one-hour access token expires. `--scope user` makes the server available in every folder, while the default scope covers only the current folder. `claude mcp login` opens the browser for sign-in and the consent page, where the user approves with **Authorize**.

claude.ai and Claude Desktop add the same URL as a custom connector. These hosted Claude apps reach the portal from Anthropic's servers, not from the user's machine. The portal's MCP endpoint and its `/api/auth` discovery must therefore accept connections from [Anthropic's published IP address ranges](https://platform.claude.com/docs/en/api/ip-addresses). Claude Code signs in from the user's machine.

### Dynamic Client Registration (deprecated)

Dynamic Client Registration (DCR) lets a client register itself with the portal. Backstage 1.53 deprecated DCR. DCR still works in DevPortal 3.1. While it is on, the backend logs a deprecation warning at startup.

Keep DCR on only for clients that cannot use CIMD. claude.ai and Claude Code prefer CIMD when the portal advertises it. You can turn on CIMD and DCR at the same time.

```yaml
auth:
  experimentalDynamicClientRegistration:
    enabled: true
```

Cursor connects through DCR. By default, the DCR redirect patterns accept loopback callbacks on any port and path, plus the Cursor callbacks `cursor://*` and `https://www.cursor.com/*`. Setting `allowedRedirectUriPatterns` replaces those defaults.

## Troubleshooting

- Client gets `401 Unauthorized`: the `Authorization` header is missing or the token does not match `MCP_TOKEN`. Confirm the environment variable reached the backend.
- No tools listed: the extras modules are not installed or the stack was not recreated after adding them. Check the install service logs for their entries.
- Connection refused on the local stack: use the published portal address and port (`DEVPORTAL_PORT`), not the container-internal address.
- Browser shows `400 Failed to fetch client metadata` at the authorize URL: the portal cannot fetch the metadata URL that the client sent as `client_id`. The fetch fails on a non-2xx response, a redirect, a timeout of 10 seconds, or a DNS error. Check outbound HTTPS from the portal to the host in that URL.
- `Invalid client_id URL` means the metadata host resolves to a private or non-public address, and the portal refuses that address.
- `Invalid redirect_uri`: the callback matches no pattern in `allowedRedirectUriPatterns`, so add one. When the message ends in `not registered in client metadata`, the client's own metadata document does not list that callback, and no portal setting fixes it.
- Browser shows the portal's not-found page after sign-in when the `backstage-plugin-auth` plugin is not enabled. See [Enable the consent page](#enable-the-consent-page).
- claude.ai cannot connect, but Claude Code can, when the portal does not accept connections from Anthropic's published IP address ranges.
- Startup log shows a DCR deprecation warning: this is expected while `experimentalDynamicClientRegistration` is on. Turn DCR off when no client needs it.

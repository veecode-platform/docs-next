---
sidebar_position: 1
sidebar_label: Install
title: Install DevPortal 3.x
---

This page installs DevPortal 3.x on Kubernetes with the `devportal` Helm chart. The portal runs behind an Ingress with TLS, users sign in through an identity provider over OpenID Connect (OIDC), and guest sign-in is off. The steps use Keycloak as the identity provider and a PostgreSQL database that runs in the cluster, so you can follow them on an empty test cluster. [Replace the parts that are placeholders](#what-you-replace-for-your-environment) before you run the portal for real users.

:::warning Guest sign-in is on by default
The chart ships guest sign-in **enabled** and maps the guest identity to the `ADMIN` user (`user:default/admin`). Anyone who can reach the portal URL enters as an administrator, without a password. That is useful for a first look and dangerous for anything else. The single off switch is `global.veecode.guestAuth.enabled: false`, and [Step 6](#step-6-install-devportal) sets it. Never expose an installation with the default.
:::

## Before you start

You need:

- A Kubernetes cluster with an Ingress controller, and `kubectl` and Helm 3 pointed at it. The steps were followed on k3s 1.31 with its bundled Traefik controller (`className: traefik`) and Helm 3.20.
- Two DNS names that resolve to the Ingress controller: one for the portal and one for the identity provider. The steps use `devportal.example.com` and `keycloak.example.com`.
- `openssl` and `curl` on your machine.

The chart installs no database. The steps run a disposable PostgreSQL in the cluster. For production, use a PostgreSQL that you operate, and give the portal a user that can create databases, because the portal creates one database per plugin.

### What you replace for your environment

| Part | What the steps use | What you use |
| --- | --- | --- |
| Hostnames | `devportal.example.com` and `keycloak.example.com` | Your own names, set once in Step 1 |
| Certificate | A self-signed certificate that covers both names | A certificate from your certificate authority (CA), stored in the same kind of Secret in Step 2 |
| Identity provider | Keycloak in the cluster, in development mode | Your own Keycloak or another OIDC provider, which Step 4 lists the settings for |
| Database | PostgreSQL 16 in the cluster | Your PostgreSQL, in the Secret of Step 5 |
| Ingress class | `traefik` | The class of your controller, in the values file of Step 6 |

Run every command in one terminal session. Later steps use the shell variables that Step 1 sets.

## Step 1: Choose names and generate secrets

```bash
export NAMESPACE=devportal
export DEVPORTAL_HOST=devportal.example.com
export KEYCLOAK_HOST=keycloak.example.com

export DB_PASSWORD="$(openssl rand -hex 16)"
export BACKEND_SECRET="$(openssl rand -hex 16)"
export AUTH_SESSION_SECRET="$(openssl rand -hex 16)"
export KEYCLOAK_CLIENT_SECRET="$(openssl rand -hex 16)"
export KEYCLOAK_USER_PASSWORD="$(openssl rand -hex 16)"
```

Use the bare hostname, without `https://` and without a port. The chart builds `https://` followed by `global.host` for the application and backend URLs.

## Step 2: Create the namespace and the TLS Secret

```bash
kubectl create namespace "$NAMESPACE"

openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
  -keyout tls.key -out tls.crt \
  -subj "/CN=$DEVPORTAL_HOST" \
  -addext "subjectAltName=DNS:$DEVPORTAL_HOST,DNS:$KEYCLOAK_HOST"

kubectl -n "$NAMESPACE" create secret tls devportal-tls --cert=tls.crt --key=tls.key
```

The certificate is self-signed, so browsers warn about it. With a certificate from your CA, create the same `devportal-tls` Secret from the certificate and key files you received. The certificate must cover both hostnames, or you must create a second Secret for the identity provider's Ingress. Keep `tls.key` private.

## Step 3: Start PostgreSQL

```bash
kubectl -n "$NAMESPACE" create secret generic devportal-db \
  --from-literal=POSTGRES_USER=devportal \
  --from-literal=POSTGRES_PASSWORD="$DB_PASSWORD" \
  --from-literal=POSTGRES_DB=devportal

kubectl -n "$NAMESPACE" apply -f - <<'EOF'
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: devportal-db
spec:
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 2Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: devportal-db
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels: {app: devportal-db}
  template:
    metadata:
      labels: {app: devportal-db}
    spec:
      enableServiceLinks: false
      containers:
        - name: postgres
          image: postgres:16
          envFrom:
            - secretRef: {name: devportal-db}
          env:
            - {name: PGDATA, value: /var/lib/postgresql/data/pgdata}
          ports:
            - {containerPort: 5432}
          volumeMounts:
            - {name: data, mountPath: /var/lib/postgresql/data}
      volumes:
        - name: data
          persistentVolumeClaim: {claimName: devportal-db}
---
apiVersion: v1
kind: Service
metadata:
  name: devportal-db
spec:
  selector: {app: devportal-db}
  ports:
    - {port: 5432, targetPort: 5432}
EOF

kubectl -n "$NAMESPACE" rollout status deployment/devportal-db --timeout=5m
```

## Step 4: Start Keycloak

Skip this step if you already run an identity provider. The portal needs an OIDC client with these settings:

- A confidential client with the standard flow on, whose redirect URI is `https://devportal.example.com/api/auth/oidc/handler/frame` (your portal hostname).
- A service account that can read users and groups, with the `realm-management` roles `view-users`, `query-users`, `query-groups` and `view-realm`. The portal uses it to import your users and groups into its catalog.

The realm below creates that client and one user, `alice`. Keycloak reads the `${...}` values in the realm from the `keycloak-env` Secret.

```bash
kubectl -n "$NAMESPACE" create secret generic keycloak-env \
  --from-literal=DEVPORTAL_HOST="$DEVPORTAL_HOST" \
  --from-literal=KEYCLOAK_CLIENT_SECRET="$KEYCLOAK_CLIENT_SECRET" \
  --from-literal=KEYCLOAK_USER_PASSWORD="$KEYCLOAK_USER_PASSWORD"

cat > realm.json <<'EOF'
{
  "realm": "devportal",
  "enabled": true,
  "clients": [
    {
      "clientId": "devportal",
      "enabled": true,
      "protocol": "openid-connect",
      "publicClient": false,
      "secret": "${KEYCLOAK_CLIENT_SECRET}",
      "standardFlowEnabled": true,
      "directAccessGrantsEnabled": false,
      "serviceAccountsEnabled": true,
      "redirectUris": ["https://${DEVPORTAL_HOST}/*"],
      "webOrigins": ["https://${DEVPORTAL_HOST}"]
    }
  ],
  "users": [
    {
      "username": "alice",
      "email": "alice@example.com",
      "firstName": "Alice",
      "lastName": "Example",
      "enabled": true,
      "emailVerified": true,
      "credentials": [{"type": "password", "value": "${KEYCLOAK_USER_PASSWORD}", "temporary": false}]
    },
    {
      "username": "service-account-devportal",
      "enabled": true,
      "serviceAccountClientId": "devportal",
      "clientRoles": {"realm-management": ["view-users", "query-users", "query-groups", "view-realm"]}
    }
  ]
}
EOF

kubectl -n "$NAMESPACE" create configmap keycloak-realm --from-file=devportal-realm.json=realm.json

kubectl -n "$NAMESPACE" apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: keycloak
spec:
  replicas: 1
  selector:
    matchLabels: {app: keycloak}
  template:
    metadata:
      labels: {app: keycloak}
    spec:
      enableServiceLinks: false
      containers:
        - name: keycloak
          image: quay.io/keycloak/keycloak:26.3.3@sha256:6a7217a100bd3e5de4063a27a538ef999a3c5a88c4b4ec0ffc0a642aee7b2597
          args: ["start-dev", "--import-realm"]
          envFrom:
            - secretRef: {name: keycloak-env}
          env:
            - {name: KC_HOSTNAME, value: "https://$KEYCLOAK_HOST"}
            - {name: KC_HOSTNAME_BACKCHANNEL_DYNAMIC, value: "true"}
            - {name: KC_PROXY_HEADERS, value: xforwarded}
            - {name: KC_HTTP_ENABLED, value: "true"}
            - {name: KC_HEALTH_ENABLED, value: "true"}
          ports:
            - {name: http, containerPort: 8080}
            - {name: management, containerPort: 9000}
          readinessProbe:
            httpGet: {path: /health/ready, port: management}
            initialDelaySeconds: 15
            periodSeconds: 5
          volumeMounts:
            - {name: realm, mountPath: /opt/keycloak/data/import, readOnly: true}
      volumes:
        - name: realm
          configMap: {name: keycloak-realm}
---
apiVersion: v1
kind: Service
metadata:
  name: keycloak
spec:
  selector: {app: keycloak}
  ports:
    - {name: http, port: 8080, targetPort: http}
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: keycloak
spec:
  ingressClassName: traefik
  tls:
    - hosts: ["$KEYCLOAK_HOST"]
      secretName: devportal-tls
  rules:
    - host: "$KEYCLOAK_HOST"
      http:
        paths:
          - {path: /, pathType: Prefix, backend: {service: {name: keycloak, port: {number: 8080}}}}
EOF

kubectl -n "$NAMESPACE" rollout status deployment/keycloak --timeout=5m
```

Keycloak answers on two addresses. Browsers use the public name, `https://keycloak.example.com`, which is what `KC_HOSTNAME` sets. The portal backend uses the cluster Service, `http://keycloak:8080`, which Step 5 stores. With `KC_HOSTNAME_BACKCHANNEL_DYNAMIC` on, Keycloak lists the public address for browsers and the address of each request for the backend.

## Step 5: Create the runtime Secret

The portal reads its database and identity provider settings from one Secret.

```bash
kubectl -n "$NAMESPACE" create secret generic veecode-runtime-secrets \
  --from-literal=PG_HOST=devportal-db \
  --from-literal=PG_PORT=5432 \
  --from-literal=PG_USER=devportal \
  --from-literal=PG_PASSWORD="$DB_PASSWORD" \
  --from-literal=PG_DATABASE=devportal \
  --from-literal=BACKEND_SECRET="$BACKEND_SECRET" \
  --from-literal=AUTH_SESSION_SECRET="$AUTH_SESSION_SECRET" \
  --from-literal=KEYCLOAK_BASE_URL=http://keycloak:8080 \
  --from-literal=KEYCLOAK_REALM=devportal \
  --from-literal=KEYCLOAK_CLIENT_ID=devportal \
  --from-literal=KEYCLOAK_CLIENT_SECRET="$KEYCLOAK_CLIENT_SECRET"
```

With your own PostgreSQL and identity provider, put their values here. `KEYCLOAK_BASE_URL` is the address the portal backend uses to reach the provider, and `KEYCLOAK_REALM` is the realm to read users from.

## Step 6: Install DevPortal

Add the chart repository and list the versions:

```bash
helm repo add veecode https://veecode-platform.github.io/next-charts
helm repo update
helm search repo veecode/devportal --versions
```

This page was followed with chart `0.1.26`, which installs image `3.0.0-beta.10`. The chart pins its image by digest, so the install pulls exactly the image the chart names. Install the newest version in the list unless you need an earlier one.

Save this as `values.yaml`:

```bash
cat > values.yaml <<'EOF'
global:
  veecode:
    guestAuth:
      enabled: false
  dynamic:
    plugins:
      - package: ./dynamic-plugins/dist/backstage-community-plugin-catalog-backend-module-keycloak-dynamic
        disabled: false
        pluginConfig:
          catalog:
            providers:
              keycloakOrg:
                default:
                  baseUrl: ${KEYCLOAK_BASE_URL}
                  loginRealm: ${KEYCLOAK_REALM}
                  realm: ${KEYCLOAK_REALM}
                  clientId: ${KEYCLOAK_CLIENT_ID}
                  clientSecret: ${KEYCLOAK_CLIENT_SECRET}
                  schedule:
                    frequency: {minutes: 5}
                    initialDelay: {seconds: 15}
                    timeout: {minutes: 3}
upstream:
  ingress:
    enabled: true
    className: traefik
    tls:
      enabled: true
      secretName: devportal-tls
  backstage:
    extraEnvVarsSecrets:
      - veecode-runtime-secrets
    appConfig:
      signInPage: oidc
      auth:
        environment: production
        session:
          secret: ${AUTH_SESSION_SECRET}
        providers:
          oidc:
            production:
              metadataUrl: ${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/.well-known/openid-configuration
              clientId: ${KEYCLOAK_CLIENT_ID}
              clientSecret: ${KEYCLOAK_CLIENT_SECRET}
              prompt: auto
EOF
```

What the values do:

`global.veecode.guestAuth.enabled: false`
: Removes the guest sign-in and the `ADMIN` mapping.

`upstream.ingress`
: Creates an Ingress for `global.host` that serves TLS from the `devportal-tls` Secret. Set `className` to the class of your controller.

`auth.environment: production`
: Marks the environment as `production`, so the sign-in page offers no guest option.

`signInPage: oidc`
: Makes the OIDC provider the sign-in method.

`prompt: auto`
: Lets the identity provider decide whether to ask for credentials or to skip the login prompt when the user has a session.

The `${...}` values are read from the runtime Secret when the portal starts. The catalog entry imports your Keycloak users and groups into the portal every 5 minutes, because the portal signs a user in only when it finds a matching user in its catalog.

Install the chart. The hostname is not in the file: `--set global.host` passes it.

```bash
helm install devportal veecode/devportal --version 0.1.26 \
  -n "$NAMESPACE" -f values.yaml --set global.host="$DEVPORTAL_HOST" \
  --wait --timeout 15m
```

## Step 7: Sign in and check

Check that the portal answers over HTTPS. `--cacert` trusts the certificate of Step 2:

```bash
kubectl -n "$NAMESPACE" get pods
curl -sS --cacert tls.crt -o /dev/null -w '%{http_code}\n' "https://$DEVPORTAL_HOST/"
```

Then open `https://devportal.example.com` in a browser (your portal hostname). Accept the certificate warning if you used the self-signed certificate.

1. The sign-in page offers the OIDC provider and no guest option.
2. Select the sign-in button. Keycloak asks for credentials. Sign in as `alice` with the value of `$KEYCLOAK_USER_PASSWORD`.
3. The portal home page opens.

The first sign-in can fail with a message that the user cannot be resolved if you try it in the first minute. The portal imports Keycloak's users shortly after it starts. Wait a minute and sign in again.

### Check that marketplace installs persist

The marketplace is the **Extensions** item in the sidebar. Plugin installations are stored in PostgreSQL and survive a restart of the portal. To check, install a plugin in the marketplace, restart the portal, sign in again, and confirm the plugin is still there:

```bash
kubectl -n "$NAMESPACE" rollout restart deployment/devportal-developer-hub
kubectl -n "$NAMESPACE" rollout status deployment/devportal-developer-hub --timeout=10m
```

## Evaluate without Ingress or an identity provider

For a quick look on a laptop you can skip Ingress, TLS and the identity provider and keep guest sign-in. This is for evaluation only: guest sign-in signs everyone in as `ADMIN`. Create the namespace, the database (Step 3) and the runtime Secret (Step 5, which needs only the `PG_*` and `BACKEND_SECRET` keys), then save this as `values-eval.yaml`:

```yaml
upstream:
  backstage:
    extraEnvVarsSecrets:
      - veecode-runtime-secrets
    appConfig:
      app:
        baseUrl: http://localhost:7007
      backend:
        baseUrl: http://localhost:7007
        cors:
          origin: http://localhost:7007
```

Install it without `global.host`, forward the service, and open `http://localhost:7007`:

```bash
helm install devportal veecode/devportal --version 0.1.26 -n devportal -f values-eval.yaml
kubectl -n devportal port-forward svc/devportal-developer-hub 7007:7007
```

On the sign-in page, choose **Guest**. The URLs say `http` explicitly because the chart builds `https://` URLs from `global.host` when you set it.

## Enable or disable plugins

The default plugins are baked into the DevPortal image, not declared in the chart's `values.yaml`. `global.dynamic.plugins` only adds to them. To disable a default plugin, add an entry with its exact package reference and `disabled: true`; the chart's [product face guide](https://github.com/veecode-platform/devportal-chart/blob/main/docs/product-face-overrides.md) lists every reference:

```yaml
global:
  dynamic:
    plugins:
      - package: PLUGIN_PACKAGE_REFERENCE
        disabled: true
```

## What ships by default

- VeeCode analytics home
- Global header, VeeCode theme, and About
- Marketplace
- TechDocs, Notifications, Signals, and Tech Radar
- RBAC UI; enforcement is **off** by default
- A read-only ClusterRole for the Kubernetes plugin, gated by `kubernetesPlugin.rbac`

## Version and lineage

Each chart version pins its image by digest. Chart `0.1.26` installs image `3.0.0-beta.10`. Never point production at `:edge`.

The chart source is [veecode-platform/devportal-chart](https://github.com/veecode-platform/devportal-chart). It is a renamed fork of [redhat-developer/rhdh-chart](https://github.com/redhat-developer/rhdh-chart) pinned at `backstage-7.0.1`.

## Attribution

The OIDC configuration and the identity provider steps on this page are adapted from [Red Hat Developer Hub documentation](https://github.com/redhat-developer/red-hat-developers-documentation-rhdh), licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). VeeCode modified the text: it replaced Red Hat build of Keycloak with Keycloak, changed the configuration to the `devportal` chart, and added the steps for the Ingress, the certificate and the database.

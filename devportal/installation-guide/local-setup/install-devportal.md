---
sidebar_position: 5
sidebar_label: DevPortal Deployment
title: DevPortal Deployment
---

In this step, you will deploy and access **VeeCode DevPortal** in your local environment.

## Steps Overview

In this section, you will:

1. **Check Requirements**: Ensure Docker, Kubernetes, DNS, and GitHub token are ready.
1. **Deploy DevPortal** into your local cluster with a single `vkdr` command.

By the end, you will have a fully functional DevPortal instance running locally for testing, learning, and development.

## Step 1: Requirements Check

Before deploying DevPortal, ensure the following prerequisites are ready:

- **Docker Engine** — Installed and running (completed in [Step 2: Docker Engine](requirements.md#step-2-docker-engine)).
- **Kubernetes cluster** — Created with `vkdr infra up` (completed in [Step 3: Infrastructure Setup](infra.md#step-1-start-a-local-cluster)).
- **DNS name** — Configured for accessing DevPortal (this guide uses `devportal.localhost`, configured in [Step 3: Infrastructure Setup](infra.md#step-2-create-host-entries)).
- **GitHub personal access token** — Stored in the `$GITHUB_TOKEN` environment variable (set up in [Step 4: GitHub Access Configuration](github.md)).

Once these requirements are in place, you’re ready to deploy DevPortal.

## Step 2: Deploy DevPortal

The command `vkdr devportal install` not only installs DevPortal and its dependencies but also **deploys and starts all required services and sample applications** inside the Kubernetes cluster.

Run:

```sh
vkdr devportal install \
  --github-token=$GITHUB_TOKEN \
  --install-samples
```

Expected output (example):

```sh
DevPortal Install
==============================
Domain: localhost
Secure: false
Github Token: *****sE9
Install Sample apps: true
Cluster LB HTTP port: 8000
Cluster LB HTTPS port: 8001
==============================

Kong Install
==============================
Domain: localhost
Mode: standard
Image tag: 3.9.1
Default Ingress Controller: true
Log level: notice
Cluster LB HTTP port: 8000
Cluster LB HTTPS port: 8001
==============================

NAME: kong
NAMESPACE: vkdr
STATUS: deployed

NAME: veecode-devportal
NAMESPACE: platform
STATUS: deployed

service/petclinic created
ingress/petclinic created
service/cep created
ingress/cep-ingress created

Script executed successfully.
```

This command performs a full deployment, which includes:

- **VeeCode DevPortal** — The main DevPortal application, available at [http://devportal.localhost:8000](http://devportal.localhost:8000).
- **Kong Gateway** — The API gateway that routes and manages requests within the cluster.
- **PetClinic (sample app)** — A demo web application for exploration, available at [http://petclinic.localhost:8000](http://petclinic.localhost:8000).
- **ViaCEP (sample API)** — A demo API that retrieves address data based on a given Brazilian postal code (CEP), available at `http://localhost:8000/cep/<cep-code>/json`. For example: [http://localhost:8000/cep/01001000/json](http://localhost:8000/cep/01001000/json).

### Check Deployment

Open the following URL in your browser:

> http://devportal.localhost:8000

The DevPortal interface should load, confirming that the deployment was successful and the applications are running.

---

In the next section, we will guide you through the DevPortal web interface, where the deployed sample applications and APIs are fully catalogued and ready for you to explore and interact with.

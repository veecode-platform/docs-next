---
sidebar_position: 1
sidebar_label: Requirements
title: Requirements
---

In this step, you will verify that all prerequisites are met.
Each of these tools is essential for setting up and running your local DevPortal environment.
If a requirement is already satisfied, simply verify it and move on to the next item.

## Steps Overview

In this section, you will:

1. Verify that a Unix-like shell is available.
1. Check that Docker is installed and running.
1. Ensure Git CLI is installed and configured.
1. Confirm you have a GitHub account.

By the end, all prerequisites will be ready for setting up your local DevPortal environment.

## Step 1: Linux or macOS Shell

You need a Unix-like shell environment to run the installation commands.

- On **Linux** or **macOS**, you already have one by default (Bash, Zsh, etc.). No action needed.
- On **Windows**, install [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install) to get a proper Linux shell inside Windows.

The installation scripts and CLI commands assume a Unix-like shell. Using the right shell ensures compatibility and avoids errors during setup.

### Check Installation

Run the following command:

```bash
echo $SHELL
```

Expected output: `/bin/bash` or `/bin/zsh`.

> Note: The exact shell path may vary depending on your system. You only need to confirm that a Unix-like shell is available.

## Step 2: Docker Engine

Docker is required because DevPortal runs inside containers. You will also use Docker indirectly through `k3d`, which launches a Kubernetes cluster inside Docker.

Choose the version appropriate for your OS:

- [Install Docker Engine](https://docs.docker.com/engine/install/): The native runtime for Linux. It is the core service that creates and manages containers. Or,
- [Install Docker Desktop](https://docs.docker.com/get-docker/): The default option for macOS and Windows. It is an application that bundles Docker Engine with a graphical interface, Kubernetes integration, and extra tools. Or,
- [Install Orbstack](https://orbstack.dev): An alternative runtime for macOS users who prefer faster performance.performance.

:::info In practice:

- On **Linux**, most users install **Docker Engine** only.
- On **macOS/Windows**, **Docker Desktop** is the default and easiest option.

:::

Docker provides the container runtime. Without it, Kubernetes and DevPortal cannot run locally.

### Check Installation

Run the following command:

```bash
docker --version
```

Expected output (example):

```sh
Docker version 28.1.1, build 4eba377`
```

> Note: Version numbers may vary depending on your installation. The important part is that Docker runs correctly.

## Step 3: Git CLI

Git is needed to clone repositories and interact with GitHub. Linux and macOS usually come with Git pre-installed, but updating to the latest version is recommended.

- [Install Git](https://git-scm.com/downloads) for your OS.

DevPortal relies on repositories hosted in GitHub. Git ensures you can fetch, update, and manage the source code.

### Check Installation

Run the following command:

```sh
git --version
```

Expected output (example):

```sh
git version 2.49.0
```

> Note: Version numbers may vary. The goal is to confirm Git is installed and accessible.

## Step 4: GitHub Account

A GitHub account is required to generate tokens and grant DevPortal access to your repositories.

- [Sign up at GitHub](https://github.com/join) if you don’t already have an account.

DevPortal uses GitHub APIs to fetch metadata, repositories, and service configurations.
Without an account and credentials, DevPortal cannot integrate with your codebase.

### Check Installation

- Log in at [github.com](https://github.com).
- Confirm you can access your repositories.

---

Once all prerequisites are verified, you are ready to proceed to the VKDR installation.

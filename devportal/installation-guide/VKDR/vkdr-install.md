---
sidebar_position: 2
sidebar_label: VKDR Installation
title: VKDR Installation
---

In this section you will learn how to install and initialize `vkdr`, a lightweight CLI tool that allows safely running VeeCode DevPortal in a local containerized and isolated environment.

:::info VKDR is quite cool!
VKDR stands for "VeeCode Kubernetes Development Runtime", a simple command-line tool that aids on running a local Kubernetes cluster and a few tools that otherwise are quite a bit cumbersome to get them right. The VKDR environment is entirely expendable, allowing you to experiment freely without worrying about long-term impacts — perfect for testing and development purposes. 
:::

### Prerequisites

Before you begin, ensure the following prerequisites are met:

- A Linux or macOS shell (Windows users can use WSL).
- A Docker engine installed on your machine (such as Docker Desktop, Docker CE or Orbstack).
- A Git command-line tool installed on your machine.

### Step 1: Install VKDR

1. Open the terminal.
2. Run the installation script

```sh
curl -s https://get-vkdr.vee.codes | bash
```

The command above will download and install the `vkdr` CLI on your machine into the `/usr/local/bin` directory. There are versiobns for Linux and macOS (both Intel and ARM), so the script will detect your OS and install the correct version.

### Step 2: Initialize VKDR

- Initialize `vkdr` before using it:

```sh
vkdr init
```

The command above will download extra dependencies and set up the local environment in the `~/.vkdr` folder.

- (Optional) Upgrade VKDR whenever necessary:

```sh
vkdr upgrade && vkdr init
```

### Manual Installation (Alternative)

If you prefer, you can install VKDR manually:

1. Download the latest version from the [**releases page](https://github.com/veecode-platform/vkdr/releases).**
2. Add the executable to your PATH (suggested: `/usr/local/bin/`).

If everything is set, proceed to the next step.
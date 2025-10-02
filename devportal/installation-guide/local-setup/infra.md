---
sidebar_position: 3
sidebar_label: Infrastructure Setup
title: Infrastructure Setup
---

In this step, you will configure the local infrastructure that will run **DevPortal** and its dependencies, emulating a real cloud scenario.

## Steps Overview

In this section, you will:

1. **Start a local cluster** to provide the runtime environment.
2. **Create host entries** to make DevPortal and services accessible via friendly domains.

By the end, you will have a fully running local cluster ready to host DevPortal.

## Step 1: Start a Local Cluster

Running `vkdr infra up` starts a lightweight Kubernetes cluster using k3d, a tool that simplifies the process of creating and managing "fake" Kubernetes clusters in Docker. The cluster will be used to run DevPortal and its dependencies.

Run the following command:

```sh
vkdr infra up
```

Expected output (example):

```sh
VKDR Local Infra Start Routine
Ports Used: 8000/http :8001/https
Kubernetes API port: random
Local Docker Hub Registry Mirror: 6001
INFO: Creating Kubernetes nodes and registries...
INFO: Starting LoadBalancer and tools node...
INFO: Cluster 'vkdr-local' created successfully!
INFO: You can now interact with the cluster using kubectl.
Script executed successfully.
```

After this step, the following will be available:

- A local Kubernetes cluster running under Docker.
- Ports **8000** and **8001** bound to HTTP and HTTPS of the first LoadBalancer in the cluster (DevPortal will configure this automatically).
- Local **registry mirrors** (starting from port 6001) to speed up Docker image downloads, even when recycling the cluster.

### Check Cluster Status (Optional)

If you have [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) already installed locally, you can use it to verify that the cluster is running correctly. If you don’t have it — or aren’t sure — you can safely skip this step and continue to configuring host entries; the setup will still work.

Run the following command:

```sh
kubectl cluster-info
```

Expected output (example):

```sh
Kubernetes control plane is running at https://cumbuca.apps.vee.codes:6443
CoreDNS is running at https://cumbuca.apps.vee.codes:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
Metrics-server is running at https://cumbuca.apps.vee.codes:6443/api/v1/namespaces/kube-system/services/https:metrics-server:https/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

Check the nodes:

```sh
kubectl get nodes
```

Expected output:

```sh
NAME                            STATUS   ROLES                  AGE   VERSION
ip-172-31-90-240.ec2.internal   Ready    control-plane,master   1m    v1.33.3+k3s1
```

> Note: Output may vary depending on your environment (IPs, node names, Kubernetes versions, etc.). > The important part is that the cluster is running and nodes are ready.

## Step 2: Create Host Entries

To access DevPortal and other services in your local cluster, you need friendly domain names instead of raw IPs. This is done by adding entries to your `/etc/hosts` file.

Run the following command (or edit your hosts file manually):

```sh
echo "127.0.0.1 devportal.localhost manager.localhost" | sudo tee -a /etc/hosts
```

Expected result (example):

```sh
127.0.0.1 devportal.localhost manager.localhost
```

This maps `devportal.localhost` and `manager.localhost` to your local machine, so you can open DevPortal in a browser as usual.

### Check Host Entries

Run the following command:

```sh
ping -c 1 devportal.localhost
```

Expected output (example):

```sh
PING devportal.localhost (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.141 ms
...
```

Check the manager entry:

```sh
ping -c 1 manager.localhost
```

Expected output (example):

```sh
PING devportal.localhost (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.093 ms
...
```

> Note: Response times and details may vary depending on your system. The important part is receiving replies from `127.0.0.1`, which confirms that host entries are correctly configured and DevPortal will be accessible via the friendly domains.

---

After creating the host entries, your infrastructure is ready. Next, you’ll configure GitHub access by generating a personal token so DevPortal can securely connect to your repositories.

:::tip How to Stop the Local Cluster

When you’re finished with development or need to free up system resources, you can stop the local Kubernetes cluster using `vkdr infra down`. This safely shuts down the cluster and removes temporary resources, while keeping your `~/.vkdr` environment and configuration intact.

**Do not run this command now** — the cluster must stay running for the next step, DevPortal Deployment. If, for any reason, you have already stopped the cluster, run `vkdr infra up` to start it again before proceeding.

:::

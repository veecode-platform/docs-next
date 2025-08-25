---
sidebar_position: 4
sidebar_label: Configure Github/Gitlab integration
title: Configure Git provider integration
---

## Why do we need this?

In order to create and manage catalog repositories or to interact with your Git provider's APIs, we need to configure DevPortal with your credentials. There are many useful GitHub related plugins that make your experience with VeeCode DevPortal even better and they all required this Git provider integration.

:::info
Our documentation is still in progress and we currently providing information on integration against Github and Gitlab. There are Backstage plugins who provide integration against other Git providers, such as Bitbucket and Azure DevOps, and those should work too.
:::

Choose your provider below and prepare the required credentials.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export const your_domain = "devportal.yourdomain.com";

<Tabs>
<TabItem value="github" label="GitHub">

You will need to:

- Create a new GitHub App
- Create a new GitHub Personal Access Token
- Provide a DNS name you will use to access the DevPortal once installed (say, **"{your_domain}"**)

1. **Create a New Github App**

Under your organization settings page access the Developer Settings link and then click on "GitHub Apps" and "New GitHub App" (this may require reauthenticating to GitHub). Fill in the required information, including:

- **GitHub App name:** Choose a name that's easily identifiable, such as "devportal".
- **Description:** (Optional) Add a brief description of the application, such as "VeeCode DevPortal integration at {your_domain}".
- **Homepage URL:** https://{your_domain}
- **Authorization callback URL:** https://{your_domain}/api/auth/github/handler/frame
- **Webhook:** keep it inactive for now.

Make sure to replace "**{your_domain}**" with the actual domain name used in your kubernetes applications (ex: "devportal.mycompany.com").

2. Define permissions

Under "Permissions" you have to configure the permissions that the app will have access to.

- **Repository Permissions**
  - Actions: Read and Write
  - Administrator: Read and Write
  - Code scanning alerts: Read-only
  - Commit Statuses: Read-only
  - Dependabot Alerts: Read-only
  - Dependabot Secrets: Read-only
  - Environments: Read and Write
  - Issues: Read-only
  - Pull Requests: Read-only
- **Organization Permissions**
  - Members: Read-only
- **Account Permissions**
  - Email addresses: Read-only
  
3. Register the GitHub App and write down the IDs and keys generated:

- AppID
- Client ID
- Client secret (click button to generate a new one)

The reason for generating these credentials is to enable the Devportal to authenticate users via GitHub and execute several other tasks and queries. The Client ID uniquely identifies your application, while the Client Secret serves as a secret key for authentication. This OAuth App allows the Devportal to securely connect to GitHub's API, ensuring a seamless integration between the Devportal and users' GitHub accounts without compromising security or hitting rate limits.

</TabItem>
<TabItem value="gitlab" label="GitLab">

You will need:

- GitLab Personal Access Token

TODO

</TabItem>
</Tabs>

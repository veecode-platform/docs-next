---
sidebar_position: 4
sidebar_label: Github Tokens
title: Github Tokens and Secrets
---

In this step you will obtain Github tokens and secrets that are necessary prerequisites for the DevPortal to connect to Github. Take note of them as they will be used in the DevPortal configuration.

## Create an OAuth Application on GitHub (optional but recommended)

If you don't have the required information mentioned in the prerequisites, follow these steps:
1. Go to GitHub and create a new [OAuth application](https://github.com/settings/applications/new).:
    - **Application Name:** Choose an identifiable name, such as "devportal".
    - **Homepage URL:** `http://devportal.localhost:8000`
    - **Description:** (Optional) Add a brief description.
    - **Authorization Callback URL:** `http://devportal.localhost:8000/api/auth/github/handler/frame`

2. Save the Client ID, generate a new Client Secret and take note of it as well.

**Important:** We are using "devportal.localhost" as a local setup domain, a real environment would use a real domain name. Note down the Client ID and Client Secret, as they will be used later on during DevPortal configuration.

## Create an Access Token on GitHub

Follow these steps necessary [Github access token](https://github.com/settings/tokens):

1. Create a new "classic" access token on GitHub (for simplicity):

    - **Name:** An appropriate label, such as "devportal-token".
    - **Expiration Date:** Recommended 90 days.
    - **Scopes:** Select "repo" (full control) and "workflow".

2. Take note of the generated token.

The token will only be displayed once, so make sure to store it in a safe place. 

## Alternative: Create a Fine-grained Access Token on GitHub

You may prefer to use fine grained tokens instead, so you can restrict access to specific repositories or organizations.

1. Create a new "fine grained" access token on GitHub (more secure):

    - **Token name:** An appropriate label, such as "devportal-token".
    - **Resource Owner:** Pick your GitHub username or organization (you may want to create a new org just for this demo).
    - **Repository access:** choose "All repositories" (makes sense for an IDP).
    - **Expiration:** Recommended 90 days.
    - **Permissions:** this is the tricky part, because choices here depend on what DevPortal features you want to use. A typical setup should require (NOTE: still testing this):
      - **Repository permissions**
        - **Actions:** Read/Write.
        - **Administration:** Read/Write.
        - **Metadata:** Read-only.
        - **Contents:** Read/Write.
        - **Pull requests:** Read-only.
        - **Workflows:** Read/Write.
      - **Organization permissions**
        - **Administration:** Read-only.
        - **Members:** Read-only.

2. Take note of the generated token.

If everything is set up correctly, proceed to the next step.

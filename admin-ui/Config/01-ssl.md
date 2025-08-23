---
sidebar_position: 1
sidebar_label: SSL
title: SSL
---
## How to Configure SSL in Admin UI
This guide outlines how to configure SSL settings within the Admin UI of VeeCode DevPortal for secure communication.

### Prerequisites

- Access to the **Admin UI**.
- The public IP address of the EC2 instance running the VeeCode platform.
- Basic understanding of SSL (Secure Sockets Layer) and its importance for secure communications.

## Steps

### Step 1: Access the Admin UI

1. **Login to Admin UI**: Open the Admin UI through your browser.
2. **Navigate to Config**: Once logged in, click on the **"Config"** tab in the Admin UI menu.

### Step 2: SSL Configuration

1. **Select Admin UI Host**:
    - In the **Config** section, select **"Admin-ui host"**.
    - Enter the **public IP address** obtained from the EC2 console into the appropriate field.
2. **Modify the URL**:
    - Replace the base URL with the public IP to ensure that the Admin UI communicates with the correct services.
3. **Enable/Disable SSL**:
    - In the **SSL** field, enable or disable SSL depending on your security requirements. Activating SSL ensures secure communication between the services.

:::warning

Each time the EC2 instance is restarted, a new public IP address is generated. If you require a static IP address to avoid repeated configuration, this can be set up through the [**AWS Marketplace**](https://docs.aws.amazon.com/pt_br/AWSEC2/latest/WindowsGuide/elastic-ip-addresses-eip.html). However, be aware that this will incur additional costs for the user.

:::

![ssl.png](/img/AWSconfiguration/ssl.png)
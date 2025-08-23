---
sidebar_position: 4
sidebar_label: Database
title: Database
---

### How to Connect Your Database

In this menu, you will be able to connect your existing database to the DevPortal. Currently, the platform supports **PostgreSQL** and **SQLite** databases. Below is a step-by-step guide on how to configure your database.

### Steps

### Step 1: Access Database Settings

1. **Open Admin UI**: Access the Admin UI of your DevPortal.
2. **Navigate to Database Configuration**:
    - Click on **"Go to Settings"** in the menu.
    - Select **"Database"** from the sidebar.

### Step 2: Configure Your Database

- On this page, you can choose and configure either **PostgreSQL** or **SQLite** as your database.

### SQLite

- **Default Option**: SQLite is selected by default, and no further configuration is required.

![better-sqlite.png](/img/AWSconfiguration/better-sqlite.png)

### PostgreSQL

- **PostgreSQL Configuration**: If you choose PostgreSQL, you will need to configure a few settings.

![postgres.png](/img/AWSconfiguration/postgres.png)

Once you have selected **PostgreSQL**, proceed with the following configurations:

| **Field** | **Description** |
| --- | --- |
| **Client** | The client option you're using. |
| **Host** | The host of your database connection. |
| **Database** | The name of your database. |
| **Port** | The port your database is using. |
| **User** | The database user. |
| **Password** | The password for the database user. |

### Step 3: Preview the Configuration

1. After entering the required details, click on **“Preview”** in the left-hand menu to review your configuration.

![5.png](/img/AWSconfiguration/5.png)

### Step 4: Apply and Redeploy

1. On the **Preview** page, check the information.
2. Click on **“Apply and Re-deploy”** to upload the new database settings and redeploy the application.

![6.png](/img/AWSconfiguration/6.png)
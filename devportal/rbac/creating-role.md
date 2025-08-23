---
sidebar_position: 1
sidebar_label: Creating Role
title: Creating Role
---

# How to Create a Role

In a Role-Based Access Control (RBAC) system, a role is a set of permissions that define a user's access level within the system. Instead of assigning permissions directly to individual users, roles are created based on job functions, responsibilities, or titles. Users are then assigned to these roles, inheriting the associated permissions.

### Benefits of RBAC

- **Simplified Permission Management**: Roles allow centralized management of user permissions.
- **Enhanced Security**: Minimizes unauthorized access risks by restricting permissions based on user roles.
- **Efficient User Management**: Assigning roles instead of individual permissions makes managing large teams easier.

### Default Roles in DevPortal

By default, DevPortal provides the `devportal-admin` role for administrators, which grants full access. If you want to use the suggested `devportal-user` role, you can run the provided [SQL script](https://raw.githubusercontent.com/veecode-platform/support/gh-pages/references/devportal/rbac-user-default-role.sql) in your database.

---

## Steps to Create a Role in DevPortal

### Step 1: Access RBAC Administration

1. Log in to your DevPortal account.
2. Click on the **Administration** menu to open the RBAC settings.
![Optional Image Description](/img/rbac/1.png)

### Step 2: Create a New Role

1. Click on the **Create** button.
2. Fill in the **Name** and **Description** fields to identify the role.
3. Click on **Next** to proceed.
![Optional Image Description](/img/rbac/2.png)

### Step 3: Assign Users or Groups

1. Select the groups or users you want to assign to the role.
2. Click on **Next** to continue.
![Optional Image Description](/img/rbac/3.png)

### Step 4: Set Role Permissions

1. Choose the permissions that should be assigned to the role.
2. Click on **Next** to move forward.
![Optional Image Description](/img/rbac/4.png)

### Step 5: (Optional) Define Role Conditions

1. Use conditions to restrict the role to specific resources if needed.
2. Click on **Next** to proceed.
![Optional Image Description](/img/rbac/5.png)

### Step 6: Review and Confirm

1. Review all role settings to ensure accuracy.
2. Click on **Create** to finalize the role creation.
![Optional Image Description](/img/rbac/6.png)

By following these steps, you can efficiently create and manage roles in DevPortal, ensuring secure and structured access control. If you need further assistance, contact the DevPortal support team.
---
sidebar_position: 2
sidebar_label: Permissions
title: RBAC Permissions
---

Role-Based Access Control (RBAC) is a method of managing access to system resources based on user roles. Instead of assigning permissions directly to individual users, roles are created with predefined permissions, and users are assigned to these roles. This approach simplifies permission management and enhances security by reducing the risk of unauthorized access.

Each permission in the RBAC system is structured as follows:

- **Name**: Identifier of the permission.
- **Policy**: The action allowed by the permission (e.g., `read`, `create`, `update`, `delete`).
- **Description**: Explanation of what the permission allows.
- **Requirements**: Dependencies required for the permission to be granted.

---

## **1. RBAC Policies**

| Name | Policy | Description | Requirements |
| --- | --- | --- | --- |
| policy.entity.read | read | Allows the user to read permission policies/roles | X |
| policy.entity.create | create | Allows the user to create permission policies/roles | X |
| policy.entity.update | update | Allows the user to update permission policies/roles | X |
| policy.entity.delete | delete | Allows the user to delete permission policies/roles | X |

---

## **2. Scaffolder Permissions**

| Name | Policy | Description | Requirements |
| --- | --- | --- | --- |
| scaffolder.action.execute | - | Allows execution of an action from a template | scaffolder.template.parameter.read, scaffolder.template.step.read |
| scaffolder.template.parameter.read | read | Allows reading parameters of a template | scaffolder.template.step.read |
| scaffolder.template.step.read | read | Allows reading steps of a template | scaffolder.template.parameter.read |
| scaffolder.task.read | read | Allows reading scaffolder tasks | X |
| scaffolder.task.create | create | Allows creating scaffolder tasks | X |
| scaffolder.task.cancel | use | Allows canceling scaffolder tasks | X |

---

## **3. Catalog Permissions**

| Name | Policy | Description | Requirements |
| --- | --- | --- | --- |
| catalog.entity.read | read | Allows reading from the catalog | X |
| catalog.entity.create | create | Allows creating catalog entities | catalog.location.create |
| catalog.entity.refresh | update | Allows refreshing one or more catalog entities | catalog.entity.read |
| catalog.entity.delete | delete | Allows deleting one or more catalog entities | catalog.entity.read |
| catalog.location.read | read | Allows reading catalog locations | catalog.entity.read |
| catalog.location.create | create | Allows creating catalog locations | catalog.entity.create |
| catalog.location.delete | delete | Allows deleting catalog locations | catalog.entity.delete |

---

## **4. Platform Permissions**

| Name | Policy | Description | Requirements |
| --- | --- | --- | --- |
| admin.access.read | read | Allows reading admin access data | X |
| apiManagement.access.read | read | Allows reading API management data | X |
| cluster.explorer.public.environment.read | read | Allows viewing cluster environment | X |
| cluster.explorer.read | read | Allows viewing cluster details | X |
| github.workflows.create | create | Allows starting a GitHub workflow | X |
| github.workflows.read | read | Allows viewing GitHub workflows | X |
| gitlab.pipelines.create | create | Allows starting a GitLab pipeline | X |
| gitlab.pipelines.read | read | Allows viewing GitLab pipelines | X |
| kong.service.manager.create | create | Allows configuring plugins | X |
| kong.service.manager.delete | delete | Allows removing plugins | X |
| kong.service.manager.read | read | Allows viewing plugins | X |
| kong.service.manager.update | update | Allows updating plugins | X |
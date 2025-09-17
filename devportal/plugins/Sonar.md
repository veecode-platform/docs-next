---
sidebar_position: 18
sidebar_label: SonarQube
title: SonarQube
---

# How to Use the SonarQube Plugin in Backstage

The **SonarQube plugin for Backstage** allows you to view code quality metrics—such as bugs, vulnerabilities, test coverage, and duplications—directly in the component catalog. It connects to your organization's SonarQube instance and displays key insights to support continuous inspection of code health.

---

## What is SonarQube?

**SonarQube** is an open-source platform for static code analysis. It automatically detects code quality issues such as:

- **Bugs:** errors that can lead to failures.
- **Vulnerabilities:** security issues like SQL Injection and XSS.
- **Code Smells:** non-error code that hinders maintainability.
- **Test Coverage:** how much of your code is covered by automated tests.
- **Duplications:** repeated blocks of code.
- **Cyclomatic Complexity:** measures the complexity of functions or methods.
- **Technical Debt:** estimated effort to fix the detected issues.

---

## 🎯 Why Use the Plugin in Backstage?

- **Centralized view** of code quality metrics.
- **CI/CD pipeline integration** for continuous inspection.
- **Early failure detection** during development.
- **Track quality metrics over time.**
- **Easy access for developers to security and maintenance insights** directly in the Backstage UI.

---

## Prerequisites

To use the SonarQube plugin in Backstage, you need:

- ✅ A configured and up-to-date Backstage instance.
- ✅ A SonarQube instance (community, self-hosted, or cloud).
- ✅ A SonarQube workspace with your Organization and configured projects.

---

## Plugin Installation

### Backend

1. **Install the dependency:**

```bash
yarn --cwd packages/backend add @backstage-community/plugin-sonarqube-backend
```

1. Add the plugin in `index.ts`:

```ts
import { createBackend } from '@backstage/backend-defaults';
const backend = createBackend();
// ... other features
backend.add(import('@backstage-community/plugin-sonarqube-backend'));
backend.start();
```

1. Configure the variables in **`app-config.yaml`:**
- For a single instance:

```yaml
sonarqube:
  baseUrl: ${SONARQUBE_BASE_URL}
  instanceKey: ${SONARQUBE_INSTANCE_KEY}
  apiKey: ${SONARQUBE_API_KEY}
```

- For multiple instances:

```yaml
sonarqube:
  instances:
    - name: default
      baseUrl: ${SONARQUBE_BASE_URL}
      instanceKey: ${SONARQUBE_INSTANCE_KEY}
      apiKey: ${SONARQUBE_API_KEY}
    - name: specialProject
      baseUrl: ${SONARQUBE_BASE_UR2L}
      instanceKey: ${SONARQUBE_INSTANCE_KEY2}
      apiKey: ${SONARQUBE_API_KEY2}
```

---

### Frontend

1. Install the dependencies:

```bash
yarn --cwd packages/app add @backstage-community/plugin-sonarqube @backstage-community/plugin-sonarqube-react
```

1. Add the components in **`EntityPage.tsx`:**

```tsx
import { EntitySonarQubeCard } from '@backstage-community/plugin-sonarqube';
import { isSonarQubeAvailable } from '@backstage-community/plugin-sonarqube-react';

const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
    <Grid item md={6}>
      <EntityAboutCard variant="gridItem" />
    </Grid>
    <EntitySwitch>
      <EntitySwitch.Case if={isSonarQubeAvailable}>
        <Grid item md={6}>
          <EntitySonarQubeCard variant="gridItem" />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
  </Grid>
);
```

1. **If using the new frontend:**
- In `App.tsx`, add:

```ts
import sonarQubePlugin from '@backstage-community/plugin-sonarqube/alpha';

export const app = createApp({
  features: [
    // other plugins
    sonarQubePlugin,
  ],
});
```

---

## How to Connect a Project to the Plugin

In your repository, edit the `catalog-info.yaml` file of the corresponding entity and add the annotation with the SonarQube project key:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: nest-api
  title: NestJs API
  description: |
    Demo of vulnerabilities and security in the project.
  annotations:
    github.com/project-slug: veecode-homolog/nest-api
    sonarqube.org/project-key: veecode-homolog_nest-api
spec:
  type: service
  owner: user:default/admin
  lifecycle: production

```

---

## Example: Daily Usage

During the development of a Java API, the team sets up SonarQube in the Jenkins pipeline. With every new push, the code is analyzed:

- If bugs or security issues are found, the build fails.
- The team receives instant feedback and fixes the issues before proceeding to production.
- Backstage displays a panel with the updated quality indicators for the project.
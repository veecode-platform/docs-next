---
sidebar_position: 12
sidebar_label: Backend Plugin
title: "Example: Backend Plugin"
---

If your plugin needs server-side APIs, background tasks, or secure integrations, create a backend plugin as well:

```bash
# From the Backstage app root
yarn new --select backend-plugin --option pluginId=my-back-plugin
```

This creates `plugins/my-back-plugin-backend/` (or a similar path depending on the CLI version).

Register the backend plugin in the backend composition:

1. Open `packages/backend/src/index.ts` (or the backend builder/composition file in newer Backstage versions).
2. Import and register your backend plugin. The scaffold usually prints instructions like:

   ```ts
   import { myBackendPlugin } from '@internal/plugin-my-backend-plugin';

   // Inside the backend creation/composition
   backend.add(myBackendPlugin());
   ```

Restart the backend (if `yarn dev` doesn't auto-reload) and check logs to confirm the plugin initialized.

---
sidebar_position: 10
sidebar_label: Frontend Plugin
title: "Example: Frontend Plugin"
---

A frontend plugin can de bootstrapped with the command below:

```bash
yarn new --select frontend-plugin --option pluginId=my-front-plugin
```

This creates a basic React-based plugin with a page/component and plugin exports.

Wire the plugin route into the app UI so it becomes accessible:

1. Open `packages/app/src/App.tsx`.
2. Import your plugin page/component (exact names depend on the scaffold output):

   ```ts
   import { MyPluginPage } from 'my-plugin';
   ```

3. Add a route under the appropriate `Route` group:

   ```tsx
   <Route path="/my-plugin" element={<MyPluginPage />} />
   ```

4. Optionally add a link (e.g., to the sidebar/nav) so users can discover it.

Restart the dev server if needed and visit `/my-plugin` to see your page.
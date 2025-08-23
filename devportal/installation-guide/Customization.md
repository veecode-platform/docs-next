

In this tutorial, we will show you how to customize your DevPortal theme through two different methods: In one, we will edit the theme.json file and use a configmap to store the settings. In the other option, after customization, we will make the file available at a URL.

In order to edit the logos on your Devportal, the tutorial is the same for both. See here [Editing Logos](#3-editing-logos)
## 1. Customize the DevPortal Theme via ConfigMap:

  **1.1 Edit the colors in the [theme.json](https://veecode-platform.github.io/support/references/devportal/theme.json) file.**
    
  Below, you'll find a table with references to the main graphical elements of the portal:
    
  | background | DevPortal background color |
  | --- | --- |
  | paper | background overlays |
  | status | tags and alerts |
  | primary | primary app color used in components |
  | page theme | top bar gradient theme |
  - You can edit all the colors in [theme.json](https://veecode-platform.github.io/support/references/devportal/theme.json).


![1.jpg](/img/customization/1.jpg)
![2.png](/img/customization/2.png)
      
  
  **1.2  Create a ConfigMap.**

The ConfigMap will contain the settings from the theme.json file and will be used to bring them to the cluster.  
After editing and saving the changes in theme.json, you need to create a ConfigMap object from the file in the cluster where your DevPortal is located. To do this, run the following command:
    
  ```jsx
  kubectl create configmap platform-devportal-theme --from-file=./theme.json -n vkpr
  ```
    
The `kubectl create configmap` command will create a new ConfigMap object named `platform-devportal-theme` in the `vkpr` namespace. The ConfigMap will contain the contents of the theme.json file. The DevPortal will load the ConfigMap's content and use it as the theme.
    
Therefore, to use a custom theme, you need to create a ConfigMap object that contains the theme. The ConfigMap's content should be a JSON file with the necessary configurations.  
    
  **1.3  Update the Helm values.**
    
After creating the ConfigMap object, you need to add your custom theme to the `helm values` using the ConfigMap. To do this, open the `helm values` file and add the following property:
    
```jsx
theme:
  custom:
    configmapName: platform-devportal-theme
    
```
    
The `theme` property specifies the DevPortal theme. The `custom` property specifies that you are using a custom theme. The `configmapName` property specifies the name of the ConfigMap object that contains the custom theme.
    
At this stage, the custom DevPortal theme is created in the DevPortal pod in the cluster.
    
 **1.4 Update your DevPortal** 
    
After updating the `helm values` file, you should update the DevPortal by running the following commands:
    
```jsx
helm repo update
    
helm upgrade platform-devportal --install --values ./values.yaml veecode-platform/devportal
    
```
    
    After the cluster is updated, the customization will be available. Helm will update the DevPortal with the custom theme from the theme.json file.
    
## 2. Upcoming modifications
    
  To make further edits to the theme in the future, you should edit the [theme.json](https://veecode-platform.github.io/support/references/devportal/theme.json) file again and then execute the following command:
    
``` 
kubectl delete configmap platform-devportal-theme && kubectl create configmap platform-devportal-theme --from-file=./theme.json
    
```
    
  This way, you will delete your old ConfigMap and add the new one with the desired edits.
    
  Afterward, it's necessary to restart your cluster.
    
## 3. Editing Logos:

  **3.1 Host the images for download on a server of your choice.** 

  Logo requirements are as follows:

  | Logo | Format | Size |
  | --- | --- | --- |
  | Logo icon | png/jpeg... | 180x180 |
  | Logo full | png/jpeg... | 852x265 |
  | All logos | svg | free |

**3.2 Add the following code to the end of `values.yaml`, replacing the example links with the links to the uploaded images:**

```jsx
theme:
  images:
    sidebarIcon: "<https://platform.vee.codes/apple-touch-icon.png>" #Menu Icon Url
    sidebarFull: "<https://platform.vee.codes/assets/logo/logo.png>" #Menu logo Url

```

**3.3 After updating the `helm values` file, you should update the DevPortal by running the following commands:**

```
helm repo update

helm upgrade platform-devportal --install --values ./values.yaml veecode-platform/devportal

```

After the cluster is updated, the customization will be available. Helm will update the DevPortal with the custom theme from the theme.json file.

## 4. Customizing Your Theme via URL
    
  **4.1 Edit the colors in the [theme.json](https://veecode-platform.github.io/support/references/devportal/theme.json) file.**
    
  **4.2 Host the edited file via URL on a server of your choice where the file can be accessed for download.**
    
  **4.3 In the `values.yaml` file, change the file path to the URL provided by your server:**
    
  ```jsx
    theme:
      custom:
        downloadUrl: <https://domain.com/theme.json>
    
  ```
  **4.4 Run the command** `helm repo update` to update the DevPortal.
    
   **4.5 Run the command** `helm upgrade platform-devportal --install --values ./values.yaml veecode-platform/devportal`.
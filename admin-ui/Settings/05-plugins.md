---
sidebar_position: 5
sidebar_label: Plugins
title: Plugins
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


In this guide, you will learn how to configure the plugins that we provide to enhance your workflow. Our DevPortal comes with embedded plugins for Kubernetes, Vault, Grafana, and Argo CD. Each of these plugins offers unique features that can help you manage, monitor, and deploy your applications more effectively.

In the following sections, we will provide a step-by-step guide on how to configure each plugin for the Veecode Platform.

#### 1. Access your devportal Admin-UI, click on "Go to settings"and select "Plugins" in sidebar menu.
![sidebbarPlugin.png](/img/AWSconfiguration/sidebarPlugin.png)

#### 2. On this page, you can configure all the plugins. Choose which plugin you want to configure, fill in the required information, and then, at the end of the page, press "Save". In the following sections, we will detail all the fields that need to be filled with your information:

<Tabs>
  <TabItem value="Kubernetes" label="Kubernetes" default>
   | Field              | Description                                                                                                                                                                                                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**  | Kubernetes name.|
| **URL**  | Kubernetes url. |
| **Service account token**  | Kubbernetes service account token.  |
| **caData**  | Kubbernetes caData. (Não é obrigatório)  |

  </TabItem>
  <TabItem value="Vault" label="Vault">
  | Field              | Description                                                                                                                                                                                                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Domain**  |The vault domain.  |
| **Token**  | The token you use to authenticate.  |
| **Secret engine**  | The secret engine name. |

  </TabItem>
  <TabItem value="Grafana" label="Grafana">
   | Field              | Description                                                                                                                                                                                                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Domain**  | Your Grafana domain.|
| **Token**  | The token you use to authenticate. |

</TabItem>
  <TabItem value="Argo CD" label="Argo CD">
| Field              | Description                                                                                                                                                                                                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Domain**  | Your domain.|
| **Username**  | Your username.|
| **Token**  | Your arcoCd token. |


  </TabItem>
  <TabItem value="Kong" label="Kong">
| Field              | Description                                                                                                                                                                                                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**  | Your kong instance name.|
| **Url**  | Your kong instance url.|

  </TabItem>
    <TabItem value="Infracost" label="Infracost">
| Field              | Description                                                                                                                                                                                                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frequency**  | Time in minutes to refresh the catalo.|
| **Timeout**  | Time in minutes to timeout after the refresh request.|
| **Initial delay**  | Time in minutes to wait before the first refresh request.|

  </TabItem>
</Tabs>

#### 3.After filling out the necessary information, click on “Preview” in the left-hand side menu.
![5.png](/img/AWSconfiguration/5.png)

#### 4. On the preview page, you can view all the set information and redeploy the application to upload the new settings. To do this, simply click on "Apply and Re-deploy".
![6.png](/img/AWSconfiguration/6.png)
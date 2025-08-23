---
sidebar_position: 5
sidebar_label: Environment Cluster Journey by Veecode Platform
title: Environment Cluster Journey by Veecode Platform
---


Welcome to our Environment Cluster journey. In this brief guide, we will explain the purpose of our approach and provide a step-by-step guide for its use.

# Environment Cluster Journey by Veecode Platform


Our environment cluster journey is designed to make the development process more dynamic and independent. Once the DevOps team has set up the environments and the types of clusters available, Developers will be able to deploy their applications swiftly and accurately. This greatly contributes to best development practices and, consequently, to the creation of a more suitable environment.

But how is this possible?

The Environment Cluster journey functions as follows:
<!-- O Environment nao é criado com um template nosso. Ele é manualmente inserido no catalogo atualmente. Cluster sera criado com as info previamente inseridas no environment selecionado, porem, as informacoes especificas do cluster podem  ser inseridas no proprio template (name, tamanho de maquina, regiao, repositorio...) -->
 1. **Environment Creation:** The DevOps team establishes an “environment”, a space where specific environmental information is stored. This information contains network configurations, environmental variables, service access credentials, and more.

 2. **Cluster Configuration:** Within each environment, “clusters” are formed. A cluster is a collection of servers that collaborate to provide high availability and load balancing for your applications. A cluster will be created with the information previously entered in the selected environment. However, specific cluster information can be entered in the template itself (name, machine size, region, repository…).

3. **Application Deployment:** With the environments and clusters set up, developers can then proceed to deploy their applications.

This approach enables a more dynamic and independent development process. Developers are granted greater freedom and flexibility in deploying their applications, while the DevOps team can ensure that the infrastructure is correctly configured and optimized. This greatly contributes to best development practices and the creation of a more suitable environment for your company.

#### To summarize: Environments are utilized by clusters, and these clusters function as the infrastructure for the deployment of the final projects.

Bellow step-by-step guide : 
## Using Cluster templates 
1. **Prepare your environment:** Before you start, make sure you have an environment set up.
2. **Access Veecode Platform:** Log in to the Veecode Platform and select “Create” from the sidebar menu.
3. **Choose to Provision EC2 Cluster:** From the options available, select “Provision EC2 Cluster”.
4. **Select Environment:** Choose the desired Environment under “Resource Available”, then press “Next”.
5. **Configure EC2:** Fill in all the fields in the EC2 configuration section, then press “Next”.
6. **Network Configurations:** Enter your Network Configurations, then press “Next”.
7. **Terraform Configuration:** In this step, you need to enter your Terraform Configuration.
8. **Set up Git:** Select your Git provider, specify the owner, and name the repository you’re going to create. Also, set the visibility of the repository. Once done, click on “Review”.
9. **Review and Create:** Review all the information you’ve entered for the cluster creation. Make sure everything is correct, then click on “Create”.

10. **Secrets Configuration:** It’s crucial to define all the necessary secrets for the functioning of the generated project so that the pipeline that will create the cluster can be executed without errors.
Below are the secrets that you need to ensure you have for the project pipeline to function properly:

🔑 **AWS_ACCESS_KEY mandatory**
🔑 **AWS_SECRET_KEY mandatory**
🔑 **AWS_REGION mandatory**
🔑 INFRACOST_API_KEY optional

:::warning

  Remember, each variable plays a significant role in the project’s functionality, so make sure they are correctly set.

:::

11.    **Initiate the Pipeline:** Now, you should initiate the pipeline. This can be done through the Veecode Platform interface. In the sidebar, navigate to the “Resources” area and select “Clusters”. Then, choose the cluster with the name you provided. Click on the “About” menu and, at the bottom of the screen, click on “Deploy”. The pipeline will begin to build your cluster.

If everything goes as expected, the pipeline will build your cluster and it will be visible for use in your projects.
    
Remember, each step is crucial for the successful creation of a cluster. If you encounter any issues, refer to the platform’s documentation or reach out to their support team. 

    
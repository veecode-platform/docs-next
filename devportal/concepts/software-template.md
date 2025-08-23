---
sidebar_position: 3
sidebar_label: Software Templates 
title: Software Templates
---

## How to Create Components Using Templates in the Developer Portal

This guide provides detailed steps for leveraging the **template creation feature** in the Developer Portal, enabling you to develop components or projects with a predefined structure efficiently.

---

### Overview of the Template Creation Tool

The **template creation feature** helps developers quickly create projects or components by providing a standardized, pre-configured base. This approach reduces the time spent on setup, allowing developers to focus on specific tasks.

Templates include options for linking repositories, integrating databases, and configuring CI/CD pipelines, promoting a seamless workflow from creation to deployment.

---

## Step-by-Step Guide

### **Accessing the Tool**

1. Log in to the **Developer Portal**.
2. From the homepage, click the **"Create"** tab in the sidebar menu.
3. Explore the list of project templates to find the one that best fits your needs.

---

### **Registering an Existing Component (Optional)**

If you have a pre-existing component to add:

1. Click **"Register an Existing Component"**.
2. Provide the **URL** of your repository, e.g., GitHub.
3. Link to an entity file such as `catalog-info.yaml`. The wizard will:
    - Analyze the file for entities.
    - Add valid entities to the DevPortal catalog.
    - Suggest a Pull Request for repositories missing the required configuration.

---

### **Choosing a Template**

1. Open the **Templates Page**.
2. Use filters (favorites, tags, names) to search templates.
3. Select a template to view its:
    - Description.
    - Source code repository link.
    - Documentation.
4. Click **"Choose"** to begin configuration.

---

### **Configuring the Template**

1. **Project Information:**
    - Input basic details such as name, description, Java version, and application port.
2. **Database Configuration:**
    - Select a database and provide authentication credentials (username/password).
    - You can skip this step if the database is unnecessary.
3. **CI/CD Pipeline Setup:**
    - Select a provider (e.g., GitHub), specify the repository owner, and enter repository details.
    - Optional: Enable Kubernetes Kong export or add a mock server URL.
4. **OpenAPI File Configuration:**
    - Define the location of OpenAPI files (Spec House) for catalog integration.
5. **Build Destination:**
    - Provide the destination repository details (provider, owner, repository).

---

### **Creating the Component**

1. Review all configurations on the **Overview Page**.
2. Ensure all inputs are accurate, then click **"Create"**.
3. Monitor the **creation log** for real-time updates.

Upon completion:

- Access the generated cataloged component.
- Retrieve the source code for further development.

---

## Troubleshooting

- Restart builds or review logs to resolve issues during the process.

---

## Benefits of Using Templates

- **Efficiency:** Predefined configurations save time.
- **Standardization:** Ensures consistency across projects.
- **Scalability:** Easily replicable infrastructure for new components.
- **Integration:** Simplifies linking to CI/CD and database systems.

You now have a comprehensive understanding of the **template creation feature** in the Developer Portal. By using this tool, you can streamline project setup and focus on development tasks.

If additional help is needed, contact the support team or watch the video.
<center>
<iframe src="https://www.youtube.com/embed/2KX8fFaoIAk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</center>

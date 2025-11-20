# Deploying Fair Data infrastructure with Terraform

This guide outlines the steps to deploy the infrastructure components for the Fair Data finder. The following components will be deployed:

- Front-end and back-end containers are deployed in an ECS (Elastic Container Service) service.
- Back-end connects to a Postgres database in RDS (Relational Database Service).
- Back-end connects to an Opensearch database.

# Prerequisites

Before deploying the infrastructure, ensure you have the following prerequisites:

- An AWS account with appropriate permissions to create resources like VPCs, subnets, EKS clusters, and EC2 instances.
- Terraform installed on your local machine. You can download it from `terraform official website <https://www.terraform.io/downloads.html>`_ and follow the installation instructions.
- AWS CLI configured with appropriate credentials. You can install and configure AWS CLI by following `the official user guidelines <https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html>`_.

# Deployment Steps

Follow these steps to deploy the Amazon EKS cluster:

1. **Clone the Repository:**

    ```bash
    git clone <repository-url>
    ```

2. **Navigate to the Project Directory:**

    ```bash
    cd <repository-directory>
    ```

3. **Initialize Terraform:**

    ```bash
    terraform init
    ```

4. **Deploy the Infrastructure:**

    ```bash
    terraform apply
    ```

# Clean Up

To avoid incurring unnecessary costs, remember to clean up the resources once you're done using the EKS cluster:

1. **Destroy Resources:**

    ```bash
    terraform destroy
    ```

2. **Manual Clean Up:**

   Ensure all resources associated with the EKS cluster are deleted from the AWS Management Console, including EKS cluster, EC2 instances, security groups, etc.

# Secure Fullstack Todo Application using AWS Amplify

## Table of Contents

1. [Introduction](#introduction)
2. [Project Architecture](#project-architecture)
3. [Step 1: Create and Deploy the Starter Application](#step-1-create-and-deploy-the-starter-application)
4. [Step 2: Configure Security Best Practices](#step-2-configure-security-best-practices)
5. [Step 3: Enhance Application Security](#step-3-enhance-application-security)
6. [Step 4: Implement Fine-Grained IAM Permissions](#step-4-implement-fine-grained-iam-permissions)
7. [Step 5: Enable Logging and Monitoring](#step-5-enable-logging-and-monitoring)
8. [Step 6: Implement Encryption Best Practices](#step-6-implement-encryption-best-practices)
9. [Step 7: CI/CD Pipeline with Security Scanning](#step-7-cicd-pipeline-with-security-scanning)
10. [Step 8: Implement Unit Testing with Security Focus](#step-8-implement-unit-testing-with-security-focus)
11. [Conclusion](#conclusion)
12. [Resources](#resources)

---

## **Introduction**

In this project, we will build, secure, and deploy a fullstack **Todo application** using **AWS Amplify**. The project showcases critical cloud security principles such as **authentication**, **authorization**, **least privilege IAM roles**, **encryption**, **monitoring**, and **CI/CD with security scanning**. By following industry standards, we’ll ensure the application is secure, scalable, and optimized for production environments. This project demonstrates key cloud security principles and practices essential for building secure cloud-native applications on AWS.

---

## **Project Architecture**

- **Frontend**: React (with Vite)
- **Backend**: AWS Amplify (API, Database, Authentication)
- **Security**: AWS IAM, AWS KMS, AWS CloudWatch, AWS CloudTrail
- **Deployment**: AWS CodePipeline, AWS CodeBuild (with security scanning)
- **Monitoring**: AWS CloudWatch, AWS CloudTrail
- **Testing**: Jest (with security tests)

<img width="1254" alt="amplify-app-diagram" src="https://github.com/user-attachments/assets/c3b78d03-bf9f-4473-a9d2-1325f09dfc69">

*Architecture Diagram*

---

## **Step 1: Create and Deploy the Starter Application**

**Step 1.1: Create the GitHub Repository**

- Fork the official [AWS Amplify Vite-React starter template](https://github.com/aws-samples/amplify-vite-react-template) to your GitHub account.
- Open [AWS Amplify Documentation](https://docs.amplify.aws/react/start/quickstart/).
  
**Step 1.2: Deploy the App Using AWS Amplify**

- Navigate to the **AWS Amplify Console**.
- Select **GitHub** as the repository source.
- Choose your repository and branch.
- Deploy the application. AWS Amplify will provision backend infrastructure (API, database, and authentication).

**Step 1.3: Verify Deployment**

- Visit the deployed app’s URL, add a todo item, and verify it appears in the Amplify Console under the **Data** section.

---

## **Step 2: Configure Security Best Practices**

### **Step 2.1: Set Up Local Development Environment**

- Clone your repository and install dependencies:
  ```bash
  git clone https://github.com/<github-username>/amplify-vite-react-template.git
  cd amplify-vite-react-template && npm install
  ```

- Download the `amplify_outputs.json` file from the Amplify Console and add it to your project root. This file includes backend resource details.

### **Step 2.2: Implement Authentication and Authorization**

- Use AWS Amplify’s `Authenticator` component to enforce user login. Wrap the `<App />` component with `Authenticator` in `src/main.tsx`:
  ```jsx
  import { Amplify, Authenticator } from '@aws-amplify/ui-react';
  import awsExports from '../amplify_outputs.json';
  Amplify.configure(awsExports);

  function App() {
    return (
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <h1>Todo App</h1>
            <button onClick={signOut}>Sign Out</button>
          </main>
        )}
      </Authenticator>
    );
  }

  export default App;
  ```

### **Step 2.3: Enable Multi-Factor Authentication (MFA)**

- In the **AWS Cognito** settings (via Amplify Console), enable **MFA** for added security:
  - Navigate to **User Pool** > **MFA and verifications**.
  - Enable either **SMS-based MFA** or **TOTP-based MFA**.

---

## **Step 3: Enhance Application Security**

### **Step 3.1: Per-User Authorization with Data Isolation**

- Update the Amplify schema to allow only the user who created a todo to view and edit it (owner-based authorization):
  ```graphql
  type Todo @model @auth(rules: [{ allow: owner }]) {
    id: ID!
    content: String!
    createdAt: AWSDateTime
    updatedAt: AWSDateTime
  }
  ```

- Push changes to AWS:
  ```bash
  amplify push
  ```

---

## **Step 4: Implement Fine-Grained IAM Permissions**

### **Step 4.1: Create Least Privilege IAM Roles**

- Restrict IAM roles to follow the **least privilege** principle. This is crucial for cloud security. Example roles:
  - **Amplify Admin** role: Restrict administrative access to necessary services only:
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "amplify:*",
            "dynamodb:*",
            "cognito-idp:*",
            "s3:*"
          ],
          "Resource": [
            "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/TodoTable",
            "arn:aws:cognito-idp:REGION:ACCOUNT_ID:userpool/USER_POOL_ID",
            "arn:aws:s3:::AMPLIFY_APP_BUCKET"
          ]
        }
      ]
    }
    ```

  - Ensure that IAM policies are resource-specific, avoiding over-permissive policies like `"Resource": "*"`.

### **Step 4.2: Apply Principle of Least Privilege**

- Use **IAM Access Analyzer** to review permissions and detect overly permissive policies.

---

## **Step 5: Enable Logging and Monitoring**

### **Step 5.1: Set Up AWS CloudTrail**

- Enable **CloudTrail** to log all API actions, particularly for authentication and DynamoDB interactions. This allows tracking changes and potential unauthorized access:
  - Go to **CloudTrail** in the AWS Console, create a trail, and ensure it logs all events for **Cognito**, **DynamoDB**, **IAM**, and **Lambda**.

### **Step 5.2: Enable AWS CloudWatch Logs**

- Configure **CloudWatch Logs** for all backend resources to track performance and security events:
  - Navigate to **CloudWatch**, create log groups for **Lambda**, **Cognito**, and **API Gateway**.
  - Configure log retention policies based on security and auditing requirements (e.g., retain logs for 90 days).

---

## **Step 6: Implement Encryption Best Practices**

### **Step 6.1: Encrypt Data at Rest with AWS KMS**

- DynamoDB offers encryption at rest by default. Use **AWS KMS** to manage encryption keys:
  - Create a **KMS CMK** (Customer Master Key) in the AWS Console.
  - In the Amplify Console, go to **Backend environments**, select **DynamoDB**, and configure the **KMS key** for encryption.

### **Step 6.2: Encrypt Data in Transit with HTTPS**

- Ensure all data between the client and backend uses **HTTPS**. Amplify provides **SSL certificates** by default for custom domains.

---

## **Step 7: CI/CD Pipeline with Security Scanning**

### **Step 7.1: Implement CI/CD Pipeline with AWS CodePipeline**

- Set up a **CI/CD pipeline** using **AWS CodePipeline**. Ensure the pipeline triggers on each commit:
  - Use **AWS CodeBuild** for the build stage, including **linting**, **unit tests**, and **security scans**.

### **Step 7.2: Integrate Security Scanning in CI/CD**

- Add **security scans** using **Snyk** or **CodeGuru**:
  - Snyk can scan for vulnerabilities in dependencies:
    ```bash
    snyk test
    ```

  - AWS **CodeGuru Reviewer** can be configured to check for security issues in the codebase.

---

## **Step 8: Implement Unit Testing with Security Focus**

### **Step 8.1: Security Tests for Authorization**

- Create unit tests that check if **per-user authorization** rules are enforced correctly:
  ```javascript
  test('Only owner can view todo items', async () => {
    const user = await Auth.signIn('testuser', 'password');
    const todo = await DataStore.save(new Todo({
      content: "User-specific task",
      owner: user.username
    }));

    const todos = await DataStore.query(Todo, todo.id);
    expect(todos[0].owner).toBe(user.username);
  });
  ```

### **Step 8.2: Run Unit Tests**

- Run tests before each deployment:
  ```bash
  npm test


  ```

---

## **Conclusion**

This project demonstrates the full stack development of a secure Todo application using AWS Amplify. Beyond basic functionality, it showcases how cloud security principles can be applied to protect user data and application infrastructure. From implementing authentication and authorization to enforcing least privilege access with AWS IAM, the project highlights best practices that align with industry standards for cloud security.

---

## **Resources**

- [AWS Amplify Documentation](https://docs.amplify.aws/react/start/quickstart/)
- [AWS Identity and Access Management (IAM)](https://docs.aws.amazon.com/iam/)
- [AWS KMS Key Management](https://docs.aws.amazon.com/kms/)
- [AWS CloudTrail](https://aws.amazon.com/cloudtrail/)
- [AWS CloudWatch](https://aws.amazon.com/cloudwatch/)

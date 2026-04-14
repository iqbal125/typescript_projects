# Frontend Infrastructure

The frontend is deployed through **AWS Amplify** via the AWS Console, not through Infrastructure as Code (IaC).

## Deployment

Amplify is configured directly in the AWS Console and handles:

- Build and deployment pipeline
- Preview environments for pull requests
- Custom domain and SSL certificate management

The Amplify build settings are defined in [amplify.yml](../../amplify.yml) at the repository root.

## Why Not IaC?

Amplify Hosting is managed through the console for simplicity. The console-based setup provides a straightforward Git-based CI/CD pipeline without the overhead of maintaining CDK or CloudFormation stacks for the frontend.
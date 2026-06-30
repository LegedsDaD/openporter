export interface WorkflowConfig {
  framework: string;
  buildCommand: string;
  outputDir: string;
  installCommand: string;
  nodeVersion: string;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  branch: string;
}

export function generateWorkflow(config: WorkflowConfig): string {
  const packageManagerInstall = {
    npm: 'npm ci',
    yarn: 'yarn install --frozen-lockfile',
    pnpm: 'pnpm install --frozen-lockfile',
    bun: 'bun install',
  }[config.packageManager];

  return `name: Deploy to GitHub Pages

on:
  push:
    branches:
      - ${config.branch}
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${config.nodeVersion}
          cache: ${config.packageManager}

      - name: Install dependencies
        run: ${packageManagerInstall}

      - name: Build
        run: ${config.buildCommand}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ${config.outputDir}

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;
}

export function generateWorkflowFilename(): string {
  return 'openporter-deploy.yml';
}
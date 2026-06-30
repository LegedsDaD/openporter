# Quick Start Guide

Get up and running with OpenPorter in 5 minutes!

## Overview

OpenPorter lets you deploy static websites to GitHub Pages using GitHub Actions. This guide will walk you through deploying your first project.

## Prerequisites

- A GitHub account
- A static website project (React, Vue, Astro, etc.)
- Node.js 18+ installed locally

## Step 1: Prepare Your Repository

Ensure your project has:

1. A `package.json` file with build scripts
2. A framework configuration file (e.g., `vite.config.ts`, `astro.config.mjs`)
3. Code committed to a GitHub repository

Example `package.json`:

```json
{
  "name": "my-website",
  "version": "1.0.0",
  "scripts": {
    "build": "vite build",
    "dev": "vite dev"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

## Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose the branch you want to deploy from (usually `main` or `master`)
5. Click **Save**

## Step 3: Use OpenPorter

### Option A: Web Interface (Coming Soon)

1. Visit [openporter.dev](https://openporter.dev)
2. Sign in with your GitHub account
3. Select your repository
4. Click **Deploy**

OpenPorter will:
- Automatically detect your framework
- Generate an optimized GitHub Actions workflow
- Commit the workflow to your repository
- Trigger the first deployment

### Option B: Manual Setup

If you prefer to set things up manually:

#### 1. Create Workflow File

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
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
          node-version: 18.x
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 2. Configure Pages Source

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**

#### 3. Commit and Push

```bash
git add .github/workflows/deploy.yml
git commit -m "Add deployment workflow"
git push origin main
```

## Step 4: Monitor Deployment

1. Go to the **Actions** tab in your repository
2. You'll see the "Deploy to GitHub Pages" workflow running
3. Click on the workflow to see real-time logs
4. Once complete, your site will be live at `https://<username>.github.io/<repository>/`

## Step 5: Verify Deployment

After the workflow completes:

1. Visit your GitHub Pages URL
2. Verify your site is working correctly
3. Check that all assets load properly

## Framework-Specific Guides

### React + Vite

**Detection:** `vite.config.ts`, `package.json` with `react` dependency

**Configuration:**
- Build command: `npm run build`
- Output directory: `dist`
- Node version: `18.x`

### Vue + Vite

**Detection:** `vite.config.ts`, `package.json` with `vue` dependency

**Configuration:**
- Build command: `npm run build`
- Output directory: `dist`
- Node version: `18.x`

### Astro

**Detection:** `astro.config.mjs`

**Configuration:**
- Build command: `npm run build`
- Output directory: `dist`
- Node version: `18.x`

### Next.js (Static Export)

**Detection:** `next.config.js`

**Configuration:**
- Build command: `npm run build`
- Output directory: `out`
- Node version: `18.x`

**Note:** Ensure `output: 'export'` is set in `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

## Common Issues and Solutions

### Issue: 404 Error After Deployment

**Solution:** Ensure your `vite.config.ts` has the correct base path:

```typescript
export default defineConfig({
  base: '/<your-repo-name>/',
  // ... rest of config
});
```

### Issue: Assets Not Loading

**Solution:** Check that all asset paths are relative or use the correct base path.

### Issue: Build Fails

**Solution:** 
1. Check the Actions log for errors
2. Ensure all dependencies are in `package.json`
3. Verify the build command works locally

### Issue: Deployment Stuck

**Solution:**
1. Check GitHub Pages settings
2. Ensure the source is set to "GitHub Actions"
3. Verify the workflow has the correct permissions

## Next Steps

- Customize your [deployment configuration](configuration.md)
- Set up [custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- Learn about [framework detection](framework-detection.md)
- Explore the [workflow generator](workflow-generator.md)

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](troubleshooting.md)
2. Search [existing issues](https://github.com/LegedsDaD/openporter/issues)
3. Create a [new issue](https://github.com/LegedsDaD/openporter/issues/new) with:
   - Your framework and version
   - Build configuration
   - Error logs from GitHub Actions

## What's Next?

- Set up [preview deployments](https://docs.github.com/en/actions/deployment/deploying-with-github-actions/deploying-to-github-pages) for pull requests
- Configure [custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- Add [environment variables](https://docs.github.com/en/actions/deployment/deploying-to-github-pages/about-deployments-to-github-pages#environment-variables)
- Explore [advanced configuration](configuration.md)
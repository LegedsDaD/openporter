# Configuration

This guide covers all configuration options available in OpenPorter, from basic settings to advanced customization.

## Table of Contents

- [Basic Configuration](#basic-configuration)
- [Framework Configuration](#framework-configuration)
- [Build Settings](#build-settings)
- [Deployment Settings](#deployment-settings)
- [Environment Variables](#environment-variables)
- [Custom Domains](#custom-domains)
- [Advanced Options](#advanced-options)

## Basic Configuration

### Project Configuration File

OpenPorter uses a simple configuration file `.openporter.json` in your repository root:

```json
{
  "framework": "react",
  "buildCommand": "npm run build",
  "outputDir": "dist",
  "installCommand": "npm install",
  "nodeVersion": "18.x",
  "packageManager": "npm",
  "branch": "main"
}
```

**Location:** `.openporter.json` in repository root

**Optional:** If not provided, OpenPorter will auto-detect settings.

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `framework` | string | auto-detected | Framework identifier (e.g., 'react', 'vue', 'astro') |
| `buildCommand` | string | auto-detected | Command to build the project |
| `outputDir` | string | auto-detected | Directory containing build output |
| `installCommand` | string | auto-detected | Command to install dependencies |
| `nodeVersion` | string | '18.x' | Node.js version to use |
| `packageManager` | string | 'npm' | Package manager (npm, yarn, pnpm, bun) |
| `branch` | string | 'main' | Branch to deploy from |

## Framework Configuration

### React + Vite

**Configuration:**
```json
{
  "framework": "react",
  "buildCommand": "npm run build",
  "outputDir": "dist",
  "installCommand": "npm install",
  "nodeVersion": "18.x",
  "packageManager": "npm"
}
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/<your-repo-name>/',  // Required for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
```

### Vue + Vite

**Configuration:**
```json
{
  "framework": "vue",
  "buildCommand": "npm run build",
  "outputDir": "dist",
  "installCommand": "npm install",
  "nodeVersion": "18.x",
  "packageManager": "npm"
}
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/<your-repo-name>/',
  build: {
    outDir: 'dist',
  },
});
```

### Svelte + Vite

**Configuration:**
```json
{
  "framework": "svelte",
  "buildCommand": "npm run build",
  "outputDir": "build",
  "installCommand": "npm install",
  "nodeVersion": "18.x",
  "packageManager": "npm"
}
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  base: '/<your-repo-name>/',
  build: {
    outDir: 'build',
  },
});
```

### Astro

**Configuration:**
```json
{
  "framework": "astro",
  "buildCommand": "npm run build",
  "outputDir": "dist",
  "installCommand": "npm install",
  "nodeVersion": "18.x",
  "packageManager": "npm"
}
```

**astro.config.mjs:**
```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://<username>.github.io',
  base: '/<your-repo-name>/',
  output: 'static',
  build: {
    format: 'directory',
  },
});
```

### Next.js (Static Export)

**Configuration:**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDir": "out",
  "installCommand": "npm install",
  "nodeVersion": "18.x",
  "packageManager": "npm"
}
```

**next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/<your-repo-name>',
  assetPrefix: '/<your-repo-name>/',
};

module.exports = nextConfig;
```

### Nuxt (Static Generation)

**Configuration:**
```json
{
  "framework": "nuxt",
  "buildCommand": "npm run generate",
  "outputDir": "dist",
  "installCommand": "npm install",
  "nodeVersion": "18.x",
  "packageManager": "npm"
}
```

**nuxt.config.ts:**
```typescript
export default defineNuxtConfig({
  nitro: {
    output: {
      dir: 'dist',
    },
  },
  app: {
    baseURL: '/<your-repo-name>/',
  },
});
```

### Angular

**Configuration:**
```json
{
  "framework": "angular",
  "buildCommand": "ng build",
  "outputDir": "dist/<project-name>",
  "installCommand": "npm install",
  "nodeVersion": "18.x",
  "packageManager": "npm"
}
```

**angular.json:**
```json
{
  "projects": {
    "your-project": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/your-project",
            "baseHref": "/<your-repo-name>/"
          }
        }
      }
    }
  }
}
```

### Hugo

**Configuration:**
```json
{
  "framework": "hugo",
  "buildCommand": "hugo --minify",
  "outputDir": "public",
  "installCommand": "npm install",
  "nodeVersion": "18.x",
  "packageManager": "npm"
}
```

**hugo.toml:**
```toml
baseURL = 'https://<username>.github.io/<repo>/'
languageCode = 'en-us'
title = 'My Site'

[params]
  # Your parameters
```

### Jekyll

**Configuration:**
```json
{
  "framework": "jekyll",
  "buildCommand": "jekyll build",
  "outputDir": "_site",
  "installCommand": "bundle install",
  "nodeVersion": "18.x",
  "packageManager": "npm"
}
```

**_config.yml:**
```yaml
baseurl: "/<your-repo-name>"
url: "https://<username>.github.io"

# Your Jekyll configuration
```

### Docusaurus

**Configuration:**
```json
{
  "framework": "docusaurus",
  "buildCommand": "npm run build",
  "outputDir": "build",
  "installCommand": "npm install",
  "nodeVersion": "18.x",
  "packageManager": "npm"
}
```

**docusaurus.config.js:**
```javascript
module.exports = {
  url: 'https://<username>.github.io',
  baseUrl: '/<your-repo-name>/',
  projectName: '<your-repo-name>',
  organizationName: '<username>',
};
```

## Build Settings

### Build Command

The command to build your project:

```json
{
  "buildCommand": "npm run build"
}
```

**Common build commands:**
- React/Vue/Svelte: `npm run build`
- Next.js: `npm run build`
- Nuxt: `npm run generate`
- Angular: `ng build`
- Hugo: `hugo --minify`
- Jekyll: `jekyll build`
- Docusaurus: `npm run build`

### Output Directory

The directory containing built files:

```json
{
  "outputDir": "dist"
}
```

**Common output directories:**
- Vite-based: `dist`
- Svelte: `build`
- Next.js: `out`
- Hugo: `public`
- Jekyll: `_site`
- Docusaurus: `build`

### Install Command

The command to install dependencies:

```json
{
  "installCommand": "npm install"
}
```

**Common install commands:**
- npm: `npm install` or `npm ci`
- yarn: `yarn install --frozen-lockfile`
- pnpm: `pnpm install --frozen-lockfile`
- bun: `bun install`
- Jekyll: `bundle install`

### Node Version

The Node.js version to use:

```json
{
  "nodeVersion": "18.x"
}
```

**Supported versions:**
- `16.x` - Node.js 16 (legacy)
- `18.x` - Node.js 18 (recommended)
- `20.x` - Node.js 20 (latest)

### Package Manager

The package manager to use:

```json
{
  "packageManager": "npm"
}
```

**Supported package managers:**
- `npm` - npm (default)
- `yarn` - Yarn
- `pnpm` - pnpm
- `bun` - Bun

## Deployment Settings

### Branch

The branch to deploy from:

```json
{
  "branch": "main"
}
```

**Common branches:**
- `main` - Main branch (default)
- `master` - Master branch
- `production` - Production branch
- `gh-pages` - GitHub Pages branch

### Deployment Triggers

Configure when deployments trigger:

```yaml
# In .github/workflows/openporter-deploy.yml
on:
  push:
    branches:
      - main
    paths:
      - 'src/**'
      - 'package.json'
  pull_request:
    branches:
      - main
  workflow_dispatch:
```

**Trigger options:**
- `push` - Deploy on push to branch
- `pull_request` - Deploy on PR (for previews)
- `workflow_dispatch` - Manual trigger from GitHub UI
- `schedule` - Scheduled deployments (cron)

### Concurrency Control

Prevent multiple simultaneous deployments:

```yaml
concurrency:
  group: "pages"
  cancel-in-progress: false
```

**Options:**
- `cancel-in-progress: true` - Cancel old deployments when new one starts
- `cancel-in-progress: false` - Wait for current deployment to finish

## Environment Variables

### Setting Environment Variables

Add to your workflow:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      NODE_ENV: production
      API_URL: ${{ secrets.API_URL }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: npm
      - run: npm ci
      - run: npm run build
```

### Using GitHub Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add secret name and value

**Use in workflow:**
```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Using Environment Variables

Create environment-specific variables:

1. Go to **Settings** → **Environments**
2. Create environment (e.g., `production`)
3. Add environment secrets and variables

**Use in workflow:**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: npm
      - run: npm ci
      - run: npm run build
```

## Custom Domains

### Configure Custom Domain

**Option 1: Via GitHub UI**
1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain
3. Click **Save**

**Option 2: Via CNAME file**

Create `public/CNAME` file:
```
yourdomain.com
```

### DNS Configuration

**For subdomain (www):**
```
Type: CNAME
Name: www
Value: <username>.github.io
```

**For apex domain:**
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

### HTTPS

Enable HTTPS in GitHub Pages settings:
1. Go to **Settings** → **Pages**
2. Check **Enforce HTTPS**
3. Wait for certificate (5-10 minutes)

## Advanced Options

### Custom Workflow Steps

Add custom steps to the generated workflow:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: npm
      
      # Custom step: Install additional dependencies
      - name: Install additional tools
        run: |
          npm install -g @vue/cli
      
      - run: npm ci
      
      # Custom step: Lint
      - name: Lint
        run: npm run lint
      
      # Custom step: Test
      - name: Test
        run: npm test
      
      - run: npm run build
      
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
```

### Multiple Build Outputs

Upload multiple directories:

```yaml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: |
      ./dist
      ./public
      ./assets
```

### Build Arguments

Pass arguments to build command:

```yaml
- name: Build
  run: npm run build -- --mode production --base /
  env:
    VITE_API_URL: ${{ secrets.API_URL }}
```

### Caching Strategies

#### Dependency Caching (Default)

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 18.x
    cache: npm  # Enables caching
```

#### Custom Cache

```yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      node_modules
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-
```

### Matrix Builds

Test multiple configurations:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
        package-manager: [npm, pnpm]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: ${{ matrix.package-manager }}
      - run: ${{ matrix.package-manager }} install
      - run: ${{ matrix.package-manager }} run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
```

### Conditional Builds

Build only when specific files change:

```yaml
on:
  push:
    branches:
      - main
    paths:
      - 'src/**'
      - 'package.json'
      - 'vite.config.*'
      - '!('*.md')'
```

### Resource Limits

Configure resource limits:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 10  # Maximum 10 minutes
    steps:
      # ... steps
```

## Workflow Customization

### Custom Workflow File

Override the default workflow by creating your own:

**File:** `.github/workflows/deploy.yml`

```yaml
name: Custom Deploy

on:
  push:
    branches:
      - main

jobs:
  # Your custom workflow
```

### Workflow Templates

Use different templates for different scenarios:

**Production:** `.github/workflows/deploy.yml`
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
```

**Preview:** `.github/workflows/deploy-preview.yml`
```yaml
name: Deploy Preview
on:
  pull_request:
    branches: [main]
```

**Staging:** `.github/workflows/deploy-staging.yml`
```yaml
name: Deploy to Staging
on:
  push:
    branches: [staging]
```

## Configuration Validation

### Validate Configuration

Test your configuration locally:

```bash
# Install OpenPorter CLI (coming soon)
npx openporter validate

# Output:
# ✓ Configuration valid
# ✓ Framework detected: react
# ✓ Build command: npm run build
# ✓ Output directory: dist
```

### Dry Run

Preview generated workflow without committing:

```bash
npx openporter generate --dry-run

# Output: Generated workflow YAML
```

## Migration Guide

### From Manual Configuration

If you have an existing workflow:

1. Export current configuration
2. Create `.openporter.json`
3. Map settings to OpenPorter format
4. Test with OpenPorter workflow
5. Remove old workflow

### From Other Platforms

#### From Vercel

1. Export settings from Vercel
2. Map to OpenPorter configuration:
   - Build command → `buildCommand`
   - Output directory → `outputDir`
   - Node version → `nodeVersion`
3. Update `base` path in framework config
4. Test deployment

#### From Netlify

1. Export build settings
2. Map to OpenPorter configuration
3. Update base path
4. Test deployment

## Best Practices

### 1. Use Auto-Detection

Let OpenPorter detect settings when possible:

```json
{
  "branch": "main"
}
```

Only specify settings that need customization.

### 2. Version Control

Commit configuration files:

```bash
git add .openporter.json
git commit -m "Add OpenPorter configuration"
```

### 3. Document Custom Settings

Add comments to explain custom configurations:

```json
{
  "framework": "nextjs",
  "outputDir": "out",
  "nodeVersion": "20.x",
  "packageManager": "pnpm",
  "notes": "Using pnpm for faster installs, Node 20 for latest features"
}
```

### 4. Test Changes

Test configuration changes in a branch first:

```bash
git checkout -b test-deployment
# Make changes
git push origin test-deployment
# Create PR and verify preview deployment
```

### 5. Keep It Simple

Start with minimal configuration and add complexity only when needed:

```json
{
  "framework": "react"
}
```

## Troubleshooting Configuration

### Auto-Detection Fails

**Solution:** Manually specify framework:

```json
{
  "framework": "react",
  "buildCommand": "npm run build",
  "outputDir": "dist"
}
```

### Wrong Settings Detected

**Solution:** Override specific settings:

```json
{
  "framework": "astro",
  "outputDir": "dist",  // Override if auto-detected wrong
  "nodeVersion": "20.x"  // Override if needed
}
```

### Build Fails

**Check:**
1. Build command works locally
2. Output directory is correct
3. All dependencies installed
4. No environment-specific code

## Configuration Reference

### Complete Configuration Example

```json
{
  "framework": "react",
  "buildCommand": "npm run build",
  "outputDir": "dist",
  "installCommand": "npm install",
  "nodeVersion": "18.x",
  "packageManager": "npm",
  "branch": "main",
  "env": {
    "NODE_ENV": "production",
    "API_URL": "https://api.example.com"
  },
  "cache": {
    "enabled": true,
    "paths": ["node_modules"]
  },
  "build": {
    "args": ["--mode", "production"],
    "env": {
      "VITE_API_URL": "https://api.example.com"
    }
  },
  "deploy": {
    "concurrency": {
      "group": "pages",
      "cancelInProgress": false
    }
  }
}
```

### Environment-Specific Configuration

**Production (.openporter.json):**
```json
{
  "framework": "react",
  "buildCommand": "npm run build",
  "outputDir": "dist",
  "nodeVersion": "18.x"
}
```

**Staging (.openporter.staging.json):**
```json
{
  "framework": "react",
  "buildCommand": "npm run build:staging",
  "outputDir": "dist",
  "nodeVersion": "18.x"
}
```

## Resources

- [Framework Detection](framework-detection.md)
- [Workflow Generator](workflow-generator.md)
- [Deployment Guide](deployment.md)
- [Troubleshooting](troubleshooting.md)
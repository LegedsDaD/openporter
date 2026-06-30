# Workflow Generator

OpenPorter automatically generates optimized GitHub Actions workflows for deploying static websites to GitHub Pages. This document explains how the workflow generator works and how to customize generated workflows.

## Overview

The workflow generator creates production-ready GitHub Actions workflow files that:

- ✅ Use the latest GitHub Actions (v4)
- ✅ Optimize build times with caching
- ✅ Support multiple package managers (npm, yarn, pnpm, bun)
- ✅ Configure proper permissions for GitHub Pages
- ✅ Handle concurrent deployments
- ✅ Upload build artifacts correctly
- ✅ Deploy to GitHub Pages using the official action

## Generated Workflow Structure

### Basic Workflow

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

## Workflow Components

### Triggers

The workflow triggers on:

1. **Push to main branch** - Automatic deployment on every push
2. **Manual dispatch** - Allows manual triggering from GitHub UI

```yaml
on:
  push:
    branches:
      - main  # Change this to your default branch
  workflow_dispatch:
```

### Permissions

Required permissions for GitHub Pages deployment:

```yaml
permissions:
  contents: read    # Read repository contents
  pages: write      # Write to GitHub Pages
  id-token: write   # Generate OIDC token
```

### Concurrency Control

Prevents multiple deployments from running simultaneously:

```yaml
concurrency:
  group: "pages"           # Unique identifier for this workflow
  cancel-in-progress: false # Don't cancel running deployments
```

### Build Job

The build job runs on `ubuntu-latest` and performs:

1. **Checkout** - Clones the repository
2. **Setup Node.js** - Installs the correct Node.js version with caching
3. **Install Dependencies** - Installs project dependencies
4. **Build** - Runs the build command
5. **Upload Artifact** - Uploads the build output for deployment

#### Node.js Setup

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 18.x  # Configurable
    cache: npm          # Configurable: npm, yarn, pnpm, bun
```

**Caching Benefits:**
- Faster dependency installation
- Reduced network usage
- Typically 2-3x faster builds

### Deploy Job

The deploy job:

1. **Waits for build** - Depends on successful build job
2. **Deploys to Pages** - Uses official GitHub Pages deployment action
3. **Provides URL** - Outputs the deployed URL

```yaml
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

## Package Manager Support

### npm

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 18.x
    cache: npm

- name: Install dependencies
  run: npm ci  # Clean install based on package-lock.json
```

### yarn

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 18.x
    cache: yarn

- name: Install dependencies
  run: yarn install --frozen-lockfile
```

### pnpm

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 18.x
    cache: pnpm

- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

### bun

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 18.x
    cache: bun

- name: Install dependencies
  run: bun install
```

## Framework-Specific Configurations

### React + Vite

```yaml
- name: Build
  run: npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
```

**Configuration:**
- Build command: `npm run build`
- Output directory: `dist`
- Node version: `18.x`

### Next.js (Static Export)

```yaml
- name: Build
  run: npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./out
```

**Configuration:**
- Build command: `npm run build`
- Output directory: `out`
- Node version: `18.x`
- **Requires:** `output: 'export'` in next.config.js

### Astro

```yaml
- name: Build
  run: npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
```

**Configuration:**
- Build command: `npm run build`
- Output directory: `dist`
- Node version: `18.x`

### Vue + Vite

```yaml
- name: Build
  run: npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
```

**Configuration:**
- Build command: `npm run build`
- Output directory: `dist`
- Node version: `18.x`

### Svelte + Vite

```yaml
- name: Build
  run: npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./build
```

**Configuration:**
- Build command: `npm run build`
- Output directory: `build`
- Node version: `18.x`

### Hugo

```yaml
- name: Build
  run: hugo --minify

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./public
```

**Configuration:**
- Build command: `hugo --minify`
- Output directory: `public`
- Node version: `18.x` (for Hugo Extended)

## Using the Workflow Generator

### In Node.js

```typescript
import { generateWorkflow, generateWorkflowFilename } from '@openporter/workflow-generator';

// Generate workflow for a React + Vite project
const workflow = generateWorkflow({
  framework: 'react',
  buildCommand: 'npm run build',
  outputDir: 'dist',
  installCommand: 'npm install',
  nodeVersion: '18.x',
  packageManager: 'npm',
  branch: 'main',
});

console.log(workflow);
// Output: Complete YAML workflow

const filename = generateWorkflowFilename();
// Output: 'openporter-deploy.yml'
```

### In React Components

```typescript
import { useMutation } from '@tanstack/react-query';
import { generateWorkflow } from '@openporter/workflow-generator';
import { githubClient } from '@/lib/github';

function DeployButton({ owner, repo, config }: DeployProps) {
  const deployMutation = useMutation({
    mutationFn: async () => {
      // Generate workflow
      const workflow = generateWorkflow({
        framework: config.framework,
        buildCommand: config.buildCommand,
        outputDir: config.outputDir,
        installCommand: config.installCommand,
        nodeVersion: config.nodeVersion,
        packageManager: config.packageManager,
        branch: config.branch,
      });

      // Commit workflow to repository
      return githubClient.createOrUpdateFile(
        owner,
        repo,
        '.github/workflows/openporter-deploy.yml',
        workflow,
        'Add OpenPorter deployment workflow'
      );
    },
    onSuccess: () => {
      toast.success('Workflow created! Deployment starting...');
    },
    onError: (error) => {
      toast.error('Failed to create workflow');
      console.error(error);
    },
  });

  return (
    <Button 
      onClick={() => deployMutation.mutate()}
      disabled={deployMutation.isPending}
    >
      {deployMutation.isPending ? 'Deploying...' : 'Deploy'}
    </Button>
  );
}
```

## Customizing Workflows

### Environment Variables

Add environment variables to the build job:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      NODE_ENV: production
      API_URL: ${{ secrets.API_URL }}
    steps:
      # ... steps
```

### Custom Build Steps

Add additional steps before or after build:

```yaml
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

      # Custom step: Lint code
      - name: Lint
        run: npm run lint

      - name: Install dependencies
        run: npm ci

      # Custom step: Run tests
      - name: Test
        run: npm test

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
```

### Multiple Output Directories

For projects with multiple build outputs:

```yaml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: |
      ./dist
      ./public
```

### Custom Domain

Configure custom domain in GitHub Pages settings (not in workflow):

1. Go to repository **Settings** → **Pages**
2. Under **Custom domain**, enter your domain
3. Enable **Enforce HTTPS**

### Preview Deployments

Create a separate workflow for preview deployments:

```yaml
name: Deploy Preview to GitHub Pages

on:
  pull_request:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages-${{ github.event.pull_request.number }}"
  cancel-in-progress: true

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

## Workflow Best Practices

### 1. Use Specific Action Versions

Always use specific versions or SHA hashes:

```yaml
# Good
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- uses: actions/upload-pages-artifact@v3
- uses: actions/deploy-pages@v4

# Avoid
- uses: actions/checkout@main
```

### 2. Enable Caching

Always enable dependency caching:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 18.x
    cache: npm  # Enable caching
```

### 3. Use `npm ci` for CI

Use `npm ci` instead of `npm install` in CI:

```yaml
# Good - Clean, reproducible installs
- run: npm ci

# Avoid - May install different versions
- run: npm install
```

### 4. Set Concurrency

Prevent race conditions:

```yaml
concurrency:
  group: "pages"
  cancel-in-progress: false  # Don't cancel, wait for completion
```

### 5. Use Environment Protection Rules

Configure environment rules in GitHub:

1. Go to **Settings** → **Environments**
2. Create `github-pages` environment
3. Add protection rules (e.g., required reviewers)
4. Add secrets (e.g., `API_URL`)

## Troubleshooting

### Build Fails

**Check:**
1. Build command works locally
2. All dependencies in package.json
3. Correct Node.js version
4. No environment-specific code

**Debug:**
```yaml
- name: Debug
  run: |
    node --version
    npm --version
    ls -la
    cat package.json
```

### Deployment Fails

**Check:**
1. GitHub Pages is enabled
2. Source is set to "GitHub Actions"
3. Workflow has correct permissions
4. Artifact path is correct

### Artifact Not Found

**Common issues:**
- Wrong output directory path
- Build didn't complete successfully
- Directory doesn't exist

**Solution:**
```yaml
# Verify directory exists
- name: Check build output
  run: ls -la ./dist

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist  # Must match actual output
```

### Cache Not Working

**Check:**
1. Cache key is correct
2. Package manager matches
3. Lock file exists (package-lock.json, yarn.lock, pnpm-lock.yaml)

## Advanced Configurations

### Matrix Builds

Test multiple Node.js versions:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      - run: npm ci
      - run: npm run build
```

### Conditional Deployments

Deploy only on specific branches:

```yaml
on:
  push:
    branches:
      - main
      - production

jobs:
  deploy:
    if: github.ref == 'refs/heads/main'
    # ... deploy steps
```

### Notifications

Send notifications on deployment:

```yaml
- name: Notify Slack
  if: always()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Deployment ${{ job.status }}: ${{ github.repository }}"
      }
```

## API Reference

### `generateWorkflow(config: WorkflowConfig): string`

Generates a complete GitHub Actions workflow YAML.

**Parameters:**
```typescript
interface WorkflowConfig {
  framework: string;
  buildCommand: string;
  outputDir: string;
  installCommand: string;
  nodeVersion: string;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  branch: string;
}
```

**Returns:**
- Complete workflow YAML as string

**Example:**
```typescript
const workflow = generateWorkflow({
  framework: 'react',
  buildCommand: 'npm run build',
  outputDir: 'dist',
  installCommand: 'npm install',
  nodeVersion: '18.x',
  packageManager: 'npm',
  branch: 'main',
});
```

### `generateWorkflowFilename(): string`

Returns the standard workflow filename.

**Returns:**
- `'openporter-deploy.yml'`

## Migration from Other Platforms

### From Vercel

1. Export environment variables from Vercel
2. Add them to GitHub repository secrets
3. Use generated workflow as replacement for Vercel build
4. Update DNS to point to GitHub Pages (if using custom domain)

### From Netlify

1. Export build settings from Netlify
2. Match build command and output directory
3. Use generated workflow
4. Update DNS settings

### From Travis CI

1. Extract build commands from `.travis.yml`
2. Map to OpenPorter configuration
3. Use generated workflow
4. Remove `.travis.yml` after testing

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Deploying to GitHub Pages](https://docs.github.com/en/actions/deployment/deploying-with-github-actions/deploying-to-github-pages)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/learn-github-actions/security-hardening-for-github-actions)
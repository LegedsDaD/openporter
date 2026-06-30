# Deployment Guide

This guide covers everything you need to know about deploying with OpenPorter, from initial setup to advanced configurations.

## Deployment Process

OpenPorter deploys your static website to GitHub Pages using GitHub Actions. The deployment process is fully automated once configured.

### Automatic Deployment Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. Code Push to GitHub                                     │
│     git push origin main                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  2. GitHub Actions Triggered                                │
│     Workflow starts automatically                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Build Environment Setup                                  │
│     - Checkout code                                          │
│     - Setup Node.js                                         │
│     - Install dependencies (with cache)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Build Execution                                          │
│     - Run build command                                      │
│     - Generate static files                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Artifact Upload                                          │
│     - Upload build output to GitHub                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Deploy to GitHub Pages                                   │
│     - Deploy artifact to Pages                               │
│     - Update live site                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  7. Site Live!                                               │
│     Available at https://username.github.io/repo/           │
└─────────────────────────────────────────────────────────────┘
```

## Initial Deployment

### Step 1: Enable GitHub Pages

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Pages**
3. Under **Build and deployment** → **Source**, select **GitHub Actions**
4. Click **Save**

### Step 2: Create Workflow

Create `.github/workflows/openporter-deploy.yml` in your repository:

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

### Step 3: Commit and Push

```bash
git add .github/workflows/openporter-deploy.yml
git commit -m "Add OpenPorter deployment workflow"
git push origin main
```

### Step 4: Monitor Deployment

1. Go to the **Actions** tab in your repository
2. You'll see the "Deploy to GitHub Pages" workflow running
3. Click on the workflow run to see detailed logs
4. Wait for the workflow to complete (usually 1-3 minutes)

### Step 5: Access Your Site

Once deployment completes, your site will be available at:
```
https://<username>.github.io/<repository>/
```

## Deployment Configurations

### Basic Configuration

For simple projects, use the default configuration:

```yaml
# .github/workflows/openporter-deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

### Custom Branch Deployment

Deploy from a branch other than `main`:

```yaml
on:
  push:
    branches:
      - production  # Your deployment branch
  workflow_dispatch:
```

### Multiple Environments

Deploy to different environments (staging, production):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main      # Production
      - staging   # Staging

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
```

## Framework-Specific Deployments

### React + Vite

**package.json:**
```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite dev"
  }
}
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/<your-repo-name>/',  // Important for GitHub Pages
});
```

**Workflow:**
```yaml
- name: Build
  run: npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
```

### Next.js (Static Export)

**next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/<your-repo-name>',
};

module.exports = nextConfig;
```

**Workflow:**
```yaml
- name: Build
  run: npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./out
```

### Astro

**astro.config.mjs:**
```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://<username>.github.io',
  base: '/<your-repo-name>/',
});
```

**Workflow:**
```yaml
- name: Build
  run: npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
```

### Vue + Vite

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/<your-repo-name>/',
});
```

**Workflow:**
```yaml
- name: Build
  run: npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
```

## Advanced Deployments

### Preview Deployments

Deploy pull requests for preview:

```yaml
name: Deploy Preview

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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
```

**Comment on PR:**
```yaml
- name: Comment PR
  if: always()
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: 'Preview deployed! 🚀\n\nURL: ${{ steps.deployment.outputs.page_url }}'
      })
```

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
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
```

### Conditional Deployments

Deploy only when specific files change:

```yaml
on:
  push:
    branches:
      - main
    paths:
      - 'src/**'
      - 'package.json'
      - 'vite.config.*'
```

### Scheduled Deployments

Deploy on a schedule (e.g., daily):

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
  push:
    branches:
      - main
  workflow_dispatch:
```

## Environment Variables

### Using GitHub Secrets

Store sensitive data in GitHub Secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add your secret (e.g., `API_KEY`)

**Use in workflow:**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      API_KEY: ${{ secrets.API_KEY }}
      NODE_ENV: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
```

### Using Environment Variables

Create environment-specific variables:

1. Go to **Settings** → **Environments**
2. Create environments: `production`, `staging`
3. Add environment secrets and variables

**Use in workflow:**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    environment: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
```

## Custom Domains

### Setup Custom Domain

1. **Configure in GitHub Pages:**
   - Go to **Settings** → **Pages**
   - Under **Custom domain**, enter your domain
   - Click **Save**

2. **Update DNS:**
   - Add CNAME record pointing to `<username>.github.io`
   - Or add A records for apex domains:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

3. **Enable HTTPS:**
   - Check **Enforce HTTPS** in Pages settings
   - Wait for certificate provisioning (5-10 minutes)

### Update Workflow for Custom Domain

```yaml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
```

No workflow changes needed! GitHub Pages handles custom domains automatically.

## Monitoring Deployments

### View Deployment Logs

1. Go to **Actions** tab
2. Click on workflow run
3. Click on **build** or **deploy** job
4. Expand steps to see logs

### Deployment Notifications

#### Slack Notification

```yaml
- name: Notify Slack
  if: always()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Deployment ${{ job.status }}: ${{ github.repository }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Deployment ${{ job.status }}: ${{ github.repository }}\n${{ steps.deployment.outputs.page_url }}"
            }
          }
        ]
      }
```

#### Discord Notification

```yaml
- name: Notify Discord
  if: always()
  uses: sarahbecker/discord-webhook-notifier@v1
  with:
    webhook-url: ${{ secrets.DISCORD_WEBHOOK }}
    title: "Deployment ${{ job.status }}"
    description: |
      Repository: ${{ github.repository }}
      Branch: ${{ github.ref_name }}
      URL: ${{ steps.deployment.outputs.page_url }}
    color: ${{ job.status == 'success' && '3066993' || '15158332' }}
```

#### Email Notification

```yaml
- name: Send email
  if: always()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.MAIL_USERNAME }}
    password: ${{ secrets.MAIL_PASSWORD }}
    subject: "Deployment ${{ job.status }}: ${{ github.repository }}"
    body: |
      Deployment ${{ job.status }}!
      
      Repository: ${{ github.repository }}
      Branch: ${{ github.ref_name }}
      Commit: ${{ github.sha }}
      
      View deployment: ${{ steps.deployment.outputs.page_url }}
    to: your-email@example.com
    from: OpenPorter
```

## Rollback

### Manual Rollback

1. Go to **Settings** → **Pages**
2. Click **View deployment history**
3. Find the previous deployment
4. Click **Redeploy** or **Rollback to this version**

### Automated Rollback

Create a rollback workflow:

```yaml
name: Rollback Deployment

on:
  workflow_dispatch:
    inputs:
      deployment_id:
        description: 'Deployment ID to rollback to'
        required: true
        type: string

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.inputs.deployment_id }}
      
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
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Performance Optimization

### Build Caching

Enable dependency caching (already included in generated workflows):

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 18.x
    cache: npm  # This enables caching
```

### Incremental Builds

Use framework-specific incremental builds:

**Vite:**
```yaml
- name: Build
  run: npm run build -- --mode production
```

**Next.js:**
```yaml
- name: Build
  run: npm run build
  env:
    NODE_OPTIONS: '--max-old-space-size=4096'
```

### Parallel Jobs

Run multiple jobs in parallel:

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: npm
      - run: npm ci
      - run: npm run lint
  
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: npm
      - run: npm ci
      - run: npm test
  
  build:
    runs-on: ubuntu-latest
    needs: [lint, test]  # Wait for lint and test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

## Troubleshooting

### Deployment Fails

**Check workflow logs:**
1. Go to **Actions** tab
2. Click failed workflow
3. Review error messages

**Common issues:**
- Build command fails → Test locally first
- Wrong output directory → Verify build output
- Missing dependencies → Check package.json
- Permission errors → Check workflow permissions

### 404 Error

**Solution:**
1. Ensure `base` is set in framework config
2. Verify GitHub Pages source is "GitHub Actions"
3. Check workflow has correct permissions

### Assets Not Loading

**Solution:**
1. Use relative paths for assets
2. Set correct `base` in config
3. Check asset paths in built files

### Deployment Stuck

**Solution:**
1. Check GitHub Pages settings
2. Verify workflow is running
3. Check for concurrency issues
4. Review deployment history

## Best Practices

### 1. Test Locally First

Always test your build locally before deploying:

```bash
npm run build
npm run preview  # If available
```

### 2. Use Lock Files

Commit lock files for reproducible builds:

```bash
git add package-lock.json  # npm
git add yarn.lock          # yarn
git add pnpm-lock.yaml     # pnpm
```

### 3. Enable Status Checks

Require checks to pass before merging:

1. Go to **Settings** → **Branches**
2. Add branch protection rule
3. Require status checks to pass

### 4. Use Deployment Protection

Configure environment protection:

1. Go to **Settings** → **Environments**
2. Create `github-pages` environment
3. Add required reviewers
4. Set wait timer

### 5. Monitor Build Times

Track and optimize build times:
- Use caching
- Optimize dependencies
- Consider incremental builds
- Use faster runners if needed

## Deployment Checklist

Before deploying:

- [ ] Build works locally (`npm run build`)
- [ ] All dependencies in package.json
- [ ] Lock file committed
- [ ] Framework config correct
- [ ] Output directory correct
- [ ] GitHub Pages enabled
- [ ] Workflow file created
- [ ] Permissions configured
- [ ] Base path set (if needed)
- [ ] Environment variables configured (if needed)

After deploying:

- [ ] Site loads correctly
- [ ] All pages work
- [ ] Assets load (images, CSS, JS)
- [ ] Forms work (if any)
- [ ] Analytics working (if configured)
- [ ] Custom domain working (if configured)

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Deploying to GitHub Pages](https://docs.github.com/en/actions/deployment/deploying-with-github-actions/deploying-to-github-pages)
- [Custom Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
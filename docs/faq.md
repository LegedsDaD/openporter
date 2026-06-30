# Frequently Asked Questions

Find answers to common questions about OpenPorter.

## General Questions

### What is OpenPorter?

OpenPorter is an open-source deployment platform that provides a Vercel-like experience for deploying static websites to GitHub Pages using GitHub Actions. It automatically detects your framework, generates optimized deployment workflows, and manages the entire deployment process.

### How is OpenPorter different from Vercel?

| Feature | OpenPorter | Vercel |
|---------|-----------|--------|
| **Cost** | Free (uses GitHub Actions) | Free tier, then paid |
| **Build Minutes** | Unlimited (within GitHub limits) | 100-1000/month |
| **Vendor Lock-in** | None - runs in your repo | Some lock-in |
| **Open Source** | Yes | No |
| **Self-hostable** | Yes | No |
| **Serverless Functions** | No | Yes |
| **Edge Network** | GitHub's CDN | Vercel's global CDN |

### Is OpenPorter really free?

Yes! OpenPorter itself is free and open source. Deployments use GitHub Actions and GitHub Pages, which are free for public repositories. For private repositories, GitHub provides free minutes within certain limits.

### Do I need to pay for GitHub Actions?

GitHub Actions is free for:
- Public repositories: Unlimited minutes
- Private repositories: 2,000 minutes/month (free tier)

### Can I use OpenPorter for private repositories?

Yes! OpenPorter works with both public and private repositories. You'll need to authenticate with GitHub and grant the necessary permissions.

## Technical Questions

### What frameworks are supported?

OpenPorter supports 15+ frameworks:
- **JavaScript/TypeScript:** React, Vue, Angular, Svelte
- **Meta-frameworks:** Next.js, Nuxt, Astro
- **Static Site Generators:** Hugo, Jekyll, Docusaurus, MkDocs
- **Build Tools:** Vite
- **Plain:** HTML/CSS/JS

See [Framework Detection](framework-detection.md) for the complete list.

### How does framework detection work?

OpenPorter scans your repository for configuration files (e.g., `vite.config.ts`, `astro.config.mjs`, `package.json`) and matches them against known framework patterns. It calculates a confidence score based on how many signature files are found.

### What if framework detection fails?

You can manually specify your framework in `.openporter.json`:

```json
{
  "framework": "react",
  "buildCommand": "npm run build",
  "outputDir": "dist"
}
```

### Can I customize the generated workflow?

Yes! The generated workflow is committed to your repository, so you can edit it directly. You can also create your own workflow file from scratch.

### What package managers are supported?

OpenPorter supports:
- npm (default)
- yarn
- pnpm
- bun

### What Node.js versions are supported?

OpenPorter supports Node.js 16.x, 18.x, and 20.x. We recommend 18.x for most projects.

### Can I use environment variables?

Yes! You can use GitHub Secrets and environment variables in your workflow:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      API_URL: ${{ secrets.API_URL }}
    steps:
      # ... steps
```

### Can I deploy to a custom domain?

Yes! GitHub Pages supports custom domains. Configure your domain in GitHub Pages settings, and OpenPorter will work seamlessly.

## Deployment Questions

### How long does deployment take?

Typical deployment times:
- **Build:** 30 seconds to 3 minutes (depends on project size)
- **Deploy:** 10-30 seconds
- **Total:** 1-4 minutes for most projects

### Where is my site hosted?

Your site is hosted on GitHub Pages, which uses GitHub's global CDN for fast delivery worldwide.

### What is the deployment URL?

Your site will be available at:
```
https://<username>.github.io/<repository>/
```

### Can I have preview deployments?

Yes! You can create a separate workflow for preview deployments on pull requests. See the [Deployment Guide](deployment.md#preview-deployments) for details.

### How do I rollback a deployment?

1. Go to **Settings** → **Pages**
2. Click **View deployment history**
3. Find the previous deployment
4. Click **Redeploy**

### Can I schedule deployments?

Yes! You can use GitHub Actions' schedule trigger:

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  push:
    branches: [main]
```

## Troubleshooting

### My build is failing. What should I do?

1. Test the build locally: `npm run build`
2. Check the Actions logs for error messages
3. Verify all dependencies are in package.json
4. Ensure the correct Node.js version is specified

See [Troubleshooting](troubleshooting.md) for more detailed solutions.

### My site shows a 404 error. Why?

Most likely causes:
1. **Base path not set:** Update your framework config with the correct base path
2. **GitHub Pages not enabled:** Enable it in Settings → Pages
3. **Wrong source:** Set source to "GitHub Actions" not "Deploy from a branch"

### Deployment is stuck. What's wrong?

1. Check for concurrency issues in your workflow
2. Review deployment history in Settings → Pages
3. Try re-running the workflow from the Actions tab

### Assets are not loading. Why?

Ensure you've set the correct `base` path in your framework configuration:

```typescript
// vite.config.ts
export default defineConfig({
  base: '/<your-repo-name>/',
});
```

## Account and Security

### Do I need to provide my GitHub password?

No! OpenPorter uses OAuth 2.0 for authentication. You'll authorize the app through GitHub's secure OAuth flow. We never see or store your password.

### What permissions does OpenPorter need?

OpenPorter requires these GitHub permissions:
- **Repository access:** Read and write to your repositories
- **Actions:** Create and manage GitHub Actions workflows
- **Pages:** Configure and deploy to GitHub Pages

### Is my code secure?

Yes! All builds run in your own GitHub repository using GitHub Actions. OpenPorter doesn't have access to your code - it only generates workflow files that are committed to your repository.

### Can I revoke access?

Yes! You can revoke OpenPorter's access at any time:
1. Go to GitHub Settings → Applications
2. Find OpenPorter
3. Click **Revoke access**

## Usage and Limits

### Are there any usage limits?

OpenPorter itself has no limits, but you're subject to GitHub's limits:
- **GitHub Actions:** 2,000 minutes/month (free tier for private repos)
- **GitHub Pages:** 100GB bandwidth/month, 1GB per file, 100,000 files per site
- **Storage:** 1GB repository size limit (free tier)

### Can I deploy multiple sites?

Yes! You can use OpenPorter with as many repositories as you want. There's no limit on the number of deployments.

### How many deployments can I have?

GitHub Pages keeps your deployment history. You can rollback to any previous deployment. There's no hard limit on the number of deployments.

## Development and Contributing

### Can I contribute to OpenPorter?

Absolutely! OpenPorter is open source and we welcome contributions. See [Contributing](contributing.md) for guidelines.

### How do I report a bug?

Create an issue on GitHub with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Error messages or logs
- Your environment (framework, Node version, etc.)

### How do I request a feature?

Create an issue with:
- Feature description
- Use case and benefits
- Possible implementation approach (if you have ideas)

### Can I add support for my framework?

Yes! OpenPorter is designed to be extensible. See [Framework Detection](framework-detection.md#custom-framework-detection) for how to add custom frameworks.

## Comparison with Other Tools

### OpenPorter vs. Vercel

- **OpenPorter:** Free, open source, no vendor lock-in, uses GitHub infrastructure
- **Vercel:** Paid tiers for high usage, proprietary, better CDN, serverless functions

### OpenPorter vs. Netlify

- **OpenPorter:** Uses GitHub Actions, simpler pricing, open source
- **Netlify:** More features, better UI, proprietary, generous free tier

### OpenPorter vs. GitHub Pages (manual)

- **OpenPorter:** Automated workflow generation, framework detection, better UX
- **Manual:** More control, but requires manual workflow setup

## Getting Help

### Where can I get support?

- 📖 **Documentation:** Check the [docs](/) folder
- 💬 **Discussions:** [GitHub Discussions](https://github.com/LegedsDaD/openporter/discussions)
- 🐛 **Issues:** [GitHub Issues](https://github.com/LegedsDaD/openporter/issues)
- 💬 **Chat:** Join our Discord (coming soon)

### How do I stay updated?

- ⭐ **Star the repository** on GitHub
- 👀 **Watch** for releases and updates
- 📢 **Follow** on Twitter/X (coming soon)
- 📧 **Subscribe** to newsletter (coming soon)

## Still Have Questions?

If you can't find the answer here:

1. Search [existing issues](https://github.com/LegedsDaD/openporter/issues)
2. Ask in [discussions](https://github.com/LegedsDaD/openporter/discussions)
3. Create a [new issue](https://github.com/LegedsDaD/openporter/issues/new)

We're here to help!
<p align="center">
  <img src="https://img.shields.io/badge/OpenPorter-CLI%20Deployment%20Tool-blue?style=for-the-badge" alt="OpenPorter Logo">
</p>

<h1 align="center">OpenPorter</h1>

<p align="center">
  <strong>The Open-Source GitHub-Native Deployment Platform</strong><br>
  A Vercel-like deployment experience using <strong>GitHub Actions</strong> + <strong>GitHub Pages</strong>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://www.npmjs.com/package/openporter"><img src="https://img.shields.io/badge/npm-openporter-red.svg" alt="npm"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg" alt="Node.js"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/Built%20with-TypeScript-3178C6.svg" alt="TypeScript"></a>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#cli-commands">CLI Commands</a> •
  <a href="#supported-frameworks">Supported Frameworks</a> •
  <a href="#documentation">Docs</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## 📖 What is OpenPorter?

**OpenPorter** is a CLI tool that gives you a **Vercel-like deployment experience** — completely free, open-source, and running entirely on your own GitHub infrastructure.

| Feature | OpenPorter | Vercel | Netlify | GitHub Pages |
|---------|-----------|--------|---------|--------------|
| Pricing | **Free** | Freemium | Freemium | **Free** |
| Open Source | **✅ Yes** | ❌ No | ❌ No | ✅ Yes (limited) |
| CLI Tool | **✅ Yes** | ✅ Yes | ✅ Yes | ❌ No |
| Framework Detection | **✅ 15+ frameworks** | ✅ Yes | ✅ Yes | ❌ Manual setup |
| Auto CI/CD | **✅ GitHub Actions** | Built-in | Built-in | ❌ Manual |
| Hosting | GitHub Pages | Proprietary | Proprietary | GitHub Pages |
| Vendor Lock-in | **❌ None** | ⚠️ Partial | ⚠️ Partial | ✅ None |

### Why OpenPorter?

- **Zero Cost** — GitHub Actions and GitHub Pages are free for public repositories
- **100% Open Source** — No vendor lock-in, inspect every line of code
- **One-Command Setup** — `openporter init` detects your framework and sets up everything
- **Framework-Agnostic** — Supports React, Vue, Svelte, Astro, Next.js, Hugo, Jekyll, and more
- **Your Data, Your Infra** — Everything runs on GitHub's infrastructure, not a third-party platform
- **Vercel-like DX** — Polished CLI experience with progress spinners, colored output, and sensible defaults

---

## Features

### Core Capabilities

| Feature | Description |
|---------|-------------|
| **Automatic Framework Detection** | Scans your project and detects the framework — supports 15+ frameworks |
| **GitHub Actions Workflow Generation** | Creates optimized CI/CD pipelines tailored to your framework |
| **GitHub Pages Deployment** | One-command deploy with automatic GitHub Pages configuration |
| **Interactive CLI** | Guided prompts for setup, or skip them with `-y` for CI environments |
| **Config Management** | View and update your deployment configuration anytime |
| **Multi-Package Manager** | Works with npm, yarn, pnpm, and bun |
| **Custom Builds** | Skip the build step if you pre-build locally |

### Developer Experience

- **Simple CLI** — Just 4 commands to learn, intuitive flags
- **Type-Safe** — Built entirely in TypeScript with strict types
- **Cross-Platform** — Windows, macOS, and Linux
- **Fast** — Minimal overhead, leverages GitHub's infrastructure for heavy lifting
- **CI-Ready** — The `-y` flag makes it perfect for automated pipelines

---

## Installation

### Prerequisites

- **Node.js** >= 18.0.0
- **Git** installed and configured
- **A GitHub account** with a repository ready for deployment

### Install Globally

```bash
# Using npm
npm install -g openporter

# Using yarn
yarn global add openporter

# Using pnpm
pnpm add -g openporter
```

### Verify Installation

```bash
openporter --version
# Output: 1.1.4
openporter --help
# Shows all available commands
```

---

## Quick Start

Deploy a static site in under 2 minutes:

### 1. Navigate to Your Project

```bash
cd your-static-site-project
```

### 2. Initialize

```bash
openporter init
```

The interactive prompt will ask a few questions. Or use defaults:

```bash
openporter init -y
```

**What happens:**
- Your framework is automatically detected (React, Vue, Astro, etc.)
- `.github/workflows/openporter-deploy.yml` is created
- `.openporter.json` configuration file is generated

### 3. Commit and Push

```bash
git add .github/workflows/openporter-deploy.yml .openporter.json
git commit -m "Add OpenPorter deployment"
git push origin main
```

### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save

### 5. Deploy

```bash
openporter deploy
```

That's it! GitHub Actions will build and deploy your site automatically on every push 🎉

---

## CLI Commands

### `openporter init`

Initialize OpenPorter in your project. Detects framework, creates GitHub Actions workflow, and generates config.

```bash
openporter init [options]
```

| Option | Description | Default |
|--------|-------------|---------|
| `-y, --yes` | Skip all prompts and use auto-detected defaults | — |

**Interactive prompts:**
- GitHub repository (owner/repo)
- Branch to deploy from (main/master)
- Framework selection (auto-detect or manual)
- Node.js version (18, 20, 22)
- Package manager (npm, yarn, pnpm, bun)

---

### `openporter deploy`

Deploy your project to GitHub Pages. Commits the workflow file and pushes to trigger GitHub Actions.

```bash
openporter deploy [options]
```

| Option | Description | Default |
|--------|-------------|---------|
| `-m, --message <message>` | Custom commit message | `"Deploy to GitHub Pages"` |
| `--no-build` | Skip the build step (useful if pre-built) | Build runs by default |

**Note:** Requires `.openporter.json` (run `init` first).

---

### `openporter detect`

Detect the framework in your current project without initializing.

```bash
openporter detect
```

**Output example:**
```
Framework: React
Confidence: 100.0%
Build Command: npm run build
Output Directory: dist
Package Manager: npm
Node Version: 18.x
Detected files: package.json, vite.config.ts
```

---

### `openporter config`

View or update your OpenPorter configuration.

```bash
# View current configuration
openporter config

# Set a configuration value
openporter config -s key=value
```

| Option | Description |
|--------|-------------|
| `-s, --set <key=value>` | Set a configuration value (e.g., `-s branch=main`) |

---

## Supported Frameworks

OpenPorter auto-detects these frameworks and generates appropriate workflows:

| Framework | Icon | Build Command | Output Directory | Config Files Detected |
|-----------|:----:|:-------------:|:----------------:|:---------------------:|
| **React** (Vite) | ⚛️ | `npm run build` | `dist` | `package.json`, `vite.config.ts` |
| **Vite** | ⚡ | `npm run build` | `dist` | `vite.config.ts` |
| **Next.js** (static) | ▲ | `npm run build` | `out` | `next.config.js` |
| **Astro** | 🚀 | `npm run build` | `dist` | `astro.config.mjs` |
| **Vue** (Vite) | 💚 | `npm run build` | `dist` | `vue.config.js`, `vite.config.ts` |
| **Svelte** (Vite) | 🔥 | `npm run build` | `build` | `svelte.config.js` |
| **Nuxt** (static) | 💚 | `npm run generate` | `dist` | `nuxt.config.ts` |
| **Angular** | 🅰️ | `ng build` | `dist` | `angular.json` |
| **Hugo** | 🐹 | `hugo` | `public` | `hugo.toml` |
| **Jekyll** | 💎 | `jekyll build` | `_site` | `_config.yml` |
| **Docusaurus** | 📚 | `npm run build` | `build` | `docusaurus.config.js` |
| **MkDocs** | 📖 | `mkdocs build` | `site` | `mkdocs.yml` |
| **Plain HTML/CSS/JS** | 🌐 | *(no build step)* | `.` | `index.html` |

> **Note:** Framework detection works by scanning for known configuration files in your project root. The first match with the highest confidence wins.

---

## How It Works

```
┌───────────────────────────────────────────────────────────────────┐
│                    OpenPorter Deployment Flow                     │
└───────────────────────────────────────────────────────────────────┘

  USER MACHINE                          GITHUB
  ╔═══════════════╗                     ╔══════════════════════════════╗
  ║  1. openporter init                 ║                              ║
  ║     ├─ Detect framework             ║  2. git push                 ║
  ║     ├─ Create workflow.yml          ║     └─▶ GitHub Actions      ║
  ║     └─ Create .openporter.json      ║         ├─ Checkout code     ║
  ║                                     ║         ├─ Setup Node.js     ║
  ║  3. openporter deploy               ║         ├─ Install deps      ║
  ║     ├─ (Build if needed)            ║         ├─ Build project     ║
  ║     ├─ git commit                   ║        └─ Deploy to Pages    ║
  ║     └─ git push ─────────────────▶ ║                               ║
  ║                                     ║  4. Site live at:            ║
  ║                                     ║     https://user.github.io/  ║
  ╚═══════════════════╝                 ║              repo/           ║
                                        ╚══════════════════════════════╝
```

### Generated GitHub Actions Workflow

The workflow generated by `openporter init` includes:

- **Trigger:** On push to your configured branch + manual `workflow_dispatch`
- **Permissions:** `contents: read`, `pages: write`, `id-token: write`
- **Concurrency:** Prevents concurrent deployments, cancels in-progress ones
- **Build Job:** Checkout → Setup Node.js (with caching) → Install dependencies → Build → Upload artifact
- **Deploy Job:** Uses official `actions/deploy-pages@v4` action

---

### Tech Stack

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript (strict mode) |
| **CLI Framework** | [Commander.js](https://github.com/tj/commander.js) |
| **CLI Enhancements** | chalk (colors), ora (spinners), inquirer (prompts) |
| **GitHub API** | [Octokit](https://github.com/octokit/rest.js) |
| **Workflow Templates** | Handlebars |
| **Build System** | [Turbo](https://turbo.build/repo) + pnpm workspaces |
| **Framework Detection** | Custom config-file scanning logic |

---

## 🗺️ Roadmap

### ✅ Phase 1: Core CLI (Current)
- [x] Automatic framework detection (15+ frameworks)
- [x] GitHub Actions workflow generation
- [x] Interactive CLI with 4 commands
- [x] npm package publishing
- [x] GitHub Pages deployment automation
### 🔄 Phase 2: Enhanced Features (In Progress)
- [ ] OAuth authentication flow
- [ ] Repository management (create, fork, clone)
- [ ] Deployment history viewer
- [ ] Custom domain support
- [ ] Environment variables management
- [ ] Preview deployments

### 📅 Phase 3: Advanced Features
- [ ] One-click rollback to previous deployments
- [ ] Deployment analytics dashboard
- [ ] Team collaboration features
- [ ] Webhook integrations
- [ ] Slack/Discord notifications

### 🌟 Phase 4: Ecosystem
- [ ] VS Code extension for in-editor deployment
- [ ] GitHub App for deeper integration
- [ ] Public REST API for third-party tools
- [ ] Community template gallery
- [ ] Plugin system for custom workflows

---

## Security

- OpenPorter never stores your GitHub tokens or credentials
- All CI/CD runs on **your** GitHub infrastructure
- The tool only requires standard GitHub repo permissions
- Deployments use GitHub's official `actions/deploy-pages` action
- Zero telemetry — we don't collect usage data

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Full Documentation](docs/) | Complete reference |
| [Installation Guide](docs/installation.md) | Detailed installation instructions |
| [Quick Start](docs/quick-start.md) | Get started in 2 minutes |
| [Architecture](docs/architecture.md) | System design and packages |
| [Framework Detection](docs/framework-detection.md) | How detection works |
| [Workflow Generator](docs/workflow-generator.md) | Workflow customization |
| [Deployment Guide](docs/deployment.md) | Deployment best practices |
| [Configuration](docs/configuration.md) | Config file reference |
| [API Reference](docs/api-reference.md) | Complete API documentation |
| [Troubleshooting](docs/troubleshooting.md) | Common issues and solutions |
| [FAQ](docs/faq.md) | Frequently asked questions |
| [Contributing](docs/contributing.md) | How to contribute |

---

## Contributing

We welcome contributions of all sizes! Here's how to get started:

1. **Read the [Contributing Guide](CONTRIBUTING.md)** for our standards
2. **Check [open issues](https://github.com/LegedsDaD/openporter/issues)** for things to work on
3. **Fork the repository** and create a feature branch
4. **Write your code** following our TypeScript conventions
5. **Add tests** for new functionality
6. **Submit a pull request** with a clear description

### Ways to Contribute

- Report bugs via GitHub Issues
- Suggest features or improvements
- Improve documentation
- Add support for more frameworks
- Submit PRs for open issues

---

## License

OpenPorter is open-source software licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- **Inspired by** [Vercel](https://vercel.com), [Netlify](https://netlify.com), and [Railway](https://railway.app)
- **Built with** [TypeScript](https://www.typescriptlang.org), [Commander.js](https://github.com/tj/commander.js), and [Octokit](https://github.com/octokit/rest.js)
- **Hosted by** [GitHub Actions](https://github.com/features/actions) & [GitHub Pages](https://pages.github.com)

---

## Support

- **[Documentation](docs/)** — Self-serve answers
- **[Bug Reports](https://github.com/LegedsDaD/openporter/issues/new?labels=bug)** — Report issues
- **[Feature Requests](https://github.com/LegedsDaD/openporter/issues/new?labels=enhancement)** — Suggest ideas
- **[Star us on GitHub](https://github.com/LegedsDaD/openporter)** — Show support!

---

<p align="center">
  <strong>Built with ❤️ by @LegedsDaD and contributors</strong><br>
  <sub>No vendor lock-in. No hidden costs. Just your code, deployed.</sub>
</p>

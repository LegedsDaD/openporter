# OpenPorter CLI

CLI tool to deploy static websites to GitHub Pages using GitHub Actions.

## Installation

```bash
# Using npm
npm install -g openporter

# Using yarn
yarn global add openporter

# Using pnpm
pnpm add -g openporter
```

## Quick Start

```bash
# Initialize OpenPorter in your project
openporter init

# Deploy to GitHub Pages
openporter deploy

# Detect framework
openporter detect

# View configuration
openporter config
```

## Commands

### `openporter init`

Initialize OpenPorter in your project by generating a GitHub Actions workflow.

```bash
openporter init [options]
```

**Options:**
- `-y, --yes` - Skip prompts and use defaults

**Example:**
```bash
openporter init
# or
openporter init -y
```

This will:
1. Detect your framework automatically
2. Create `.github/workflows/openporter-deploy.yml`
3. Create `.openporter.json` configuration file

### `openporter deploy`

Deploy your project to GitHub Pages.

```bash
openporter deploy [options]
```

**Options:**
- `-m, --message <message>` - Commit message (default: "Deploy to GitHub Pages")
- `--no-build` - Skip build step

**Example:**
```bash
openporter deploy
openporter deploy -m "Deploy new features"
openporter deploy --no-build
```

### `openporter detect`

Detect the framework used in your project.

```bash
openporter detect
```

**Example output:**
```
🔍 Detecting framework...

✓ Framework detected!

📋 Detection Results:
  Framework: React + Vite
  Confidence: 95.0%
  Build Command: npm run build
  Output Directory: dist
  Package Manager: npm
  Node Version: 20.x
```

### `openporter config`

View or update OpenPorter configuration.

```bash
# View configuration
openporter config

# Set configuration value
openporter config -s key=value
```

**Example:**
```bash
openporter config
openporter config -s branch=main
openporter config -s nodeVersion=20
```

## Configuration

OpenPorter uses `.openporter.json` in your project root:

```json
{
  "repo": "username/repo",
  "branch": "main",
  "framework": "react",
  "nodeVersion": "20",
  "packageManager": "npm"
}
```

## Supported Frameworks

- React + Vite
- Vue + Vite
- Svelte + Vite
- Astro
- Next.js Static Export
- Nuxt Static
- Angular
- Hugo
- Jekyll
- Docusaurus
- MkDocs
- HTML/CSS/JS

## How It Works

1. **Initialize**: Run `openporter init` to generate GitHub Actions workflow
2. **Commit**: Push the workflow file to your repository
3. **Enable GitHub Pages**: Go to repository Settings → Pages → Select "GitHub Actions"
4. **Deploy**: Run `openporter deploy` or just push to your branch
5. **Automatic Deployments**: Every push triggers a new deployment

## GitHub Actions Workflow

The generated workflow:
- Triggers on push to your configured branch
- Sets up Node.js with your specified version
- Installs dependencies using your package manager
- Builds your project
- Deploys to GitHub Pages

## Requirements

- Node.js >= 18.0.0
- Git
- GitHub account
- Repository with GitHub Pages enabled

## Publishing to npm

### Prerequisites

1. Create an npm account at https://www.npmjs.com/
2. Login to npm: `npm login`

### Publishing

```bash
# Build the CLI
cd packages/cli
npm run build

# Publish to npm
npm publish
```

### PyPI Publishing

For PyPI, you'll need to create a Python wrapper or use a tool like `pypa/build`. This is optional and can be done separately.

## Development

```bash
# Clone the repository
git clone https://github.com/LegedsDaD/openporter.git
cd openporter

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run CLI in development mode
cd packages/cli
pnpm dev

# Or link globally for testing
pnpm link
```

## License

MIT License - see LICENSE file for details.

## Support

- 📖 [Documentation](https://github.com/LegedsDaD/openporter)
- 💬 [Issues](https://github.com/LegedsDaD/openporter/issues)
- ⭐ [Star us on GitHub](https://github.com/LegedsDaD/openporter)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](../CONTRIBUTING.md) for details.
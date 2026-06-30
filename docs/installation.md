# Installation Guide

This guide will help you set up OpenPorter for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **pnpm** 8.0 or higher ([Install](https://pnpm.io/installation))
- **Git** ([Download](https://git-scm.com/downloads))
- **GitHub Account** ([Sign up](https://github.com/signup))

## Quick Installation

```bash
# Clone the repository
git clone https://github.com/LegedsDaD/openporter.git
cd openporter

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The development server will start at `http://localhost:3000`.

## Detailed Setup

### 1. Clone the Repository

```bash
git clone https://github.com/LegedsDaD/openporter.git
cd openporter
```

### 2. Install Dependencies

OpenPorter uses pnpm for dependency management:

```bash
pnpm install
```

This will install all dependencies for the monorepo, including:
- Web application dependencies
- Package dependencies
- Development tools

### 3. Environment Configuration

Create a `.env` file in the `apps/web` directory:

```bash
# apps/web/.env
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GITHUB_CLIENT_SECRET=your_github_client_secret
```

> **Note:** For local development, you can use placeholder values. The app will work in demo mode without valid credentials.

### 4. Start Development Server

```bash
# From the root directory
pnpm dev

# Or from the apps/web directory
cd apps/web
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Development Commands

### Root Level Commands

```bash
# Install all dependencies
pnpm install

# Run all apps in development mode
pnpm dev

# Build all packages and apps
pnpm build

# Run linting on all packages
pnpm lint

# Format code with Prettier
pnpm format

# Type check all packages
pnpm check-types

# Run tests
pnpm test

# Clean build artifacts
pnpm clean
```

### Package-Specific Commands

```bash
# Work on a specific package
cd packages/github
pnpm build

# Work on the web app
cd apps/web
pnpm dev
pnpm build
pnpm lint
pnpm test
```

## IDE Setup

### Visual Studio Code

We recommend using VS Code with the following extensions:

1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - CSS autocomplete
4. **TypeScript Hero** - TypeScript utilities

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

If port 3000 is already in use:

```bash
# Change the port in apps/web/vite.config.ts
server: {
  port: 3001, // Change this
}
```

#### 2. TypeScript Errors

If you see TypeScript errors about missing types:

```bash
# Reinstall dependencies
pnpm install

# Clear TypeScript cache
rm -rf node_modules/.cache
pnpm dev
```

#### 3. Module Not Found Errors

Ensure all workspace dependencies are linked:

```bash
# From root directory
pnpm install

# Or force reinstall
pnpm install --force
```

#### 4. Build Failures

Clear all build artifacts and rebuild:

```bash
pnpm clean
pnpm install
pnpm build
```

## Next Steps

- Read the [Quick Start Guide](quick-start.md)
- Explore the [Architecture](architecture.md)
- Learn about [Framework Detection](framework-detection.md)
- Check out the [Workflow Generator](workflow-generator.md)

## Getting Help

- 📖 [Documentation](../)
- 💬 [Discussions](https://github.com/LegedsDaD/openporter/discussions)
- 🐛 [Issues](https://github.com/LegedsDaD/openporter/issues)

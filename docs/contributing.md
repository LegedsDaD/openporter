# Contributing to OpenPorter

Thank you for your interest in contributing to OpenPorter! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project adheres to a [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to:

- Be respectful and inclusive
- Welcome newcomers
- Focus on what's best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm 8+
- Git
- GitHub account
- Familiarity with React, TypeScript, and GitHub Actions

### Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/LegedsDaD/openporter.git
cd openporter

# Add upstream remote
git remote add upstream https://github.com/originalowner/openporter.git
```

### Install Dependencies

```bash
pnpm install
```

### Verify Setup

```bash
# Run development server
pnpm dev

# Run tests
pnpm test

# Run linting
pnpm lint

# Type check
pnpm check-types
```

## Development Workflow

### 1. Create a Branch

```bash
# Update your fork
git fetch upstream
git rebase upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
pnpm test

# Run linting
pnpm lint

# Type check
pnpm check-types

# Build all packages
pnpm build
```

### 4. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <subject>

# Examples:
git commit -m "feat(detector): add support for SvelteKit"
git commit -m "fix(workflow): correct Node.js version in generated workflow"
git commit -m "docs(installation): update setup instructions"
git commit -m "test(github): add tests for GitHub client"
```

**Commit types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements

### 5. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

## Pull Request Process

### Before Submitting

1. **Update your branch:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all checks:**
   ```bash
   pnpm lint
   pnpm check-types
   pnpm test
   pnpm build
   ```

3. **Update documentation:**
   - Update README if needed
   - Add/update docs in `docs/`
   - Add comments for complex code

### PR Description Template

```markdown
## Description
Brief description of changes

## Motivation
Why is this change needed?

## Changes
- List of changes made
- Key implementation details

## Testing
How did you test this?

## Screenshots (if applicable)
Before/after screenshots

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Lint passes
- [ ] Type check passes
- [ ] Build succeeds
```

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainers
3. **Approval** from at least one maintainer
4. **Squash and merge** when approved

### After Merge

- Delete your feature branch
- Update your local main branch:
  ```bash
  git checkout main
  git pull upstream main
  ```

## Coding Standards

### TypeScript

- Use strict TypeScript
- No `any` types unless absolutely necessary
- Prefer interfaces over types for object shapes
- Use meaningful variable names

**Good:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}
```

**Bad:**
```typescript
type User = any;

function getData(x: any): any {
  // ...
}
```

### React

- Use functional components with hooks
- Use TypeScript for component props
- Follow component naming conventions (PascalCase)
- Extract reusable logic into custom hooks

**Good:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }))}>{children}</button>;
}
```

### File Organization

```
packages/
├── github/
│   ├── index.ts          # Main exports
│   ├── client.ts         # Implementation
│   └── types.ts          # Type definitions
├── detector/
│   ├── index.ts
│   └── frameworks.ts
└── workflow-generator/
    ├── index.ts
    └── generator.ts
```

### Naming Conventions

- **Files:** kebab-case (`workflow-generator.ts`)
- **Components:** PascalCase (`DeploymentCard.tsx`)
- **Functions:** camelCase (`detectFramework`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Types/Interfaces:** PascalCase (`DeploymentConfig`)

### Comments

- Use JSDoc for public APIs
- Comment complex logic
- Avoid obvious comments

**Good:**
```typescript
/**
 * Detects the framework used in a repository based on config files.
 * 
 * @param files - Array of file names from repository root
 * @returns DetectionResult with framework info and confidence score
 * @example
 * const result = detectFramework(['package.json', 'vite.config.ts']);
 */
export function detectFramework(files: string[]): DetectionResult | null {
  // Complex detection logic here
}
```

**Bad:**
```typescript
// Loop through files
for (const file of files) {
  // Check if file exists
  if (file) {
    // Do something
  }
}
```

## Testing

### Test Structure

```
packages/
├── github/
│   └── __tests__/
│       └── client.test.ts
├── detector/
│   └── __tests__/
│       └── detector.test.ts
└── workflow-generator/
    └── __tests__/
        └── generator.test.ts
```

### Writing Tests

Use Vitest for testing:

```typescript
import { describe, it, expect } from 'vitest';
import { detectFramework } from '../index';

describe('detectFramework', () => {
  it('should detect React with Vite', () => {
    const files = ['package.json', 'vite.config.ts', 'src/App.tsx'];
    const result = detectFramework(files);
    
    expect(result).not.toBeNull();
    expect(result?.framework.id).toBe('react');
    expect(result?.confidence).toBeGreaterThan(0.5);
  });

  it('should return null for unknown framework', () => {
    const files = ['random.txt', 'unknown.config.js'];
    const result = detectFramework(files);
    
    expect(result).toBeNull();
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage

# Run specific test file
pnpm test packages/detector/__tests__/detector.test.ts
```

## Documentation

### When to Update Documentation

Update documentation when you:
- Add new features
- Change existing behavior
- Add new configuration options
- Fix bugs that affect usage
- Add new frameworks or templates

### Documentation Structure

```
docs/
├── installation.md
├── quick-start.md
├── architecture.md
├── framework-detection.md
├── workflow-generator.md
├── deployment.md
├── configuration.md
├── troubleshooting.md
├── faq.md
├── api-reference.md
└── examples.md
```

### Writing Documentation

- Use clear, simple language
- Include code examples
- Add diagrams for complex concepts
- Keep it up-to-date with code changes
- Use Markdown formatting

## Project Structure

```
openporter/
├── apps/
│   └── web/                    # Web application
│       ├── src/
│       │   ├── components/     # React components
│       │   │   └── ui/         # shadcn/ui components
│       │   ├── pages/          # Page components
│       │   ├── routes/         # TanStack Router routes
│       │   ├── lib/            # Utilities
│       │   └── main.tsx        # Entry point
│       └── package.json
├── packages/
│   ├── github/                 # GitHub API client
│   ├── detector/               # Framework detection
│   ├── workflow-generator/     # Workflow generation
│   ├── templates/              # Deployment templates
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Shared utilities
│   └── ui/                     # Shared UI components
├── docs/                       # Documentation
├── .github/                    # GitHub Actions
└── package.json
```

## Common Contribution Tasks

### Adding a New Framework

1. Add framework definition in `packages/detector/index.ts`
2. Add template in `packages/templates/index.ts`
3. Add tests for detection
4. Update documentation

### Adding a New UI Component

1. Create component in `packages/ui/components/`
2. Export from `packages/ui/index.ts`
3. Add tests
4. Update documentation

### Fixing a Bug

1. Create issue describing the bug
2. Write test that reproduces the bug
3. Fix the bug
4. Verify test passes
5. Update documentation if needed

### Improving Documentation

1. Identify unclear or missing documentation
2. Make improvements
3. Submit PR with changes

## Community

### Getting Help

- 💬 [Discussions](https://github.com/LegedsDaD/openporter/discussions) - Ask questions
- 🐛 [Issues](https://github.com/LegedsDaD/openporter/issues) - Report bugs
- 📖 [Documentation](/) - Read the docs

### Reporting Bugs

Create an issue with:
1. Clear description of the bug
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots if applicable
5. Environment details (OS, Node version, etc.)

### Suggesting Features

Create an issue with:
1. Feature description
2. Use case and motivation
3. Proposed implementation (if you have ideas)
4. Alternatives considered

### Code Review

When reviewing PRs:
- Be respectful and constructive
- Focus on code quality and maintainability
- Suggest improvements
- Approve when ready

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

## Questions?

If you have questions about contributing:
1. Check the [documentation](/)
2. Ask in [discussions](https://github.com/LegedsDaD/openporter/discussions)
3. Create an [issue](https://github.com/LegedsDaD/openporter/issues)

Thank you for contributing to OpenPorter! 🚀
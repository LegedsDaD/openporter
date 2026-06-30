# Architecture

This document describes the architecture of OpenPorter, explaining how the different components work together.

## System Overview

OpenPorter is a **serverless deployment platform** that leverages GitHub's infrastructure. The platform consists of:

1. **Web Application** - React-based UI for managing deployments
2. **GitHub Integration** - API client for interacting with GitHub
3. **Workflow Generator** - Creates GitHub Actions workflows
4. **Framework Detector** - Identifies project frameworks
5. **Templates** - Pre-configured deployment templates

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│                    (React + Vite + Tailwind)                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   TanStack   │  │   TanStack   │  │   Framer Motion      │  │
│  │    Router    │  │    Query     │  │   (Animations)       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Business Logic                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │    GitHub    │  │   Workflow   │  │    Framework         │  │
│  │   Client     │  │  Generator   │  │    Detector          │  │
│  │  (Octokit)   │  │              │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Templates   │  │    Types     │  │    Utilities         │  │
│  │              │  │              │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────┐  ┌────────────────────────────┐  │
│  │      GitHub API          │  │    GitHub Actions          │  │
│  │   (REST + GraphQL)       │  │   (CI/CD Runner)           │  │
│  └──────────────────────────┘  └────────────────────────────┘  │
│  ┌──────────────────────────┐  ┌────────────────────────────┐  │
│  │    GitHub Pages          │  │    GitHub Storage          │  │
│  │   (Static Hosting)       │  │   (Artifacts)              │  │
│  └──────────────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Web Application (`apps/web`)

The frontend application built with React and Vite.

**Key Features:**
- Landing page with marketing content
- Dashboard for managing deployments
- Repository management
- Real-time deployment logs
- Settings and configuration

**Technology Stack:**
- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- shadcn/ui for components
- TanStack Router for routing
- TanStack Query for data fetching
- Framer Motion for animations

**Directory Structure:**
```
apps/web/
├── src/
│   ├── components/          # Reusable components
│   │   └── ui/              # shadcn/ui components
│   ├── pages/               # Page components
│   │   ├── landing.tsx      # Landing page
│   │   ├── dashboard.tsx    # Dashboard
│   │   ├── repositories.tsx # Repository list
│   │   └── ...
│   ├── routes/              # TanStack Router routes
│   │   ├── __root.tsx       # Root route
│   │   └── index.tsx        # Index route
│   ├── lib/                 # Utilities
│   │   └── utils.ts         # Helper functions
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### 2. GitHub Integration (`packages/github`)

Wrapper around Octokit for GitHub API interactions.

**Responsibilities:**
- Repository management
- File operations (read/write)
- GitHub Actions workflow management
- GitHub Pages configuration
- Deployment status tracking

**Key Classes:**
```typescript
class GitHubClient {
  // Repository operations
  async getRepository(owner, repo)
  
  // File operations
  async getFileContent(owner, repo, path, ref?)
  async createOrUpdateFile(owner, repo, path, content, message, sha?)
  
  // Pages configuration
  async enablePages(owner, repo, branch?)
  
  // Actions operations
  async createWorkflowRun(owner, repo, workflowId)
  async getWorkflowRuns(owner, repo, workflowId?)
  async getWorkflowRunLogs(owner, repo, runId)
}
```

### 3. Workflow Generator (`packages/workflow-generator`)

Generates GitHub Actions workflow files for deployment.

**Responsibilities:**
- Create optimized workflow YAML
- Configure build environment
- Set up caching
- Handle deployment steps

**Workflow Structure:**
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - setup-node
      - install-dependencies
      - build
      - upload-artifact
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - deploy-to-pages
```

### 4. Framework Detector (`packages/detector`)

Automatically identifies frameworks from repository files.

**Detection Strategy:**
1. Scan repository for configuration files
2. Match against known framework patterns
3. Calculate confidence score
4. Return best match with detected files

**Supported Frameworks:**
- React, Vue, Angular, Svelte
- Astro, Vite, Next.js, Nuxt
- Hugo, Jekyll, Docusaurus, MkDocs
- HTML/CSS/JS

**Detection Logic:**
```typescript
function detectFramework(files: string[]): DetectionResult | null {
  // 1. Normalize file names
  const fileSet = new Set(files.map(f => f.toLowerCase()))
  
  // 2. Check each framework
  for (const framework of frameworks) {
    const matchedFiles = framework.configFiles.filter(f => 
      fileSet.has(f.toLowerCase())
    )
    
    // 3. Calculate confidence
    const confidence = matchedFiles.length / framework.configFiles.length
    
    // 4. Return best match
    if (confidence > bestConfidence) {
      bestMatch = { framework, confidence, detectedFiles: matchedFiles }
    }
  }
  
  return bestMatch
}
```

### 5. Templates (`packages/templates`)

Pre-configured deployment templates for common frameworks.

**Template Structure:**
```typescript
interface Template {
  id: string
  name: string
  description: string
  config: Partial<DeploymentConfig>
}
```

**Available Templates:**
- React + Vite
- Next.js Static Export
- Astro
- Vue + Vite
- Svelte + Vite
- Nuxt Static
- Hugo
- Docusaurus

### 6. Types (`packages/types`)

TypeScript type definitions shared across packages.

**Core Types:**
- `Deployment` - Deployment record
- `Repository` - Repository information
- `DeploymentConfig` - Build configuration
- `User` - GitHub user
- `WorkflowRun` - GitHub Actions run

### 7. Utilities (`packages/utils`)

Shared utility functions.

**Utilities:**
- `formatDate()` - Date formatting
- `formatDuration()` - Duration formatting
- `truncate()` - String truncation
- `classNames()` - CSS class merging
- `generateId()` - ID generation
- `debounce()` - Function debouncing
- `formatBytes()` - Byte size formatting

### 8. UI Components (`packages/ui`)

Shared React components.

**Components:**
- `Button` - Versatile button component
- `Toast` - Notification toasts
- `Tooltip` - Tooltip component

## Data Flow

### Deployment Flow

```
1. User selects repository
   │
   ▼
2. OpenPorter fetches repository files
   │
   ▼
3. Framework detector analyzes files
   │
   ▼
4. Best matching framework is selected
   │
   ▼
5. Workflow generator creates YAML
   │
   ▼
6. GitHub client commits workflow file
   │
   ▼
7. GitHub Actions triggers deployment
   │
   ▼
8. Build runs on GitHub's infrastructure
   │
   ▼
9. Artifacts uploaded to GitHub Pages
   │
   ▼
10. Site is live!
```

### State Management

OpenPorter uses **TanStack Query** for server state management:

```typescript
// Fetch repositories
const { data: repos, isLoading } = useQuery({
  queryKey: ['repos'],
  queryFn: () => githubClient.getRepositories(),
})

// Trigger deployment
const deployMutation = useMutation({
  mutationFn: (repo: string) => githubClient.deploy(repo),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['deployments'] })
  },
})
```

## Security Considerations

### Authentication

- OAuth 2.0 with GitHub
- Minimal required scopes:
  - `repo` - Repository access
  - `workflow` - Actions management
  - `pages` - Pages configuration

### Permissions

GitHub Actions workflows require:
```yaml
permissions:
  contents: read      # Read repository
  pages: write        # Deploy to Pages
  id-token: write     # OIDC token
```

### Data Privacy

- No build logs stored on OpenPorter servers
- All builds run in user's GitHub repository
- No sensitive data transmitted to third parties

## Scalability

### Horizontal Scaling

- Web app can be deployed to any static host
- No database required (GitHub is the source of truth)
- Stateless architecture

### Performance

- Vite for fast development
- GitHub Actions for parallel builds
- GitHub's CDN for global distribution

## Extension Points

### Adding New Frameworks

1. Add framework to `packages/detector/index.ts`
2. Define config files and build settings
3. Add template to `packages/templates/index.ts`

### Custom Workflows

Users can customize generated workflows by:
1. Modifying the committed YAML file
2. Using workflow customization options
3. Providing custom build scripts

## Future Enhancements

### Planned Features

1. **Preview Deployments** - Deploy PR branches
2. **Rollback** - Revert to previous deployments
3. **Analytics** - Deployment statistics
4. **Custom Domains** - Domain management
5. **Environment Variables** - Secret management
6. **CLI Tool** - Command-line interface

### Architecture Evolution

- Add GraphQL API for complex queries
- Implement webhook system for real-time updates
- Add plugin system for extensibility
- Support for additional CI/CD providers
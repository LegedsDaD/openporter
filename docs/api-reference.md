# API Reference

Complete API reference for OpenPorter packages.

## Table of Contents

- [@openporter/github](#openportergithub)
- [@openporter/detector](#openporterdetector)
- [@openporter/workflow-generator](#openporterworkflow-generator)
- [@openporter/templates](#openportertemplates)
- [@openporter/types](#openportertypes)
- [@openporter/utils](#openporterutils)

---

## @openporter/github

GitHub API client for interacting with GitHub repositories, files, and Actions.

### Classes

#### `GitHubClient`

Main client for GitHub API operations.

**Constructor:**

```typescript
interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}

const client = new GitHubClient(config);
```

**Methods:**

##### `getRepository(owner: string, repo: string): Promise<Repository>`

Gets repository information.

**Parameters:**
- `owner` - Repository owner (username or organization)
- `repo` - Repository name

**Returns:** Repository object from GitHub API

**Example:**
```typescript
const repo = await client.getRepository('octocat', 'hello-world');
console.log(repo.name, repo.default_branch);
```

##### `getFileContent(owner: string, repo: string, path: string, ref?: string): Promise<string | null>`

Gets file content from repository.

**Parameters:**
- `owner` - Repository owner
- `repo` - Repository name
- `path` - File path in repository
- `ref` - Optional branch/tag/commit (default: default branch)

**Returns:** File content as string, or null if not found

**Example:**
```typescript
const content = await client.getFileContent('octocat', 'hello-world', 'package.json');
console.log(content);
```

##### `createOrUpdateFile(owner: string, repo: string, path: string, content: string, message: string, sha?: string): Promise<File>`

Creates or updates a file in the repository.

**Parameters:**
- `owner` - Repository owner
- `repo` - Repository name
- `path` - File path
- `content` - File content
- `message` - Commit message
- `sha` - Optional SHA of existing file (required for updates)

**Returns:** File creation/update response

**Example:**
```typescript
await client.createOrUpdateFile(
  'octocat',
  'hello-world',
  '.github/workflows/deploy.yml',
  workflowYaml,
  'Add deployment workflow'
);
```

##### `enablePages(owner: string, repo: string, branch?: string): Promise<Pages>`

Enables GitHub Pages for the repository.

**Parameters:**
- `owner` - Repository owner
- `repo` - Repository name
- `branch` - Branch to deploy from (default: 'gh-pages')

**Returns:** Pages configuration response

**Example:**
```typescript
await client.enablePages('octocat', 'hello-world', 'gh-pages');
```

##### `createWorkflowRun(owner: string, repo: string, workflowId: string): Promise<WorkflowRun>`

Triggers a workflow dispatch event.

**Parameters:**
- `owner` - Repository owner
- `repo` - Repository name
- `workflowId` - Workflow file name or ID

**Returns:** Workflow run response

**Example:**
```typescript
await client.createWorkflowRun('octocat', 'hello-world', 'deploy.yml');
```

##### `getWorkflowRuns(owner: string, repo: string, workflowId?: string): Promise<WorkflowRun[]>`

Gets recent workflow runs.

**Parameters:**
- `owner` - Repository owner
- `repo` - Repository name
- `workflowId` - Optional workflow ID to filter

**Returns:** Array of workflow runs

**Example:**
```typescript
const runs = await client.getWorkflowRuns('octocat', 'hello-world');
runs.forEach(run => {
  console.log(run.id, run.status, run.conclusion);
});
```

##### `getWorkflowRunLogs(owner: string, repo: string, runId: number): Promise<string>`

Gets logs for a specific workflow run.

**Parameters:**
- `owner` - Repository owner
- `repo` - Repository name
- `runId` - Workflow run ID

**Returns:** Log content as string

**Example:**
```typescript
const logs = await client.getWorkflowRunLogs('octocat', 'hello-world', 123456);
console.log(logs);
```

### Helper Functions

##### `createGitHubClient(config: GitHubConfig): GitHubClient`

Factory function to create a GitHub client.

**Example:**
```typescript
import { createGitHubClient } from '@openporter/github';

const client = createGitHubClient({
  token: process.env.GITHUB_TOKEN,
  owner: 'octocat',
  repo: 'hello-world'
});
```

---

## @openporter/detector

Framework detection utilities.

### Interfaces

#### `FrameworkInfo`

```typescript
interface FrameworkInfo {
  id: string;
  name: string;
  icon: string;
  buildCommand: string;
  outputDir: string;
  installCommand: string;
  nodeVersion: string;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  configFiles: string[];
}
```

#### `DetectionResult`

```typescript
interface DetectionResult {
  framework: FrameworkInfo;
  confidence: number;
  detectedFiles: string[];
}
```

### Functions

##### `detectFramework(files: string[]): DetectionResult | null`

Detects framework from list of file names.

**Parameters:**
- `files` - Array of file names (can include paths)

**Returns:** DetectionResult or null if no framework detected

**Example:**
```typescript
import { detectFramework } from '@openporter/detector';

const files = [
  'package.json',
  'vite.config.ts',
  'src/App.tsx',
  'src/main.tsx'
];

const result = detectFramework(files);

if (result) {
  console.log(`Framework: ${result.framework.name}`);
  console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
  console.log(`Build: ${result.framework.buildCommand}`);
  console.log(`Output: ${result.framework.outputDir}`);
}
```

##### `getFrameworkById(id: string): FrameworkInfo | undefined`

Gets framework information by ID.

**Parameters:**
- `id` - Framework identifier (e.g., 'react', 'vue', 'astro')

**Returns:** FrameworkInfo or undefined

**Example:**
```typescript
import { getFrameworkById } from '@openporter/detector';

const react = getFrameworkById('react');
console.log(react?.buildCommand); // 'npm run build'
```

##### `getAllFrameworks(): FrameworkInfo[]`

Gets list of all supported frameworks.

**Returns:** Array of FrameworkInfo objects

**Example:**
```typescript
import { getAllFrameworks } from '@openporter/detector';

const frameworks = getAllFrameworks();
frameworks.forEach(fw => {
  console.log(`${fw.icon} ${fw.name}`);
});
```

### Constants

##### `frameworks: FrameworkInfo[]`

Array of all supported frameworks with their configurations.

**Example:**
```typescript
import { frameworks } from '@openporter/detector';

console.log(`Total frameworks: ${frameworks.length}`);
// Output: Total frameworks: 13
```

---

## @openporter/workflow-generator

GitHub Actions workflow generation.

### Interfaces

#### `WorkflowConfig`

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

### Functions

##### `generateWorkflow(config: WorkflowConfig): string`

Generates a complete GitHub Actions workflow YAML.

**Parameters:**
- `config` - Workflow configuration

**Returns:** Complete workflow YAML as string

**Example:**
```typescript
import { generateWorkflow } from '@openporter/workflow-generator';

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
// Outputs complete YAML workflow
```

##### `generateWorkflowFilename(): string`

Returns the standard workflow filename.

**Returns:** `'openporter-deploy.yml'`

**Example:**
```typescript
import { generateWorkflowFilename } from '@openporter/workflow-generator';

const filename = generateWorkflowFilename();
console.log(filename); // 'openporter-deploy.yml'
```

### Generated Workflow Structure

The generated workflow includes:

1. **Triggers:** Push to branch + manual dispatch
2. **Permissions:** contents: read, pages: write, id-token: write
3. **Concurrency:** Prevents simultaneous deployments
4. **Build Job:**
   - Checkout code
   - Setup Node.js with caching
   - Install dependencies
   - Build project
   - Upload artifact
5. **Deploy Job:**
   - Deploy to GitHub Pages

---

## @openporter/templates

Pre-configured deployment templates.

### Interfaces

#### `Template`

```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  config: Partial<DeploymentConfig>;
}
```

### Constants

##### `templates: Template[]`

Array of available templates.

**Example:**
```typescript
import { templates } from '@openporter/templates';

templates.forEach(template => {
  console.log(`${template.id}: ${template.name}`);
  console.log(`  ${template.description}`);
});
```

### Functions

##### `getTemplateById(id: string): Template | undefined`

Gets template by ID.

**Parameters:**
- `id` - Template identifier

**Returns:** Template or undefined

**Example:**
```typescript
import { getTemplateById } from '@openporter/templates';

const template = getTemplateById('react-vite');
console.log(template?.name); // 'React + Vite'
```

##### `getAllTemplates(): Template[]`

Gets all available templates.

**Returns:** Array of Template objects

**Example:**
```typescript
import { getAllTemplates } from '@openporter/templates';

const all = getAllTemplates();
console.log(`Available templates: ${all.length}`);
```

##### `generateWorkflowFromTemplate(templateId: string, branch?: string): string`

Generates workflow from template.

**Parameters:**
- `templateId` - Template identifier
- `branch` - Branch to deploy from (default: 'main')

**Returns:** Complete workflow YAML

**Example:**
```typescript
import { generateWorkflowFromTemplate } from '@openporter/templates';

const workflow = generateWorkflowFromTemplate('react-vite', 'main');
console.log(workflow);
```

##### `getWorkflowFilename(): string`

Returns workflow filename.

**Returns:** `'openporter-deploy.yml'`

---

## @openporter/types

TypeScript type definitions.

### Interfaces

#### `Deployment`

```typescript
interface Deployment {
  id: string;
  repo: string;
  owner: string;
  status: 'pending' | 'building' | 'deploying' | 'success' | 'error';
  branch: string;
  commitSha: string;
  commitMessage: string;
  author: string;
  url?: string;
  createdAt: Date;
  finishedAt?: Date;
  duration?: number;
  logs?: string;
}
```

#### `Repository`

```typescript
interface Repository {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  framework?: string;
  lastDeployment?: Deployment;
  pagesEnabled: boolean;
  pagesUrl?: string;
  defaultBranch: string;
  updatedAt: Date;
}
```

#### `DeploymentConfig`

```typescript
interface DeploymentConfig {
  framework: string;
  buildCommand: string;
  outputDir: string;
  installCommand: string;
  nodeVersion: string;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  branch: string;
}
```

#### `User`

```typescript
interface User {
  login: string;
  name?: string;
  email?: string;
  avatarUrl: string;
  bio?: string;
  company?: string;
  location?: string;
  blog?: string;
  publicRepos: number;
  followers: number;
  following: number;
}
```

#### `WorkflowRun`

```typescript
interface WorkflowRun {
  id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion?: 'success' | 'failure' | 'cancelled' | 'skipped';
  headBranch: string;
  headSha: string;
  runNumber: number;
  createdAt: Date;
  updatedAt: Date;
  url: string;
  logsUrl?: string;
}
```

---

## @openporter/utils

Shared utility functions.

### Functions

#### `formatDate(date: Date): string`

Formats date to human-readable string.

**Parameters:**
- `date` - Date to format

**Returns:** Formatted date string (e.g., "Jan 1, 2024, 12:00 PM")

**Example:**
```typescript
import { formatDate } from '@openporter/utils';

const now = new Date();
console.log(formatDate(now)); // "Jan 1, 2024, 12:00 PM"
```

#### `formatDuration(seconds: number): string`

Formats duration in seconds to human-readable string.

**Parameters:**
- `seconds` - Duration in seconds

**Returns:** Formatted duration (e.g., "2m 30s", "1h 15m")

**Example:**
```typescript
import { formatDuration } from '@openporter/utils';

console.log(formatDuration(30)); // "30s"
console.log(formatDuration(150)); // "2m 30s"
console.log(formatDuration(3665)); // "1h 1m"
```

#### `truncate(str: string, length: number): string`

Truncates string to specified length.

**Parameters:**
- `str` - String to truncate
- `length` - Maximum length

**Returns:** Truncated string with "..." if needed

**Example:**
```typescript
import { truncate } from '@openporter/utils';

console.log(truncate('Hello World', 8)); // "Hello Wo..."
console.log(truncate('Hi', 8)); // "Hi"
```

#### `classNames(...classes: (string | boolean | undefined | null)[]): string`

Merges CSS class names conditionally.

**Parameters:** Variable number of class names (strings, booleans, undefined, null)

**Returns:** Merged class string

**Example:**
```typescript
import { classNames } from '@openporter/utils';

console.log(classNames('btn', true && 'btn-primary', false && 'btn-disabled', 'btn-large'));
// "btn btn-primary btn-large"
```

#### `generateId(): string`

Generates unique ID.

**Returns:** Unique string ID

**Example:**
```typescript
import { generateId } from '@openporter/utils';

const id = generateId();
console.log(id); // "abc123xyz789"
```

#### `sleep(ms: number): Promise<void>`

Creates a promise that resolves after specified milliseconds.

**Parameters:**
- `ms` - Milliseconds to sleep

**Returns:** Promise that resolves after delay

**Example:**
```typescript
import { sleep } from '@openporter/utils';

async function example() {
  console.log('Waiting...');
  await sleep(2000);
  console.log('Done!');
}
```

#### `debounce<T>(func: T, wait: number): (...args: any[]) => void`

Debounces a function.

**Parameters:**
- `func` - Function to debounce
- `wait` - Wait time in milliseconds

**Returns:** Debounced function

**Example:**
```typescript
import { debounce } from '@openporter/utils';

const search = debounce((query: string) => {
  console.log('Searching:', query);
}, 300);

search('hello'); // Will execute after 300ms
search('world'); // Will cancel previous and execute after 300ms
```

#### `formatBytes(bytes: number, decimals?: number): string`

Formats bytes to human-readable string.

**Parameters:**
- `bytes` - Number of bytes
- `decimals` - Number of decimal places (default: 2)

**Returns:** Formatted string (e.g., "1.5 MB", "300 KB")

**Example:**
```typescript
import { formatBytes } from '@openporter/utils';

console.log(formatBytes(0)); // "0 Bytes"
console.log(formatBytes(1024)); // "1 KB"
console.log(formatBytes(1536)); // "1.5 KB"
console.log(formatBytes(1048576)); // "1 MB"
```

---

## Error Handling

All API functions can throw errors. Always use try-catch:

```typescript
import { detectFramework } from '@openporter/detector';

try {
  const result = detectFramework(files);
  if (result) {
    console.log('Detected:', result.framework.name);
  }
} catch (error) {
  console.error('Detection failed:', error);
}
```

## Type Imports

Import types from respective packages:

```typescript
import type { Deployment, Repository, DeploymentConfig } from '@openporter/types';
import type { FrameworkInfo, DetectionResult } from '@openporter/detector';
import type { WorkflowConfig } from '@openporter/workflow-generator';
import type { Template } from '@openporter/templates';
```

## Version

This API reference is for OpenPorter v1.0.0.

For the latest updates, check the [changelog](https://github.com/LegedsDaD/openporter/blob/main/CHANGELOG.md).

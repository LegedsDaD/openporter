# Framework Detection

OpenPorter automatically detects the framework used in your project by analyzing configuration files. This document explains how the detection system works.

## How It Works

OpenPorter's framework detector scans your repository for specific configuration files and matches them against known framework patterns. Each framework has a set of characteristic files that help identify it.

### Detection Process

1. **File Scanning** - Retrieves list of files from repository root
2. **Pattern Matching** - Compares files against framework signatures
3. **Confidence Calculation** - Calculates match confidence (0-100%)
4. **Best Match Selection** - Returns the framework with highest confidence

### Confidence Score

The confidence score is calculated as:

```
confidence = (matched_files / total_config_files) * 100
```

**Example:**
- React detection requires: `['package.json', 'vite.config.ts', 'vite.config.js']`
- If `package.json` and `vite.config.ts` are found: `2/3 = 66.7%` confidence

## Supported Frameworks

### JavaScript/TypeScript Frameworks

#### React
- **Icon:** ⚛️
- **Config Files:** `package.json`, `vite.config.ts`, `vite.config.js`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18.x
- **Package Manager:** npm

**Detection Indicators:**
- `package.json` with `react` or `react-dom` in dependencies
- `vite.config.ts` or `vite.config.js` present
- `src/App.tsx` or `src/App.jsx` exists

#### Vue
- **Icon:** 💚
- **Config Files:** `vue.config.js`, `vite.config.ts`, `vite.config.js`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18.x
- **Package Manager:** npm

**Detection Indicators:**
- `vue.config.js` present
- `package.json` with `vue` in dependencies
- `src/App.vue` exists

#### Svelte
- **Icon:** 🔥
- **Config Files:** `svelte.config.js`, `vite.config.ts`, `vite.config.js`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Node Version:** 18.x
- **Package Manager:** npm

**Detection Indicators:**
- `svelte.config.js` present
- `package.json` with `svelte` in dependencies
- `src/App.svelte` exists

#### Angular
- **Icon:** 🅰️
- **Config Files:** `angular.json`
- **Build Command:** `ng build`
- **Output Directory:** `dist`
- **Node Version:** 18.x
- **Package Manager:** npm

**Detection Indicators:**
- `angular.json` present
- `package.json` with `@angular/core` in dependencies

#### Next.js (Static Export)
- **Icon:** ▲
- **Config Files:** `next.config.js`, `next.config.mjs`, `next.config.ts`
- **Build Command:** `npm run build`
- **Output Directory:** `out`
- **Node Version:** 18.x
- **Package Manager:** npm

**Detection Indicators:**
- `next.config.*` present
- `package.json` with `next` in dependencies
- `pages/` or `app/` directory exists

**Note:** Requires `output: 'export'` in next.config.js for static export

#### Nuxt (Static Generation)
- **Icon:** 💚
- **Config Files:** `nuxt.config.ts`, `nuxt.config.js`
- **Build Command:** `npm run generate`
- **Output Directory:** `dist`
- **Node Version:** 18.x
- **Package Manager:** npm

**Detection Indicators:**
- `nuxt.config.*` present
- `package.json` with `nuxt` in dependencies

### Static Site Generators

#### Astro
- **Icon:** 🚀
- **Config Files:** `astro.config.mjs`, `astro.config.js`, `astro.config.ts`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18.x
- **Package Manager:** npm

**Detection Indicators:**
- `astro.config.*` present
- `package.json` with `astro` in dependencies

#### Hugo
- **Icon:** 🐹
- **Config Files:** `hugo.toml`, `hugo.yaml`, `config.toml`
- **Build Command:** `hugo`
- **Output Directory:** `public`
- **Node Version:** 18.x
- **Package Manager:** npm

**Detection Indicators:**
- `hugo.toml`, `hugo.yaml`, or `config.toml` present
- `content/` directory exists

#### Jekyll
- **Icon:** 💎
- **Config Files:** `_config.yml`
- **Build Command:** `jekyll build`
- **Output Directory:** `_site`
- **Node Version:** 18.x
- **Package Manager:** npm

**Detection Indicators:**
- `_config.yml` present
- `_posts/` directory exists

#### Docusaurus
- **Icon:** 📚
- **Config Files:** `docusaurus.config.js`, `docusaurus.config.ts`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Node Version:** 18.x
- **Package Manager:** npm

**Detection Indicators:**
- `docusaurus.config.*` present
- `package.json` with `docusaurus` in dependencies
- `blog/` or `docs/` directory exists

#### MkDocs
- **Icon:** 📖
- **Config Files:** `mkdocs.yml`
- **Build Command:** `mkdocs build`
- **Output Directory:** `site`
- **Node Version:** 18.x
- **Package Manager:** npm

**Detection Indicators:**
- `mkdocs.yml` present
- `docs/` directory exists

### Build Tools

#### Vite
- **Icon:** ⚡
- **Config Files:** `vite.config.ts`, `vite.config.js`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18.x
- **Package Manager:** npm

**Detection Indicators:**
- `vite.config.*` present
- `package.json` with `vite` in dependencies
- No framework-specific config files found

### Plain HTML/CSS/JS

#### HTML
- **Icon:** 🌐
- **Config Files:** `index.html`
- **Build Command:** `echo "No build step required"`
- **Output Directory:** `.`
- **Node Version:** 18.x
- **Package Manager:** npm

**Detection Indicators:**
- `index.html` present in root
- No package.json or build configuration

## Using the Detector

### In Node.js

```typescript
import { detectFramework, getAllFrameworks } from '@openporter/detector';

// Get list of all supported frameworks
const frameworks = getAllFrameworks();
console.log(frameworks);

// Detect framework from file list
const repositoryFiles = [
  'package.json',
  'vite.config.ts',
  'src/App.tsx',
  'src/main.tsx',
];

const result = detectFramework(repositoryFiles);

if (result) {
  console.log(`Detected: ${result.framework.name}`);
  console.log(`Confidence: ${result.confidence * 100}%`);
  console.log(`Detected files: ${result.detectedFiles.join(', ')}`);
  console.log(`Build command: ${result.framework.buildCommand}`);
  console.log(`Output directory: ${result.framework.outputDir}`);
} else {
  console.log('No framework detected');
}
```

### In React Components

```typescript
import { useQuery } from '@tanstack/react-query';
import { detectFramework, type DetectionResult } from '@openporter/detector';
import { githubClient } from '@/lib/github';

function FrameworkDetector({ owner, repo }: { owner: string; repo: string }) {
  const { data: files, isLoading } = useQuery({
    queryKey: ['repo-files', owner, repo],
    queryFn: () => githubClient.getRepositoryFiles(owner, repo),
  });

  const detectionResult: DetectionResult | null = files 
    ? detectFramework(files.map(f => f.name))
    : null;

  if (isLoading) return <div>Detecting framework...</div>;
  
  if (!detectionResult) {
    return <div>No framework detected. Please select manually.</div>;
  }

  return (
    <div>
      <h3>Detected Framework</h3>
      <p>Framework: {detectionResult.framework.name}</p>
      <p>Confidence: {(detectionResult.confidence * 100).toFixed(1)}%</p>
      <p>Build Command: {detectionResult.framework.buildCommand}</p>
      <p>Output Directory: {detectionResult.framework.outputDir}</p>
    </div>
  );
}
```

## Manual Override

Users can manually select a framework if auto-detection fails or returns low confidence:

```typescript
import { getFrameworkById } from '@openporter/detector';

// User selects framework manually
const selectedFramework = getFrameworkById('react');

if (selectedFramework) {
  console.log(`Using: ${selectedFramework.name}`);
  console.log(`Build: ${selectedFramework.buildCommand}`);
  console.log(`Output: ${selectedFramework.outputDir}`);
}
```

## Custom Framework Detection

You can extend OpenPorter to support custom frameworks:

### 1. Add Framework Definition

```typescript
// In packages/detector/index.ts
{
  id: 'custom-framework',
  name: 'My Custom Framework',
  icon: '🛠️',
  buildCommand: 'npm run build',
  outputDir: 'dist',
  installCommand: 'npm install',
  nodeVersion: '18.x',
  packageManager: 'npm',
  configFiles: [
    'custom.config.js',
    'package.json',
  ],
}
```

### 2. Add Template

```typescript
// In packages/templates/index.ts
{
  id: 'custom-framework',
  name: 'My Custom Framework',
  description: 'Custom framework template',
  config: {
    framework: 'custom-framework',
    buildCommand: 'npm run build',
    outputDir: 'dist',
    installCommand: 'npm install',
    nodeVersion: '18.x',
    packageManager: 'npm',
  },
}
```

## Troubleshooting Detection

### Low Confidence Score

If detection returns low confidence (< 50%):

1. **Check config files** - Ensure framework config files are in repository root
2. **Verify package.json** - Ensure dependencies are correctly specified
3. **Manual selection** - Allow user to manually select framework

### No Framework Detected

If no framework is detected:

1. **Check for index.html** - May be plain HTML/CSS/JS project
2. **Verify file structure** - Ensure standard framework structure
3. **Manual selection** - Provide manual framework selection

### Wrong Framework Detected

If wrong framework is detected:

1. **Check for conflicting files** - Multiple framework configs may exist
2. **Use manual selection** - Allow user to override
3. **Report issue** - Help improve detection by reporting false positives

## Best Practices

### For Repository Owners

1. **Keep config files in root** - Place framework config files in repository root
2. **Use standard names** - Use standard configuration file names
3. **Commit package.json** - Ensure package.json is committed with dependencies
4. **Clear structure** - Follow framework's recommended project structure

### For OpenPorter Users

1. **Verify detection** - Always verify auto-detected settings
2. **Manual override** - Don't hesitate to manually select framework
3. **Test build locally** - Ensure build works before deploying
4. **Check output directory** - Verify build output matches configured directory

## API Reference

### `detectFramework(files: string[]): DetectionResult | null`

Detects framework from list of file names.

**Parameters:**
- `files` - Array of file names (can include paths)

**Returns:**
- `DetectionResult` object with framework info and confidence, or
- `null` if no framework detected

**Example:**
```typescript
const result = detectFramework(['package.json', 'vite.config.ts']);
// { framework: {...}, confidence: 0.67, detectedFiles: ['package.json', 'vite.config.ts'] }
```

### `getFrameworkById(id: string): FrameworkInfo | undefined`

Gets framework information by ID.

**Parameters:**
- `id` - Framework identifier (e.g., 'react', 'vue', 'astro')

**Returns:**
- `FrameworkInfo` object or `undefined` if not found

**Example:**
```typescript
const react = getFrameworkById('react');
// { id: 'react', name: 'React', buildCommand: 'npm run build', ... }
```

### `getAllFrameworks(): FrameworkInfo[]`

Gets list of all supported frameworks.

**Returns:**
- Array of `FrameworkInfo` objects

**Example:**
```typescript
const frameworks = getAllFrameworks();
// [{ id: 'react', name: 'React', ... }, { id: 'vue', name: 'Vue', ... }, ...]
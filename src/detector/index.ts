export interface FrameworkInfo {
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

export interface DetectionResult {
  framework: FrameworkInfo;
  confidence: number;
  detectedFiles: string[];
}

export const frameworks: FrameworkInfo[] = [
  {
    id: 'react',
    name: 'React',
    icon: '⚛️',
    buildCommand: 'npm run build',
    outputDir: 'dist',
    installCommand: 'npm install',
    nodeVersion: '18.x',
    packageManager: 'npm',
    configFiles: ['package.json', 'vite.config.ts', 'vite.config.js'],
  },
  {
    id: 'vite',
    name: 'Vite',
    icon: '⚡',
    buildCommand: 'npm run build',
    outputDir: 'dist',
    installCommand: 'npm install',
    nodeVersion: '18.x',
    packageManager: 'npm',
    configFiles: ['vite.config.ts', 'vite.config.js'],
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: '▲',
    buildCommand: 'npm run build',
    outputDir: 'out',
    installCommand: 'npm install',
    nodeVersion: '18.x',
    packageManager: 'npm',
    configFiles: ['next.config.js', 'next.config.mjs', 'next.config.ts'],
  },
  {
    id: 'astro',
    name: 'Astro',
    icon: '🚀',
    buildCommand: 'npm run build',
    outputDir: 'dist',
    installCommand: 'npm install',
    nodeVersion: '18.x',
    packageManager: 'npm',
    configFiles: ['astro.config.mjs', 'astro.config.js', 'astro.config.ts'],
  },
  {
    id: 'vue',
    name: 'Vue',
    icon: '💚',
    buildCommand: 'npm run build',
    outputDir: 'dist',
    installCommand: 'npm install',
    nodeVersion: '18.x',
    packageManager: 'npm',
    configFiles: ['vue.config.js', 'vite.config.ts', 'vite.config.js'],
  },
  {
    id: 'svelte',
    name: 'Svelte',
    icon: '🔥',
    buildCommand: 'npm run build',
    outputDir: 'build',
    installCommand: 'npm install',
    nodeVersion: '18.x',
    packageManager: 'npm',
    configFiles: ['svelte.config.js', 'vite.config.ts', 'vite.config.js'],
  },
  {
    id: 'nuxt',
    name: 'Nuxt',
    icon: '💚',
    buildCommand: 'npm run generate',
    outputDir: 'dist',
    installCommand: 'npm install',
    nodeVersion: '18.x',
    packageManager: 'npm',
    configFiles: ['nuxt.config.ts', 'nuxt.config.js'],
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: '🅰️',
    buildCommand: 'ng build',
    outputDir: 'dist',
    installCommand: 'npm install',
    nodeVersion: '18.x',
    packageManager: 'npm',
    configFiles: ['angular.json'],
  },
  {
    id: 'hugo',
    name: 'Hugo',
    icon: '🐹',
    buildCommand: 'hugo',
    outputDir: 'public',
    installCommand: 'npm install',
    nodeVersion: '18.x',
    packageManager: 'npm',
    configFiles: ['hugo.toml', 'hugo.yaml', 'config.toml'],
  },
  {
    id: 'jekyll',
    name: 'Jekyll',
    icon: '💎',
    buildCommand: 'jekyll build',
    outputDir: '_site',
    installCommand: 'bundle install',
    nodeVersion: '18.x',
    packageManager: 'npm',
    configFiles: ['_config.yml'],
  },
  {
    id: 'docusaurus',
    name: 'Docusaurus',
    icon: '📚',
    buildCommand: 'npm run build',
    outputDir: 'build',
    installCommand: 'npm install',
    nodeVersion: '18.x',
    packageManager: 'npm',
    configFiles: ['docusaurus.config.js', 'docusaurus.config.ts'],
  },
  {
    id: 'mkdocs',
    name: 'MkDocs',
    icon: '📖',
    buildCommand: 'mkdocs build',
    outputDir: 'site',
    installCommand: 'pip install -r requirements.txt',
    nodeVersion: '18.x',
    packageManager: 'npm',
    configFiles: ['mkdocs.yml'],
  },
  {
    id: 'html',
    name: 'HTML',
    icon: '🌐',
    buildCommand: 'echo "No build step required"',
    outputDir: '.',
    installCommand: 'echo "No dependencies"',
    nodeVersion: '18.x',
    packageManager: 'npm',
    configFiles: ['index.html'],
  },
];

export function detectFramework(files: string[]): DetectionResult | null {
  const fileSet = new Set(files.map(f => f.toLowerCase()));
  
  let bestMatch: DetectionResult | null = null;
  let bestConfidence = 0;

  for (const framework of frameworks) {
    const matchedFiles = framework.configFiles.filter(f => 
      fileSet.has(f.toLowerCase())
    );
    
    if (matchedFiles.length > 0) {
      const confidence = matchedFiles.length / framework.configFiles.length;
      
      if (confidence > bestConfidence) {
        bestConfidence = confidence;
        bestMatch = {
          framework,
          confidence,
          detectedFiles: matchedFiles,
        };
      }
    }
  }

  return bestMatch;
}

export function getFrameworkById(id: string): FrameworkInfo | undefined {
  return frameworks.find(f => f.id === id);
}

export function getAllFrameworks(): FrameworkInfo[] {
  return frameworks;
}
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { detectFramework } from '../detector';
import { generateWorkflow } from '../workflow-generator';

interface InitOptions {
  yes: boolean;
}

export async function initCommand(options: InitOptions) {
  console.log(chalk.blue.bold('\n🚀 Welcome to OpenPorter!\n'));
  console.log('This will help you deploy your static site to GitHub Pages.\n');

  const answers = options.yes ? {
    repo: '',
    branch: 'main',
    framework: 'auto',
    nodeVersion: '20',
    packageManager: 'npm',
  } : await inquirer.prompt([
    {
      type: 'input',
      name: 'repo',
      message: 'GitHub repository (owner/repo):',
      validate: (input: string) => {
        if (input.match(/^[\w-]+\/[\w-]+$/)) return true;
        return 'Please enter in format: owner/repo';
      },
    },
    {
      type: 'list',
      name: 'branch',
      message: 'Branch to deploy from:',
      choices: ['main', 'master'],
      default: 'main',
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Framework:',
      choices: ['auto', 'react', 'vue', 'svelte', 'astro', 'nextjs', 'nuxt', 'hugo', 'jekyll', 'html'],
      default: 'auto',
    },
    {
      type: 'list',
      name: 'nodeVersion',
      message: 'Node.js version:',
      choices: ['18', '20', '22'],
      default: '20',
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Package manager:',
      choices: ['npm', 'yarn', 'pnpm', 'bun'],
      default: 'npm',
    },
  ]);

  const spinner = ora('Initializing OpenPorter...').start();

  try {
    // Create .github/workflows directory
    const workflowDir = path.join(process.cwd(), '.github', 'workflows');
    await fs.ensureDir(workflowDir);

    // Detect framework if auto
    let framework = answers.framework;
    if (framework === 'auto') {
      const files = await fs.readdir(process.cwd());
      const result = detectFramework(files);
      if (result) {
        framework = result.framework.id;
        spinner.succeed(`Detected framework: ${chalk.green(result.framework.name)}`);
      } else {
        framework = 'html';
        spinner.warn('No framework detected, using HTML');
      }
    }

    // Generate workflow
    const workflow = generateWorkflow({
      framework,
      buildCommand: 'npm run build',
      outputDir: 'dist',
      installCommand: 'npm install',
      nodeVersion: answers.nodeVersion,
      packageManager: answers.packageManager,
      branch: answers.branch,
    });

    // Write workflow file
    const workflowPath = path.join(workflowDir, 'openporter-deploy.yml');
    await fs.writeFile(workflowPath, workflow);

    // Create .openporter.json config
    const config = {
      repo: answers.repo,
      branch: answers.branch,
      framework,
      nodeVersion: answers.nodeVersion,
      packageManager: answers.packageManager,
    };
    await fs.writeJson(path.join(process.cwd(), '.openporter.json'), config, { spaces: 2 });

    spinner.succeed(chalk.green('OpenPorter initialized successfully!'));

    console.log(chalk.blue('\n📋 Next steps:'));
    console.log('1. Review the generated workflow: .github/workflows/openporter-deploy.yml');
    console.log('2. Commit and push the changes:');
    console.log(chalk.gray('   git add .github/workflows/openporter-deploy.yml .openporter.json'));
    console.log(chalk.gray('   git commit -m "Add OpenPorter deployment"'));
    console.log(chalk.gray('   git push origin ' + answers.branch));
    console.log('3. Enable GitHub Pages in your repository settings');
    console.log('4. Your site will be deployed automatically on every push!\n');

  } catch (error) {
    spinner.fail(chalk.red('Failed to initialize OpenPorter'));
    console.error(error);
    process.exit(1);
  }
}
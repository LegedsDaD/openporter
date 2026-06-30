import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

interface DeployOptions {
  message: string;
  build: boolean;
}

export async function deployCommand(options: DeployOptions) {
  console.log(chalk.blue.bold('\n🚀 Deploying to GitHub Pages\n'));

  // Check if .openporter.json exists
  const configPath = path.join(process.cwd(), '.openporter.json');
  if (!await fs.pathExists(configPath)) {
    console.log(chalk.yellow('⚠️  No .openporter.json found. Run "openporter init" first.'));
    process.exit(1);
  }

  const config = await fs.readJson(configPath);
  const spinner = ora('Preparing deployment...').start();

  try {
    // Build step
    if (options.build) {
      spinner.info('Building project...');
      try {
        execSync('npm run build', { cwd: process.cwd(), stdio: 'inherit' });
      } catch (error) {
        spinner.fail(chalk.red('Build failed'));
        process.exit(1);
      }
    }

    // Commit and push
    spinner.start('Committing changes...');
    
    const commands = [
      'git add .github/workflows/openporter-deploy.yml',
      `git commit -m "${options.message}"`,
      'git push origin ' + config.branch,
    ];

    for (const cmd of commands) {
      try {
        execSync(cmd, { cwd: process.cwd(), stdio: 'pipe' });
      } catch (error: unknown) {
        // Ignore if nothing to commit
        const err = error as { message?: string };
        if (cmd.includes('commit') && err.message?.includes('nothing to commit')) {
          console.log(chalk.yellow('Nothing to commit'));
        } else {
          throw error;
        }
      }
    }

    spinner.succeed(chalk.green('Deployment initiated!'));

    console.log(chalk.blue('\n📋 What happens next:'));
    console.log('1. GitHub Actions will automatically build and deploy your site');
    console.log('2. Check the status at: https://github.com/' + config.repo + '/actions');
    console.log('3. Your site will be available at: https://' + config.repo.split('/')[0] + '.github.io/' + config.repo.split('/')[1] + '/');
    console.log('4. Enable GitHub Pages in repository settings if not already enabled\n');

  } catch (error) {
    spinner.fail(chalk.red('Deployment failed'));
    console.error(error);
    process.exit(1);
  }
}
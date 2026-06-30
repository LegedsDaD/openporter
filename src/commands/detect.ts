import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import { detectFramework } from '../detector';

export async function detectCommand() {
  console.log(chalk.blue.bold('\n🔍 Detecting framework...\n'));

  const spinner = ora('Scanning project files...').start();

  try {
    const files = await fs.readdir(process.cwd());
    const result = detectFramework(files);

    if (result) {
      spinner.succeed(chalk.green('Framework detected!'));
      console.log(chalk.blue('\n📋 Detection Results:'));
      console.log(`  Framework: ${chalk.bold(result.framework.name)}`);
      console.log(`  Confidence: ${chalk.green((result.confidence * 100).toFixed(1) + '%')}`);
      console.log(`  Build Command: ${chalk.yellow(result.framework.buildCommand)}`);
      console.log(`  Output Directory: ${chalk.yellow(result.framework.outputDir)}`);
      console.log(`  Package Manager: ${chalk.yellow(result.framework.packageManager)}`);
      console.log(`  Node Version: ${chalk.yellow(result.framework.nodeVersion)}`);
      console.log(`\n  Detected files: ${chalk.gray(result.detectedFiles.join(', '))}\n`);
    } else {
      spinner.warn('No framework detected');
      console.log(chalk.yellow('\n💡 Tip: Use "openporter init" to manually configure\n'));
    }

  } catch (error) {
    spinner.fail(chalk.red('Detection failed'));
    console.error(error);
    process.exit(1);
  }
}
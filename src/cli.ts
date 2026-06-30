#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { deployCommand } from './commands/deploy';
import { detectCommand } from './commands/detect';
import { configCommand } from './commands/config';

const program = new Command();

program
  .name('openporter')
  .description('CLI tool to deploy static websites to GitHub Pages using GitHub Actions')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize OpenPorter in your project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(initCommand);

program
  .command('deploy')
  .description('Deploy your project to GitHub Pages')
  .option('-m, --message <message>', 'Commit message', 'Deploy to GitHub Pages')
  .option('--no-build', 'Skip build step')
  .action(deployCommand);

program
  .command('detect')
  .description('Detect framework in current project')
  .action(detectCommand);

program
  .command('config')
  .description('View or update configuration')
  .option('-s, --set <key=value>', 'Set configuration value')
  .action(configCommand);

program.parse();
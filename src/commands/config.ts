import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

export async function configCommand(options: { set?: string }) {
  const configPath = path.join(process.cwd(), '.openporter.json');

  if (options.set) {
    // Set configuration value
    const [key, value] = options.set.split('=');
    if (!key || !value) {
      console.log(chalk.red('❌ Invalid format. Use: openporter config -s key=value'));
      process.exit(1);
    }

    const config = await fs.readJson(configPath).catch(() => ({}));
    config[key] = value;
    await fs.writeJson(configPath, config, { spaces: 2 });
    
    console.log(chalk.green(`✅ Set ${key} = ${value}`));
  } else {
    // Show current configuration
    if (await fs.pathExists(configPath)) {
      const config = await fs.readJson(configPath);
      console.log(chalk.blue.bold('\n⚙️  OpenPorter Configuration:\n'));
      Object.entries(config).forEach(([key, value]) => {
        console.log(`  ${chalk.cyan(key)}: ${chalk.yellow(value)}`);
      });
      console.log(`\n  Config file: ${chalk.gray(configPath)}\n`);
    } else {
      console.log(chalk.yellow('⚠️  No configuration found. Run "openporter init" first.'));
    }
  }
}
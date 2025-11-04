#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { ConfigLoader } from './utils/ConfigLoader';
import { DiscoverCommand } from './commands/DiscoverCommand';
import { OutputFormatter } from './utils/OutputFormatter';
import * as fs from 'fs';

const program = new Command();

program
  .name('agent-detective')
  .description('CLI tool to discover and gather information about Microsoft 365 agents')
  .version('1.0.0');

program
  .command('discover')
  .description('Discover agents across Microsoft 365 tenant')
  .option('-t, --tenant-id <id>', 'Microsoft 365 Tenant ID')
  .option('-c, --client-id <id>', 'Azure AD Application Client ID')
  .option('-s, --client-secret <secret>', 'Azure AD Application Client Secret')
  .option('--config <path>', 'Path to configuration file')
  .option('--sharepoint-url <url>', 'SharePoint site URL for discovery')
  .option('--environment-id <id>', 'Power Platform environment ID')
  .option('--no-teams', 'Skip Teams agents discovery')
  .option('--no-sharepoint', 'Skip SharePoint agents discovery')
  .option('--no-copilot-studio', 'Skip Copilot Studio agents discovery')
  .option('--no-m365', 'Skip M365 Chat extensions discovery')
  .option(
    '-o, --output <format>',
    'Output format: table, json, csv, detailed',
    'table'
  )
  .option('-f, --file <path>', 'Write output to file instead of console')
  .action(async (options) => {
    try {
      console.log(chalk.bold.cyan('\n🔍 Agent Detective - Microsoft 365 Agents Discovery\n'));

      // Load configuration
      let config;
      if (options.config) {
        config = ConfigLoader.loadConfigFromFile(options.config);
      } else if (options.tenantId && options.clientId && options.clientSecret) {
        config = {
          tenantId: options.tenantId,
          clientId: options.clientId,
          clientSecret: options.clientSecret,
        };
      } else {
        config = ConfigLoader.loadConfig();
      }

      // Validate configuration
      ConfigLoader.validateConfig(config);

      // Create discover command
      const discoverCommand = new DiscoverCommand({
        tenantId: config.tenantId,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        sharePointUrl: options.sharePointUrl,
        environmentId: options.environmentId,
        includeTeams: options.teams,
        includeSharePoint: options.sharepoint,
        includeCopilotStudio: options.copilotStudio,
        includeM365: options.m365,
      });

      // Execute discovery
      const result = await discoverCommand.execute();

      // Format output
      let output: string;
      switch (options.output.toLowerCase()) {
        case 'json':
          output = OutputFormatter.formatAsJson(result);
          break;
        case 'csv':
          output = OutputFormatter.formatAsCsv(result);
          break;
        case 'detailed':
          output = OutputFormatter.formatAsDetailed(result);
          break;
        case 'table':
        default:
          output = OutputFormatter.formatAsTable(result);
          // Also show summary
          output += '\n' + OutputFormatter.getSummary(result);
          break;
      }

      // Write output
      if (options.file) {
        fs.writeFileSync(options.file, output, 'utf-8');
        console.log(chalk.green(`\n✓ Results saved to: ${options.file}\n`));
      } else {
        console.log(output);
      }

      if (result.totalCount === 0) {
        console.log(chalk.yellow('\n⚠ No agents found. This could mean:\n'));
        console.log(chalk.gray('  - No agents are deployed in your tenant'));
        console.log(chalk.gray('  - The app registration lacks required permissions'));
        console.log(chalk.gray('  - The specified filters excluded all agents\n'));
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error}\n`));
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize configuration file')
  .option('-o, --output <path>', 'Output path for config file', '.env')
  .action((options) => {
    const envTemplate = `# Microsoft 365 Tenant Configuration
# Get these values from Azure Portal > Azure Active Directory > App registrations

# Your Microsoft 365 Tenant ID
TENANT_ID=

# Application (client) ID from your app registration
CLIENT_ID=

# Client secret from your app registration
CLIENT_SECRET=

# Optional: SharePoint site URL for discovery
# SHAREPOINT_URL=https://yourtenant.sharepoint.com/sites/yoursite

# Optional: Power Platform environment ID
# ENVIRONMENT_ID=
`;

    fs.writeFileSync(options.output, envTemplate, 'utf-8');
    console.log(chalk.green(`\n✓ Configuration template created: ${options.output}`));
    console.log(chalk.cyan('\nNext steps:'));
    console.log(chalk.gray('  1. Edit the configuration file with your credentials'));
    console.log(chalk.gray('  2. Run: agent-detective discover\n'));
  });

program
  .command('setup')
  .description('Show setup instructions for Azure AD app registration')
  .action(() => {
    console.log(chalk.bold.cyan('\n📋 Setup Instructions\n'));
    console.log(chalk.bold('Step 1: Create an App Registration in Azure AD\n'));
    console.log(chalk.gray('  1. Go to Azure Portal (https://portal.azure.com)'));
    console.log(chalk.gray('  2. Navigate to Azure Active Directory > App registrations'));
    console.log(chalk.gray('  3. Click "New registration"'));
    console.log(chalk.gray('  4. Enter a name (e.g., "Agent Detective")'));
    console.log(chalk.gray('  5. Select "Accounts in this organizational directory only"'));
    console.log(chalk.gray('  6. Click "Register"\n'));

    console.log(chalk.bold('Step 2: Configure API Permissions\n'));
    console.log(chalk.gray('  Required Microsoft Graph API permissions (Application):'));
    console.log(chalk.gray('    - TeamsAppInstallation.ReadForUser.All'));
    console.log(chalk.gray('    - AppCatalog.Read.All'));
    console.log(chalk.gray('    - Application.Read.All\n'));
    console.log(chalk.gray('  Required SharePoint permissions (Application):'));
    console.log(chalk.gray('    - Sites.Read.All\n'));
    console.log(chalk.gray('  Required Power Platform permissions (Application):'));
    console.log(chalk.gray('    - Dataverse API access\n'));
    console.log(chalk.gray('  After adding permissions, click "Grant admin consent"\n'));

    console.log(chalk.bold('Step 3: Create a Client Secret\n'));
    console.log(chalk.gray('  1. Go to "Certificates & secrets"'));
    console.log(chalk.gray('  2. Click "New client secret"'));
    console.log(chalk.gray('  3. Add a description and set expiration'));
    console.log(chalk.gray('  4. Copy the secret value (you won\'t see it again!)\n'));

    console.log(chalk.bold('Step 4: Configure Agent Detective\n'));
    console.log(chalk.gray('  Run: agent-detective init'));
    console.log(chalk.gray('  Then edit the .env file with your values\n'));

    console.log(chalk.cyan('For more details, visit:'));
    console.log(chalk.blue('  https://github.com/stephanbisser/agent-detective\n'));
  });

program.parse();

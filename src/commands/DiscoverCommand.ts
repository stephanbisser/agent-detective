import { AuthProvider } from '../auth/AuthProvider';
import { GraphApiClient } from '../clients/GraphApiClient';
import { SharePointClient } from '../clients/SharePointClient';
import { CopilotStudioClient } from '../clients/CopilotStudioClient';
import { Agent, AgentDiscoveryResult } from '../models/Agent';
import ora from 'ora';
import chalk from 'chalk';

/**
 * Options for the discover command
 */
export interface DiscoverOptions {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  sharePointUrl?: string;
  environmentId?: string;
  includeTeams?: boolean;
  includeSharePoint?: boolean;
  includeCopilotStudio?: boolean;
  includeM365?: boolean;
}

/**
 * Command to discover agents across Microsoft 365
 */
export class DiscoverCommand {
  private authProvider: AuthProvider;
  private options: DiscoverOptions;

  constructor(options: DiscoverOptions) {
    this.options = options;
    this.authProvider = new AuthProvider(
      options.tenantId,
      options.clientId,
      options.clientSecret
    );
  }

  /**
   * Execute the discovery process
   */
  async execute(): Promise<AgentDiscoveryResult> {
    const agents: Agent[] = [];
    const errors: string[] = [];
    const spinner = ora('Discovering agents...').start();

    try {
      // Discover Teams agents
      if (this.options.includeTeams !== false) {
        spinner.text = 'Discovering Microsoft Teams agents...';
        try {
          const graphClient = new GraphApiClient(this.authProvider);
          const teamsAgents = await graphClient.discoverTeamsAgents();
          agents.push(...teamsAgents);
          spinner.succeed(
            chalk.green(`Found ${teamsAgents.length} Teams agents`)
          );
        } catch (error) {
          const errorMsg = `Error discovering Teams agents: ${error}`;
          errors.push(errorMsg);
          spinner.warn(chalk.yellow(errorMsg));
        }
      }

      // Discover M365 Chat extensions
      if (this.options.includeM365 !== false) {
        spinner.start('Discovering Microsoft 365 Chat extensions...');
        try {
          const graphClient = new GraphApiClient(this.authProvider);
          const m365Agents = await graphClient.discoverM365ChatExtensions();
          agents.push(...m365Agents);
          spinner.succeed(
            chalk.green(`Found ${m365Agents.length} M365 Chat extensions`)
          );
        } catch (error) {
          const errorMsg = `Error discovering M365 Chat extensions: ${error}`;
          errors.push(errorMsg);
          spinner.warn(chalk.yellow(errorMsg));
        }
      }

      // Discover SharePoint agents
      if (
        this.options.includeSharePoint !== false &&
        this.options.sharePointUrl
      ) {
        spinner.start('Discovering SharePoint declarative agents...');
        try {
          const spClient = new SharePointClient(this.authProvider);
          const spAgents = await spClient.discoverDeclarativeAgents(
            this.options.sharePointUrl
          );
          agents.push(...spAgents);
          spinner.succeed(
            chalk.green(`Found ${spAgents.length} SharePoint declarative agents`)
          );

          spinner.start('Discovering SPFx agents...');
          const spfxAgents = await spClient.discoverSPFxAgents(
            this.options.sharePointUrl
          );
          agents.push(...spfxAgents);
          spinner.succeed(
            chalk.green(`Found ${spfxAgents.length} SPFx agents`)
          );
        } catch (error) {
          const errorMsg = `Error discovering SharePoint agents: ${error}`;
          errors.push(errorMsg);
          spinner.warn(chalk.yellow(errorMsg));
        }
      }

      // Discover Copilot Studio agents
      if (this.options.includeCopilotStudio !== false) {
        spinner.start('Discovering Copilot Studio agents...');
        try {
          const copilotClient = new CopilotStudioClient(this.authProvider);
          const copilotAgents = await copilotClient.discoverCopilotStudioAgents(
            this.options.environmentId
          );
          agents.push(...copilotAgents);
          spinner.succeed(
            chalk.green(`Found ${copilotAgents.length} Copilot Studio agents`)
          );
        } catch (error) {
          const errorMsg = `Error discovering Copilot Studio agents: ${error}`;
          errors.push(errorMsg);
          spinner.warn(chalk.yellow(errorMsg));
        }
      }

      spinner.succeed(chalk.bold.green(`Discovery complete! Found ${agents.length} total agents`));
    } catch (error) {
      spinner.fail(chalk.red(`Discovery failed: ${error}`));
      errors.push(`Discovery failed: ${error}`);
    }

    return {
      agents,
      totalCount: agents.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date(),
    };
  }
}

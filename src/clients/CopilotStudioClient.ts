import axios, { AxiosInstance } from 'axios';
import { AuthProvider } from '../auth/AuthProvider';
import { Agent, AgentType, AgentPlatform } from '../models/Agent';

/**
 * Client for Copilot Studio (Power Virtual Agents) API
 */
export class CopilotStudioClient {
  private authProvider: AuthProvider;
  private axiosInstance: AxiosInstance;
  private baseUrl = 'https://api.powerplatform.com';

  constructor(authProvider: AuthProvider) {
    this.authProvider = authProvider;
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
    });
  }

  /**
   * Discover Copilot Studio bots/agents
   */
  async discoverCopilotStudioAgents(environmentId?: string): Promise<Agent[]> {
    try {
      const token = await this.authProvider.getPowerPlatformToken();
      const agents: Agent[] = [];

      // If no environment specified, list all environments first
      let environments: string[] = [];
      if (environmentId) {
        environments = [environmentId];
      } else {
        environments = await this.listEnvironments(token);
      }

      // For each environment, get the bots
      for (const envId of environments) {
        try {
          const bots = await this.getBotsInEnvironment(token, envId);
          agents.push(...bots);
        } catch (error) {
          console.error(`Error fetching bots from environment ${envId}:`, error);
        }
      }

      return agents;
    } catch (error) {
      console.error('Error discovering Copilot Studio agents:', error);
      return [];
    }
  }

  /**
   * List Power Platform environments
   */
  private async listEnvironments(token: string): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get('/v1/environments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.value) {
        return response.data.value.map((env: any) => env.name);
      }
      return [];
    } catch (error) {
      console.error('Error listing environments:', error);
      return [];
    }
  }

  /**
   * Get bots in a specific environment
   */
  private async getBotsInEnvironment(
    token: string,
    environmentId: string
  ): Promise<Agent[]> {
    try {
      // Power Virtual Agents API endpoint
      const response = await axios.get(
        `https://${environmentId}.api.powerplatform.com/powervirtualagents/bots`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            api_version: '2022-03-01-preview',
          },
        }
      );

      const agents: Agent[] = [];
      if (response.data && response.data.value) {
        for (const bot of response.data.value) {
          agents.push({
            id: bot.id,
            name: bot.name || bot.displayName,
            description: bot.description,
            type: this.determineBotType(bot),
            platform: AgentPlatform.COPILOT_STUDIO,
            status: bot.status,
            created: bot.createdTime ? new Date(bot.createdTime) : undefined,
            modified: bot.modifiedTime ? new Date(bot.modifiedTime) : undefined,
            metadata: {
              environmentId: environmentId,
              schemaName: bot.schemaName,
              language: bot.language,
              isClassic: bot.isClassic,
            },
          });
        }
      }

      return agents;
    } catch (error) {
      console.error(`Error getting bots in environment ${environmentId}:`, error);
      return [];
    }
  }

  /**
   * Determine if bot is lite or full version
   */
  private determineBotType(bot: any): AgentType {
    // Copilot Studio full has more advanced features
    if (bot.isClassic === false && bot.capabilities) {
      return AgentType.COPILOT_STUDIO_FULL;
    }
    return AgentType.COPILOT_STUDIO_LITE;
  }

  /**
   * Discover Dataverse-based agents
   */
  async discoverDataverseAgents(environmentUrl: string): Promise<Agent[]> {
    try {
      const token = await this.authProvider.getPowerPlatformToken();

      // Query Dataverse for bot entities
      const response = await axios.get(
        `${environmentUrl}/api/data/v9.2/bots`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
          },
          params: {
            $select: 'botid,name,description,createdon,modifiedon',
          },
        }
      );

      const agents: Agent[] = [];
      if (response.data && response.data.value) {
        for (const bot of response.data.value) {
          agents.push({
            id: bot.botid,
            name: bot.name,
            description: bot.description,
            type: AgentType.COPILOT_STUDIO_FULL,
            platform: AgentPlatform.POWER_PLATFORM,
            created: bot.createdon ? new Date(bot.createdon) : undefined,
            modified: bot.modifiedon ? new Date(bot.modifiedon) : undefined,
            metadata: {
              source: 'Dataverse',
            },
          });
        }
      }

      return agents;
    } catch (error) {
      console.error('Error discovering Dataverse agents:', error);
      return [];
    }
  }
}

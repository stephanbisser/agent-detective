import axios, { AxiosInstance } from 'axios';
import { AuthProvider } from '../auth/AuthProvider';
import { Agent, AgentType, AgentPlatform } from '../models/Agent';

/**
 * Client for Microsoft Graph API to discover agents
 */
export class GraphApiClient {
  private authProvider: AuthProvider;
  private axiosInstance: AxiosInstance;
  private baseUrl = 'https://graph.microsoft.com/v1.0';

  constructor(authProvider: AuthProvider) {
    this.authProvider = authProvider;
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
    });
  }

  /**
   * Discover Teams apps that might be agents
   */
  async discoverTeamsAgents(): Promise<Agent[]> {
    try {
      const token = await this.authProvider.getGraphToken();
      const response = await this.axiosInstance.get('/appCatalogs/teamsApps', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          $filter: "distributionMethod eq 'organization' or distributionMethod eq 'sideloaded'",
        },
      });

      const agents: Agent[] = [];
      if (response.data && response.data.value) {
        for (const app of response.data.value) {
          // Check if this is an agent-type app based on description or capabilities
          if (this.isAgentApp(app)) {
            agents.push({
              id: app.id,
              name: app.displayName,
              description: app.description,
              type: AgentType.DECLARATIVE,
              platform: AgentPlatform.TEAMS,
              metadata: {
                distributionMethod: app.distributionMethod,
                version: app.version,
              },
            });
          }
        }
      }

      return agents;
    } catch (error) {
      console.error('Error discovering Teams agents:', error);
      return [];
    }
  }

  /**
   * Discover Microsoft 365 Chat extensions (declarative agents)
   */
  async discoverM365ChatExtensions(): Promise<Agent[]> {
    try {
      const token = await this.authProvider.getGraphToken();
      // Microsoft 365 Chat extensions can be discovered via Graph API beta endpoint
      const response = await this.axiosInstance.get(
        'https://graph.microsoft.com/beta/appCatalogs/teamsApps',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            $expand: 'appDefinitions',
            $filter: "appDefinitions/any(a:a/publishingState eq 'published')",
          },
        }
      );

      const agents: Agent[] = [];
      if (response.data && response.data.value) {
        for (const app of response.data.value) {
          if (app.appDefinitions) {
            for (const definition of app.appDefinitions) {
              // Check for declarative agent indicators
              if (
                definition.authorization ||
                definition.staticTabs ||
                this.hasAgentCapabilities(definition)
              ) {
                agents.push({
                  id: app.id,
                  name: app.displayName,
                  description: app.description,
                  type: AgentType.DECLARATIVE,
                  platform: AgentPlatform.M365_AGENTS,
                  metadata: {
                    version: definition.version,
                    publishingState: definition.publishingState,
                    capabilities: this.extractCapabilities(definition),
                  },
                });
                break; // Only add once per app
              }
            }
          }
        }
      }

      return agents;
    } catch (error) {
      console.error('Error discovering M365 Chat extensions:', error);
      return [];
    }
  }

  /**
   * Helper to check if a Teams app is an agent
   */
  private isAgentApp(app: any): boolean {
    const agentKeywords = ['copilot', 'agent', 'assistant', 'bot'];
    const appName = (app.displayName || '').toLowerCase();
    const appDesc = (app.description || '').toLowerCase();

    return agentKeywords.some(
      (keyword) => appName.includes(keyword) || appDesc.includes(keyword)
    );
  }

  /**
   * Helper to check if app definition has agent capabilities
   */
  private hasAgentCapabilities(definition: any): boolean {
    return (
      definition.authorization ||
      definition.bots ||
      definition.connectors ||
      definition.composeExtensions
    );
  }

  /**
   * Extract capabilities from app definition
   */
  private extractCapabilities(definition: any): string[] {
    const capabilities: string[] = [];
    if (definition.bots) capabilities.push('Bot');
    if (definition.composeExtensions) capabilities.push('Message Extension');
    if (definition.connectors) capabilities.push('Connector');
    if (definition.staticTabs) capabilities.push('Tab');
    if (definition.authorization) capabilities.push('Authorization');
    return capabilities;
  }
}

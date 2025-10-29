import axios, { AxiosInstance } from 'axios';
import { AuthProvider } from '../auth/AuthProvider';
import { Agent, AgentType, AgentPlatform } from '../models/Agent';

/**
 * Client for SharePoint REST API to discover declarative agents
 */
export class SharePointClient {
  private authProvider: AuthProvider;
  private axiosInstance: AxiosInstance;

  constructor(authProvider: AuthProvider) {
    this.authProvider = authProvider;
    this.axiosInstance = axios.create();
  }

  /**
   * Discover declarative agents in SharePoint site
   */
  async discoverDeclarativeAgents(siteUrl: string): Promise<Agent[]> {
    try {
      const token = await this.authProvider.getSharePointToken(siteUrl);
      
      // Query the app catalog for declarative agents
      const appsResponse = await this.axiosInstance.get(
        `${siteUrl}/_api/web/tenantappcatalog/AvailableApps`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json;odata=verbose',
          },
        }
      );

      const agents: Agent[] = [];
      if (appsResponse.data && appsResponse.data.d && appsResponse.data.d.results) {
        for (const app of appsResponse.data.d.results) {
          // Filter for declarative agents
          if (this.isDeclarativeAgent(app)) {
            agents.push({
              id: app.ID || app.Id,
              name: app.Title,
              description: app.Description,
              type: AgentType.DECLARATIVE,
              platform: AgentPlatform.SHAREPOINT,
              metadata: {
                appCatalogVersion: app.AppCatalogVersion,
                deployed: app.Deployed,
                installedVersion: app.InstalledVersion,
              },
            });
          }
        }
      }

      return agents;
    } catch (error) {
      console.error('Error discovering SharePoint agents:', error);
      return [];
    }
  }

  /**
   * Discover SPFx components that might be agents
   */
  async discoverSPFxAgents(siteUrl: string): Promise<Agent[]> {
    try {
      const token = await this.authProvider.getSharePointToken(siteUrl);

      // Query for SPFx solutions
      const response = await this.axiosInstance.get(
        `${siteUrl}/_api/web/lists/getbytitle('Apps for SharePoint')/items`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json;odata=nometadata',
          },
          params: {
            $select: 'Title,Id,AppDescription,AppVersion',
          },
        }
      );

      const agents: Agent[] = [];
      if (response.data && response.data.value) {
        for (const item of response.data.value) {
          if (this.isSPFxAgent(item)) {
            agents.push({
              id: item.Id.toString(),
              name: item.Title,
              description: item.AppDescription,
              type: AgentType.CUSTOM_ENGINE,
              platform: AgentPlatform.SHAREPOINT,
              metadata: {
                version: item.AppVersion,
                framework: 'SPFx',
              },
            });
          }
        }
      }

      return agents;
    } catch (error) {
      console.error('Error discovering SPFx agents:', error);
      return [];
    }
  }

  /**
   * Helper to check if app is a declarative agent
   */
  private isDeclarativeAgent(app: any): boolean {
    const agentIndicators = ['copilot', 'agent', 'declarative'];
    const title = (app.Title || '').toLowerCase();
    const description = (app.Description || '').toLowerCase();

    return agentIndicators.some(
      (indicator) => title.includes(indicator) || description.includes(indicator)
    );
  }

  /**
   * Helper to check if SPFx component is an agent
   */
  private isSPFxAgent(item: any): boolean {
    const agentKeywords = ['copilot', 'agent', 'assistant'];
    const title = (item.Title || '').toLowerCase();
    const description = (item.AppDescription || '').toLowerCase();

    return agentKeywords.some(
      (keyword) => title.includes(keyword) || description.includes(keyword)
    );
  }
}

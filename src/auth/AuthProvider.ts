import * as msal from '@azure/msal-node';

/**
 * Authentication provider for Microsoft 365 APIs
 */
export class AuthProvider {
  private msalClient: msal.ConfidentialClientApplication;
  private tenantId: string;
  private clientId: string;
  private clientSecret: string;

  constructor(tenantId: string, clientId: string, clientSecret: string) {
    this.tenantId = tenantId;
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    const msalConfig: msal.Configuration = {
      auth: {
        clientId: this.clientId,
        authority: `https://login.microsoftonline.com/${this.tenantId}`,
        clientSecret: this.clientSecret,
      },
    };

    this.msalClient = new msal.ConfidentialClientApplication(msalConfig);
  }

  /**
   * Get an access token for the specified scopes
   */
  async getAccessToken(scopes: string[]): Promise<string> {
    try {
      const result = await this.msalClient.acquireTokenByClientCredential({
        scopes: scopes,
      });

      if (!result || !result.accessToken) {
        throw new Error('Failed to acquire access token');
      }

      return result.accessToken;
    } catch (error) {
      throw new Error(`Authentication failed: ${error}`);
    }
  }

  /**
   * Get an access token for Microsoft Graph API
   */
  async getGraphToken(): Promise<string> {
    return this.getAccessToken(['https://graph.microsoft.com/.default']);
  }

  /**
   * Get an access token for SharePoint API
   */
  async getSharePointToken(siteUrl: string): Promise<string> {
    const url = new URL(siteUrl);
    const resource = `${url.protocol}//${url.hostname}`;
    return this.getAccessToken([`${resource}/.default`]);
  }

  /**
   * Get an access token for Power Platform API
   */
  async getPowerPlatformToken(): Promise<string> {
    return this.getAccessToken(['https://api.powerplatform.com/.default']);
  }
}

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { AgentDiscoveryConfig } from '../models/Agent';

/**
 * Loads configuration from environment variables and config files
 */
export class ConfigLoader {
  /**
   * Load configuration from .env file and environment variables
   */
  static loadConfig(): AgentDiscoveryConfig {
    // Load .env file if it exists
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
    }

    const tenantId = process.env.TENANT_ID || '';
    const clientId = process.env.CLIENT_ID || '';
    const clientSecret = process.env.CLIENT_SECRET || '';

    if (!tenantId || !clientId || !clientSecret) {
      throw new Error(
        'Missing required configuration. Please set TENANT_ID, CLIENT_ID, and CLIENT_SECRET in .env file or environment variables.'
      );
    }

    return {
      tenantId,
      clientId,
      clientSecret,
    };
  }

  /**
   * Load configuration from a JSON file
   */
  static loadConfigFromFile(filePath: string): AgentDiscoveryConfig {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Configuration file not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const config = JSON.parse(fileContent);

    if (!config.tenantId || !config.clientId || !config.clientSecret) {
      throw new Error(
        'Invalid configuration file. Required fields: tenantId, clientId, clientSecret'
      );
    }

    return config;
  }

  /**
   * Validate configuration
   */
  static validateConfig(config: AgentDiscoveryConfig): boolean {
    if (!config.tenantId || !config.clientId) {
      return false;
    }

    // Validate tenant ID format (GUID)
    const guidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!guidRegex.test(config.tenantId)) {
      throw new Error('Invalid tenant ID format. Expected a GUID.');
    }

    if (!guidRegex.test(config.clientId)) {
      throw new Error('Invalid client ID format. Expected a GUID.');
    }

    return true;
  }
}

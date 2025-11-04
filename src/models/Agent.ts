/**
 * Represents a Microsoft 365 agent
 */
export interface Agent {
  id: string;
  name: string;
  description?: string;
  type: AgentType;
  platform: AgentPlatform;
  owner?: string;
  created?: Date;
  modified?: Date;
  status?: string;
  capabilities?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Types of agents that can be discovered
 */
export enum AgentType {
  DECLARATIVE = 'Declarative',
  COPILOT_STUDIO_LITE = 'Copilot Studio Lite',
  COPILOT_STUDIO_FULL = 'Copilot Studio Full',
  CUSTOM_ENGINE = 'Custom Engine',
  M365_TOOLKIT = 'M365 Agents Toolkit',
  OTHER = 'Other'
}

/**
 * Platforms where agents can be hosted
 */
export enum AgentPlatform {
  SHAREPOINT = 'SharePoint',
  COPILOT_STUDIO = 'Copilot Studio',
  TEAMS = 'Microsoft Teams',
  M365_AGENTS = 'Microsoft 365 Agents',
  POWER_PLATFORM = 'Power Platform',
  AZURE = 'Azure',
  OTHER = 'Other'
}

/**
 * Configuration for agent discovery
 */
export interface AgentDiscoveryConfig {
  tenantId: string;
  clientId: string;
  clientSecret?: string;
  scopes?: string[];
  includeTypes?: AgentType[];
  includePlatforms?: AgentPlatform[];
}

/**
 * Result of agent discovery operation
 */
export interface AgentDiscoveryResult {
  agents: Agent[];
  totalCount: number;
  errors?: string[];
  timestamp: Date;
}

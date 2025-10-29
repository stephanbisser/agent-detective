# Agent Detective - API Documentation

This document describes the programmatic API for using Agent Detective as a library in your Node.js applications.

## Installation

```bash
npm install agent-detective
```

## Quick Start

```typescript
import { DiscoverCommand, OutputFormatter } from 'agent-detective';

const command = new DiscoverCommand({
  tenantId: 'your-tenant-id',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
});

const result = await command.execute();
console.log(OutputFormatter.formatAsJson(result));
```

## Core Classes

### DiscoverCommand

Main command class for discovering agents.

#### Constructor

```typescript
constructor(options: DiscoverOptions)
```

**DiscoverOptions:**
```typescript
interface DiscoverOptions {
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
```

#### Methods

##### execute()

Executes the agent discovery process.

```typescript
async execute(): Promise<AgentDiscoveryResult>
```

**Returns:** `AgentDiscoveryResult`

**Example:**
```typescript
const command = new DiscoverCommand({
  tenantId: 'abc-123',
  clientId: 'def-456',
  clientSecret: 'secret',
  includeTeams: true,
  includeSharePoint: false
});

const result = await command.execute();
console.log(`Found ${result.totalCount} agents`);
```

### AuthProvider

Handles authentication to Microsoft 365 APIs.

#### Constructor

```typescript
constructor(tenantId: string, clientId: string, clientSecret: string)
```

#### Methods

##### getAccessToken()

Get an access token for specified scopes.

```typescript
async getAccessToken(scopes: string[]): Promise<string>
```

**Parameters:**
- `scopes` - Array of OAuth scopes

**Returns:** Access token string

**Example:**
```typescript
const auth = new AuthProvider('tenant-id', 'client-id', 'secret');
const token = await auth.getAccessToken(['https://graph.microsoft.com/.default']);
```

##### getGraphToken()

Get an access token for Microsoft Graph API.

```typescript
async getGraphToken(): Promise<string>
```

##### getSharePointToken()

Get an access token for SharePoint API.

```typescript
async getSharePointToken(siteUrl: string): Promise<string>
```

##### getPowerPlatformToken()

Get an access token for Power Platform API.

```typescript
async getPowerPlatformToken(): Promise<string>
```

### GraphApiClient

Client for Microsoft Graph API operations.

#### Constructor

```typescript
constructor(authProvider: AuthProvider)
```

#### Methods

##### discoverTeamsAgents()

Discover Teams apps that might be agents.

```typescript
async discoverTeamsAgents(): Promise<Agent[]>
```

**Returns:** Array of discovered Teams agents

**Example:**
```typescript
const auth = new AuthProvider('tenant', 'client', 'secret');
const client = new GraphApiClient(auth);
const agents = await client.discoverTeamsAgents();
```

##### discoverM365ChatExtensions()

Discover Microsoft 365 Chat extensions (declarative agents).

```typescript
async discoverM365ChatExtensions(): Promise<Agent[]>
```

### SharePointClient

Client for SharePoint REST API operations.

#### Constructor

```typescript
constructor(authProvider: AuthProvider)
```

#### Methods

##### discoverDeclarativeAgents()

Discover declarative agents in SharePoint site.

```typescript
async discoverDeclarativeAgents(siteUrl: string): Promise<Agent[]>
```

**Parameters:**
- `siteUrl` - SharePoint site URL

**Example:**
```typescript
const auth = new AuthProvider('tenant', 'client', 'secret');
const client = new SharePointClient(auth);
const agents = await client.discoverDeclarativeAgents(
  'https://contoso.sharepoint.com/sites/apps'
);
```

##### discoverSPFxAgents()

Discover SPFx components that might be agents.

```typescript
async discoverSPFxAgents(siteUrl: string): Promise<Agent[]>
```

### CopilotStudioClient

Client for Copilot Studio (Power Virtual Agents) API.

#### Constructor

```typescript
constructor(authProvider: AuthProvider)
```

#### Methods

##### discoverCopilotStudioAgents()

Discover Copilot Studio bots/agents.

```typescript
async discoverCopilotStudioAgents(environmentId?: string): Promise<Agent[]>
```

**Parameters:**
- `environmentId` - (Optional) Specific Power Platform environment ID

**Example:**
```typescript
const auth = new AuthProvider('tenant', 'client', 'secret');
const client = new CopilotStudioClient(auth);
const agents = await client.discoverCopilotStudioAgents();
```

##### discoverDataverseAgents()

Discover Dataverse-based agents.

```typescript
async discoverDataverseAgents(environmentUrl: string): Promise<Agent[]>
```

### OutputFormatter

Formats agent discovery results.

#### Methods

##### formatAsTable()

Format results as a console table.

```typescript
static formatAsTable(result: AgentDiscoveryResult): string
```

**Example:**
```typescript
const output = OutputFormatter.formatAsTable(result);
console.log(output);
```

##### formatAsJson()

Format results as JSON.

```typescript
static formatAsJson(result: AgentDiscoveryResult): string
```

##### formatAsCsv()

Format results as CSV.

```typescript
static formatAsCsv(result: AgentDiscoveryResult): string
```

##### formatAsDetailed()

Format results as detailed text.

```typescript
static formatAsDetailed(result: AgentDiscoveryResult): string
```

##### getSummary()

Get summary statistics.

```typescript
static getSummary(result: AgentDiscoveryResult): string
```

### ConfigLoader

Loads and validates configuration.

#### Methods

##### loadConfig()

Load configuration from .env file and environment variables.

```typescript
static loadConfig(): AgentDiscoveryConfig
```

**Example:**
```typescript
const config = ConfigLoader.loadConfig();
```

##### loadConfigFromFile()

Load configuration from a JSON file.

```typescript
static loadConfigFromFile(filePath: string): AgentDiscoveryConfig
```

##### validateConfig()

Validate configuration.

```typescript
static validateConfig(config: AgentDiscoveryConfig): boolean
```

## Data Types

### Agent

Represents a Microsoft 365 agent.

```typescript
interface Agent {
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
```

### AgentType

Types of agents.

```typescript
enum AgentType {
  DECLARATIVE = 'Declarative',
  COPILOT_STUDIO_LITE = 'Copilot Studio Lite',
  COPILOT_STUDIO_FULL = 'Copilot Studio Full',
  CUSTOM_ENGINE = 'Custom Engine',
  M365_TOOLKIT = 'M365 Agents Toolkit',
  OTHER = 'Other'
}
```

### AgentPlatform

Platforms where agents can be hosted.

```typescript
enum AgentPlatform {
  SHAREPOINT = 'SharePoint',
  COPILOT_STUDIO = 'Copilot Studio',
  TEAMS = 'Microsoft Teams',
  M365_AGENTS = 'Microsoft 365 Agents',
  POWER_PLATFORM = 'Power Platform',
  AZURE = 'Azure',
  OTHER = 'Other'
}
```

### AgentDiscoveryConfig

Configuration for agent discovery.

```typescript
interface AgentDiscoveryConfig {
  tenantId: string;
  clientId: string;
  clientSecret?: string;
  scopes?: string[];
  includeTypes?: AgentType[];
  includePlatforms?: AgentPlatform[];
}
```

### AgentDiscoveryResult

Result of agent discovery operation.

```typescript
interface AgentDiscoveryResult {
  agents: Agent[];
  totalCount: number;
  errors?: string[];
  timestamp: Date;
}
```

## Usage Examples

### Basic Discovery

```typescript
import { DiscoverCommand } from 'agent-detective';

async function discoverAgents() {
  const command = new DiscoverCommand({
    tenantId: process.env.TENANT_ID!,
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!
  });

  const result = await command.execute();
  
  console.log(`Found ${result.totalCount} agents`);
  result.agents.forEach(agent => {
    console.log(`- ${agent.name} (${agent.type})`);
  });
}
```

### Filtered Discovery

```typescript
import { DiscoverCommand } from 'agent-detective';

async function discoverTeamsOnly() {
  const command = new DiscoverCommand({
    tenantId: process.env.TENANT_ID!,
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    includeTeams: true,
    includeSharePoint: false,
    includeCopilotStudio: false,
    includeM365: false
  });

  const result = await command.execute();
  return result.agents;
}
```

### Custom Output Processing

```typescript
import { DiscoverCommand, AgentType } from 'agent-detective';

async function getCopilotStudioAgents() {
  const command = new DiscoverCommand({
    tenantId: process.env.TENANT_ID!,
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!
  });

  const result = await command.execute();
  
  // Filter for Copilot Studio agents only
  const copilotAgents = result.agents.filter(
    agent => agent.type === AgentType.COPILOT_STUDIO_FULL ||
             agent.type === AgentType.COPILOT_STUDIO_LITE
  );
  
  return copilotAgents;
}
```

### Using Individual Clients

```typescript
import { AuthProvider, GraphApiClient, SharePointClient } from 'agent-detective';

async function customDiscovery() {
  // Initialize auth
  const auth = new AuthProvider(
    process.env.TENANT_ID!,
    process.env.CLIENT_ID!,
    process.env.CLIENT_SECRET!
  );

  // Use Graph API client
  const graphClient = new GraphApiClient(auth);
  const teamsAgents = await graphClient.discoverTeamsAgents();
  
  // Use SharePoint client
  const spClient = new SharePointClient(auth);
  const spAgents = await spClient.discoverDeclarativeAgents(
    'https://contoso.sharepoint.com'
  );

  return [...teamsAgents, ...spAgents];
}
```

### Exporting to File

```typescript
import { DiscoverCommand, OutputFormatter } from 'agent-detective';
import * as fs from 'fs';

async function exportToFile() {
  const command = new DiscoverCommand({
    tenantId: process.env.TENANT_ID!,
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!
  });

  const result = await command.execute();
  
  // Export as JSON
  const json = OutputFormatter.formatAsJson(result);
  fs.writeFileSync('agents.json', json);
  
  // Export as CSV
  const csv = OutputFormatter.formatAsCsv(result);
  fs.writeFileSync('agents.csv', csv);
  
  console.log('Results exported to agents.json and agents.csv');
}
```

### Error Handling

```typescript
import { DiscoverCommand } from 'agent-detective';

async function discoverWithErrorHandling() {
  try {
    const command = new DiscoverCommand({
      tenantId: process.env.TENANT_ID!,
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!
    });

    const result = await command.execute();
    
    if (result.errors && result.errors.length > 0) {
      console.warn('Discovery completed with errors:');
      result.errors.forEach(error => console.warn(`  - ${error}`));
    }
    
    return result;
  } catch (error) {
    console.error('Discovery failed:', error);
    throw error;
  }
}
```

### TypeScript Integration

```typescript
import {
  Agent,
  AgentType,
  AgentPlatform,
  AgentDiscoveryResult,
  DiscoverCommand
} from 'agent-detective';

interface AgentReport {
  totalAgents: number;
  byType: Record<AgentType, number>;
  byPlatform: Record<AgentPlatform, number>;
}

async function generateReport(): Promise<AgentReport> {
  const command = new DiscoverCommand({
    tenantId: process.env.TENANT_ID!,
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!
  });

  const result: AgentDiscoveryResult = await command.execute();
  
  const byType: Record<string, number> = {};
  const byPlatform: Record<string, number> = {};
  
  result.agents.forEach((agent: Agent) => {
    byType[agent.type] = (byType[agent.type] || 0) + 1;
    byPlatform[agent.platform] = (byPlatform[agent.platform] || 0) + 1;
  });
  
  return {
    totalAgents: result.totalCount,
    byType: byType as Record<AgentType, number>,
    byPlatform: byPlatform as Record<AgentPlatform, number>
  };
}
```

## Configuration

### Environment Variables

```bash
TENANT_ID=your-tenant-id
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
SHAREPOINT_URL=https://contoso.sharepoint.com
ENVIRONMENT_ID=your-environment-id
```

### Configuration File

```json
{
  "tenantId": "your-tenant-id",
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret"
}
```

## Error Types

The library may throw the following errors:

- **Authentication Error** - Invalid credentials or expired token
- **Configuration Error** - Missing or invalid configuration
- **API Error** - Microsoft API returned an error
- **Network Error** - Connection issues

## Best Practices

1. **Secure Secrets** - Never hardcode credentials
2. **Error Handling** - Always handle potential errors
3. **Token Caching** - MSAL handles this automatically
4. **Rate Limiting** - Be aware of API rate limits
5. **Logging** - Use structured logging for production
6. **Testing** - Test with a dedicated test tenant

## Support

For issues or questions:
- GitHub Issues: https://github.com/stephanbisser/agent-detective/issues
- Documentation: https://github.com/stephanbisser/agent-detective

## License

MIT License

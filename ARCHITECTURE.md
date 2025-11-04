# Agent Detective - Architecture Documentation

## Overview

Agent Detective is a CLI tool built with TypeScript and Node.js that discovers Microsoft 365 agents across multiple platforms using various Microsoft APIs.

## Design Principles

1. **Modular Architecture** - Separated concerns with dedicated modules for auth, API clients, commands, and utilities
2. **Extensibility** - Easy to add new agent types and platforms
3. **Error Resilience** - Graceful handling of API failures with detailed error reporting
4. **Flexibility** - Multiple configuration options and output formats
5. **Security** - Uses Azure AD app-only authentication with proper secret management

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLI Interface                            │
│                        (cli.ts)                                  │
│  Commands: discover, init, setup                                │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Command Layer                                 │
│                  (commands/)                                     │
│  ┌─────────────────────────────────────────────────────┐        │
│  │         DiscoverCommand                              │        │
│  │  - Orchestrates discovery across platforms           │        │
│  │  - Aggregates results                                │        │
│  │  - Handles errors                                    │        │
│  └─────────────────────────────────────────────────────┘        │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Authentication Layer                            │
│                     (auth/)                                      │
│  ┌─────────────────────────────────────────────────────┐        │
│  │         AuthProvider                                 │        │
│  │  - Azure AD authentication (MSAL)                    │        │
│  │  - Token acquisition and caching                     │        │
│  │  - Multi-resource support                            │        │
│  └─────────────────────────────────────────────────────┘        │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Client Layer                              │
│                    (clients/)                                    │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐      │
│  │ GraphApi     │  │ SharePoint   │  │ CopilotStudio    │      │
│  │ Client       │  │ Client       │  │ Client           │      │
│  │              │  │              │  │                  │      │
│  │ - Teams apps │  │ - Declarative│  │ - PVA bots      │      │
│  │ - M365 Chat  │  │   agents     │  │ - Dataverse     │      │
│  │   extensions │  │ - SPFx apps  │  │   agents        │      │
│  └──────────────┘  └──────────────┘  └──────────────────┘      │
└─────────┬─────────────────┬──────────────────┬──────────────────┘
          │                 │                  │
          ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                   External APIs                                  │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐      │
│  │ Microsoft    │  │ SharePoint   │  │ Power Platform   │      │
│  │ Graph API    │  │ REST API     │  │ API              │      │
│  │              │  │              │  │                  │      │
│  │ graph.       │  │ /_api/...    │  │ api.powerplatform│     │
│  │ microsoft.com│  │              │  │ .com             │      │
│  └──────────────┘  └──────────────┘  └──────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
          │                 │                  │
          └─────────────────┴──────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Models                                 │
│                      (models/)                                   │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  Agent, AgentType, AgentPlatform                     │        │
│  │  AgentDiscoveryConfig, AgentDiscoveryResult          │        │
│  └─────────────────────────────────────────────────────┘        │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Utilities                                    │
│                     (utils/)                                     │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │ ConfigLoader │  │ Output       │                             │
│  │              │  │ Formatter    │                             │
│  │ - .env files │  │              │                             │
│  │ - JSON config│  │ - Table      │                             │
│  │ - Validation │  │ - JSON       │                             │
│  │              │  │ - CSV        │                             │
│  │              │  │ - Detailed   │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. CLI Interface (`cli.ts`)

**Responsibilities:**
- Parse command-line arguments
- Route to appropriate commands
- Handle top-level errors
- Display help and version information

**Commands:**
- `discover` - Main command to discover agents
- `init` - Initialize configuration file
- `setup` - Display setup instructions

### 2. Command Layer (`commands/`)

#### DiscoverCommand
Orchestrates the agent discovery process across multiple platforms.

**Key Methods:**
- `execute()` - Main entry point for discovery
- Calls individual API clients
- Aggregates results
- Handles errors gracefully

**Flow:**
1. Initialize authentication
2. Discover Teams agents (if enabled)
3. Discover M365 Chat extensions (if enabled)
4. Discover SharePoint agents (if enabled)
5. Discover Copilot Studio agents (if enabled)
6. Aggregate and return results

### 3. Authentication Layer (`auth/`)

#### AuthProvider
Handles authentication to Microsoft 365 APIs using Azure AD.

**Authentication Method:**
- Client credentials flow (app-only authentication)
- Uses MSAL (Microsoft Authentication Library)

**Key Methods:**
- `getAccessToken(scopes)` - Get token for specific scopes
- `getGraphToken()` - Get token for Microsoft Graph
- `getSharePointToken(siteUrl)` - Get token for SharePoint
- `getPowerPlatformToken()` - Get token for Power Platform

**Token Management:**
- MSAL handles token caching automatically
- Tokens are refreshed as needed

### 4. API Client Layer (`clients/`)

#### GraphApiClient
Interacts with Microsoft Graph API to discover Teams apps and M365 Chat extensions.

**Endpoints Used:**
- `/v1.0/appCatalogs/teamsApps` - List Teams apps
- `/beta/appCatalogs/teamsApps` - List with extended metadata

**Discovery Logic:**
- Filters for organization/sideloaded apps
- Identifies agent-like apps by keywords and capabilities
- Extracts capabilities from app definitions

#### SharePointClient
Interacts with SharePoint REST API to discover declarative agents and SPFx solutions.

**Endpoints Used:**
- `/_api/web/tenantappcatalog/AvailableApps` - App catalog
- `/_api/web/lists/getbytitle('Apps for SharePoint')/items` - SPFx apps

**Discovery Logic:**
- Queries tenant app catalog
- Filters for declarative agent indicators
- Identifies SPFx components with agent capabilities

#### CopilotStudioClient
Interacts with Power Platform API to discover Copilot Studio bots.

**Endpoints Used:**
- `/v1/environments` - List environments
- `/powervirtualagents/bots` - List bots in environment
- `/api/data/v9.2/bots` - Dataverse bot entities

**Discovery Logic:**
- Lists all Power Platform environments
- Queries each environment for bots
- Determines bot type (lite vs full)
- Queries Dataverse for additional agents

### 5. Data Models (`models/`)

#### Core Types

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

enum AgentType {
  DECLARATIVE
  COPILOT_STUDIO_LITE
  COPILOT_STUDIO_FULL
  CUSTOM_ENGINE
  M365_TOOLKIT
  OTHER
}

enum AgentPlatform {
  SHAREPOINT
  COPILOT_STUDIO
  TEAMS
  M365_AGENTS
  POWER_PLATFORM
  AZURE
  OTHER
}
```

### 6. Utilities (`utils/`)

#### ConfigLoader
Loads and validates configuration from multiple sources.

**Sources:**
- Environment variables
- `.env` files
- JSON configuration files
- Command-line arguments

**Validation:**
- Checks required fields
- Validates GUID format
- Provides helpful error messages

#### OutputFormatter
Formats discovery results in various formats.

**Formats:**
- **Table** - Console-friendly table view
- **JSON** - Machine-readable format
- **CSV** - Spreadsheet import
- **Detailed** - Human-readable with full details

## Data Flow

### Discovery Flow

```
1. User runs: agent-detective discover

2. CLI parses arguments
   └─> Loads configuration (ConfigLoader)

3. Creates DiscoverCommand
   └─> Initializes AuthProvider

4. DiscoverCommand.execute()
   ├─> GraphApiClient.discoverTeamsAgents()
   │   └─> AuthProvider.getGraphToken()
   │       └─> Microsoft Graph API
   ├─> GraphApiClient.discoverM365ChatExtensions()
   │   └─> Microsoft Graph API (beta)
   ├─> SharePointClient.discoverDeclarativeAgents()
   │   └─> AuthProvider.getSharePointToken()
   │       └─> SharePoint REST API
   ├─> SharePointClient.discoverSPFxAgents()
   │   └─> SharePoint REST API
   └─> CopilotStudioClient.discoverCopilotStudioAgents()
       └─> AuthProvider.getPowerPlatformToken()
           └─> Power Platform API

5. Aggregate results
   └─> Create AgentDiscoveryResult

6. Format output (OutputFormatter)
   └─> Display to console or save to file
```

## Error Handling Strategy

### Levels of Error Handling

1. **API Client Level**
   - Catch API-specific errors
   - Log errors for debugging
   - Return empty array on failure
   - Allow other discoveries to continue

2. **Command Level**
   - Collect errors from all clients
   - Include errors in result object
   - Display warnings to user
   - Continue with partial results

3. **CLI Level**
   - Catch configuration errors
   - Display user-friendly error messages
   - Exit with appropriate error codes

### Error Recovery

- API failures don't stop the entire discovery
- Partial results are returned
- All errors are logged and reported
- Retry logic in MSAL for transient failures

## Security Considerations

### Authentication
- Uses app-only authentication (no user context)
- Client credentials flow with client secret
- Supports certificate authentication (via MSAL)

### Secret Management
- Secrets never logged or displayed
- Support for environment variables
- Recommends Azure Key Vault for production
- .env files excluded from git

### Permissions
- Principle of least privilege
- Only application permissions (no delegated)
- Read-only access
- Admin consent required

## Performance Considerations

### API Calls
- Parallel discovery across platforms
- Sequential within each platform
- Pagination support for large result sets
- Proper timeout handling

### Token Caching
- MSAL handles token caching
- Reduces authentication calls
- Tokens reused across API calls

### Rate Limiting
- Respects API rate limits
- Implements retry logic
- Exponential backoff (via MSAL)

## Extensibility

### Adding New Agent Types

1. Define new `AgentType` in models
2. Create or extend API client
3. Add discovery method
4. Update DiscoverCommand to call new method
5. Update documentation

### Adding New Platforms

1. Define new `AgentPlatform` in models
2. Create new API client in `clients/`
3. Implement discovery methods
4. Add authentication method if needed
5. Integrate in DiscoverCommand
6. Add command-line options

### Adding Output Formats

1. Add new method to OutputFormatter
2. Update CLI option parser
3. Handle new format in switch statement

## Testing Strategy

### Unit Tests
- Test each client independently
- Mock API responses
- Validate data transformations
- Test error handling

### Integration Tests
- Test with real API (in test tenant)
- Validate authentication flow
- Test end-to-end discovery

### Manual Testing
- Test CLI commands
- Verify output formats
- Test with various configurations
- Validate error messages

## Dependencies

### Core Dependencies
- **@azure/msal-node** - Azure AD authentication
- **axios** - HTTP client for API calls
- **commander** - CLI framework
- **dotenv** - Environment variable management

### Utility Dependencies
- **chalk** - Terminal colors
- **cli-table3** - Table formatting
- **ora** - Progress spinners

### Development Dependencies
- **typescript** - Type safety
- **eslint** - Code linting
- **jest** - Testing framework

## Future Enhancements

### Planned Features
1. **Health Monitoring** - Check agent availability and health
2. **Usage Analytics** - Track agent usage and adoption
3. **Export Formats** - Excel, PDF reports
4. **Web UI** - Browser-based dashboard
5. **VS Code Extension** - IDE integration
6. **Scheduled Scanning** - Automated periodic scans
7. **Alerting** - Notifications for changes
8. **Compliance Integration** - Purview integration

### Potential Improvements
1. **Caching** - Cache results for faster subsequent runs
2. **Incremental Discovery** - Only discover changes
3. **Graph Webhooks** - Real-time notifications
4. **Agent Metadata Enrichment** - Additional context
5. **Interactive Mode** - TUI for exploration
6. **Plugin System** - Custom discovery modules

## Deployment Options

### Local Installation
```bash
npm install -g agent-detective
```

### Docker Container
```dockerfile
FROM node:18-alpine
COPY . /app
WORKDIR /app
RUN npm install && npm run build
ENTRYPOINT ["node", "dist/cli.js"]
```

### Azure Functions
- Scheduled function for periodic discovery
- HTTP trigger for on-demand scans
- Store results in Azure Storage

### GitHub Actions
- Automated scanning in CI/CD
- Report generation
- Compliance checks

## Maintenance

### Version Updates
- Keep dependencies updated
- Monitor security advisories
- Test with new API versions
- Update documentation

### API Changes
- Monitor Microsoft API changelogs
- Adapt to breaking changes
- Support multiple API versions
- Provide migration guides

## Support

For questions and issues:
- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: Questions and community support
- Documentation: README, SETUP, and this document

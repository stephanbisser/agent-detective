# Agent Detective 🔍

A comprehensive CLI tool to discover and gather information about Microsoft 365 agents across your tenant, including declarative agents, Copilot Studio bots, and custom implementations.

## Overview

Agent Detective helps administrators and developers get a complete picture of all agent deployments within a Microsoft 365 tenant by querying multiple APIs:

- **Microsoft Graph API** - Teams apps and M365 Chat extensions
- **SharePoint REST API** - Declarative agents and SPFx solutions
- **Power Platform API** - Copilot Studio (Power Virtual Agents) bots
- **Dataverse API** - Custom engine agents

### Supported Agent Types

- **Declarative Agents** - Built with SharePoint declarative agent framework
- **Copilot Studio Lite** - Basic Copilot Studio bots
- **Copilot Studio Full** - Advanced Copilot Studio agents with custom capabilities
- **Custom Engine Agents** - Built with Microsoft 365 Agents Toolkit
- **SPFx Agents** - SharePoint Framework solutions with agent capabilities
- **Teams Apps** - Teams applications functioning as agents

## Features

✅ **Multi-Platform Discovery** - Scan across Teams, SharePoint, Copilot Studio, and Power Platform  
✅ **Flexible Output Formats** - Table, JSON, CSV, or detailed views  
✅ **Rich Metadata** - Captures descriptions, capabilities, owners, and timestamps  
✅ **Easy Configuration** - Environment variables or config file support  
✅ **Filtering Options** - Include/exclude specific platforms  
✅ **Error Handling** - Graceful handling of API failures with detailed error reporting  

## Installation

### Prerequisites

- Node.js 18.x or higher
- An Azure AD app registration with appropriate permissions (see Setup)

### Install from npm

```bash
npm install -g agent-detective
```

### Install from source

```bash
git clone https://github.com/stephanbisser/agent-detective.git
cd agent-detective
npm install
npm run build
npm link
```

## Quick Start

### 1. Initialize Configuration

```bash
agent-detective init
```

This creates a `.env` file. Edit it with your Azure AD credentials:

```env
TENANT_ID=your-tenant-id
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
```

### 2. Discover Agents

```bash
agent-detective discover
```

### 3. View Results

The tool will scan your tenant and display all discovered agents in a table format.

## Setup

### Azure AD App Registration

1. **Create App Registration**
   - Go to [Azure Portal](https://portal.azure.com)
   - Navigate to Azure Active Directory > App registrations
   - Click "New registration"
   - Name: "Agent Detective"
   - Supported account types: "Accounts in this organizational directory only"
   - Click "Register"

2. **Configure API Permissions**
   
   Add the following **Application permissions**:
   
   **Microsoft Graph:**
   - `TeamsAppInstallation.ReadForUser.All`
   - `AppCatalog.Read.All`
   - `Application.Read.All`
   - `Directory.Read.All`
   
   **SharePoint:**
   - `Sites.Read.All`
   
   **Dynamics CRM (for Power Platform):**
   - `user_impersonation`
   
   After adding permissions, click **"Grant admin consent"**

3. **Create Client Secret**
   - Go to "Certificates & secrets"
   - Click "New client secret"
   - Add description and expiration
   - **Copy the secret value** (shown only once!)

4. **Note Your IDs**
   - Copy the Tenant ID (from Azure AD Overview)
   - Copy the Application (client) ID (from app registration)

For detailed setup instructions, run:
```bash
agent-detective setup
```

## Usage

### Basic Discovery

Discover all agents in your tenant:
```bash
agent-detective discover
```

### Using Configuration File

```bash
agent-detective discover --config ./config.json
```

Example `config.json`:
```json
{
  "tenantId": "your-tenant-id",
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret"
}
```

### Command Line Options

```bash
agent-detective discover [options]
```

**Options:**
- `-t, --tenant-id <id>` - Microsoft 365 Tenant ID
- `-c, --client-id <id>` - Azure AD Application Client ID
- `-s, --client-secret <secret>` - Azure AD Application Client Secret
- `--config <path>` - Path to configuration file
- `--sharepoint-url <url>` - SharePoint site URL for discovery
- `--environment-id <id>` - Power Platform environment ID
- `--no-teams` - Skip Teams agents discovery
- `--no-sharepoint` - Skip SharePoint agents discovery
- `--no-copilot-studio` - Skip Copilot Studio agents discovery
- `--no-m365` - Skip M365 Chat extensions discovery
- `-o, --output <format>` - Output format: table, json, csv, detailed (default: table)
- `-f, --file <path>` - Write output to file instead of console

### Output Formats

**Table (default):**
```bash
agent-detective discover
```

**JSON:**
```bash
agent-detective discover --output json
```

**CSV:**
```bash
agent-detective discover --output csv --file agents.csv
```

**Detailed:**
```bash
agent-detective discover --output detailed
```

### Filtering

Discover only specific platforms:
```bash
# Only Teams and M365
agent-detective discover --no-sharepoint --no-copilot-studio

# Only Copilot Studio
agent-detective discover --no-teams --no-sharepoint --no-m365
```

Specify SharePoint site:
```bash
agent-detective discover --sharepoint-url https://contoso.sharepoint.com/sites/apps
```

Specify Power Platform environment:
```bash
agent-detective discover --environment-id your-environment-id
```

## API Reference

### Programmatic Usage

You can also use Agent Detective as a library:

```typescript
import {
  DiscoverCommand,
  AgentDiscoveryResult,
  OutputFormatter
} from 'agent-detective';

const command = new DiscoverCommand({
  tenantId: 'your-tenant-id',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
});

const result: AgentDiscoveryResult = await command.execute();
console.log(OutputFormatter.formatAsJson(result));
```

### APIs Used

Agent Detective leverages the following Microsoft APIs:

1. **Microsoft Graph API**
   - `/v1.0/appCatalogs/teamsApps` - Teams applications
   - `/beta/appCatalogs/teamsApps` - M365 Chat extensions with enhanced metadata

2. **SharePoint REST API**
   - `/_api/web/tenantappcatalog/AvailableApps` - App catalog
   - `/_api/web/lists/getbytitle('Apps for SharePoint')/items` - SPFx solutions

3. **Power Platform API**
   - `/v1/environments` - List environments
   - `/powervirtualagents/bots` - Copilot Studio bots

4. **Dataverse API**
   - `/api/data/v9.2/bots` - Bot entities

## Architecture

```
agent-detective/
├── src/
│   ├── auth/              # Authentication providers
│   │   └── AuthProvider.ts
│   ├── clients/           # API clients
│   │   ├── GraphApiClient.ts
│   │   ├── SharePointClient.ts
│   │   └── CopilotStudioClient.ts
│   ├── commands/          # CLI commands
│   │   └── DiscoverCommand.ts
│   ├── models/            # Data models
│   │   └── Agent.ts
│   ├── utils/             # Utilities
│   │   ├── ConfigLoader.ts
│   │   └── OutputFormatter.ts
│   ├── cli.ts            # CLI entry point
│   └── index.ts          # Programmatic API
```

## Development

### Build

```bash
npm run build
```

### Run Locally

```bash
npm run dev -- discover
```

### Lint

```bash
npm run lint
```

### Test

```bash
npm test
```

## Troubleshooting

### No Agents Found

If no agents are discovered, check:
1. App registration has all required permissions
2. Admin consent has been granted
3. Agents are actually deployed in your tenant
4. You're using the correct tenant ID

### Authentication Errors

- Verify tenant ID, client ID, and client secret are correct
- Ensure client secret hasn't expired
- Check that API permissions are configured correctly
- Verify admin consent was granted

### Permission Errors

If you see 403 or insufficient privileges errors:
1. Verify all API permissions are added
2. Grant admin consent for the permissions
3. Wait a few minutes for permissions to propagate

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/stephanbisser/agent-detective/issues
- Discussions: https://github.com/stephanbisser/agent-detective/discussions

## Roadmap

Future enhancements planned:
- [ ] Support for additional agent platforms
- [ ] Agent health monitoring
- [ ] Usage analytics
- [ ] Export to various formats (Excel, PDF)
- [ ] Integration with Microsoft Purview
- [ ] Web UI for visualization
- [ ] VS Code extension

## Credits

Built with ❤️ for the Microsoft 365 community

---

**Note:** This tool requires appropriate permissions to access Microsoft 365 APIs. Always follow your organization's security and compliance policies when deploying and using this tool.
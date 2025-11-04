# Agent Detective - Usage Examples

This document provides real-world usage examples and sample outputs.

## Basic Usage

### Discover All Agents

```bash
agent-detective discover
```

**Sample Output (Table Format):**

```
🔍 Agent Detective - Microsoft 365 Agents Discovery

✔ Found 3 Teams agents
✔ Found 2 M365 Chat extensions
✔ Found 1 SharePoint declarative agents
✔ Found 0 SPFx agents
✔ Found 4 Copilot Studio agents
✔ Discovery complete! Found 10 total agents

┌──────────────────────────────┬─────────────────────────┬──────────────────────┬────────────────┬────────────────────────────────────────┐
│ Name                         │ Type                    │ Platform             │ Status         │ ID                                     │
├──────────────────────────────┼─────────────────────────┼──────────────────────┼────────────────┼────────────────────────────────────────┤
│ Sales Copilot                │ Declarative             │ Microsoft Teams      │ N/A            │ 12345678-1234-1234-1234-123456789abc   │
├──────────────────────────────┼─────────────────────────┼──────────────────────┼────────────────┼────────────────────────────────────────┤
│ HR Assistant                 │ Declarative             │ Microsoft Teams      │ N/A            │ 23456789-2345-2345-2345-23456789abcd   │
├──────────────────────────────┼─────────────────────────┼──────────────────────┼────────────────┼────────────────────────────────────────┤
│ Project Manager Bot          │ Declarative             │ Microsoft Teams      │ N/A            │ 34567890-3456-3456-3456-3456789abcde   │
├──────────────────────────────┼─────────────────────────┼──────────────────────┼────────────────┼────────────────────────────────────────┤
│ Document Search              │ Declarative             │ Microsoft 365 Agents │ N/A            │ 45678901-4567-4567-4567-456789abcdef   │
├──────────────────────────────┼─────────────────────────┼──────────────────────┼────────────────┼────────────────────────────────────────┤
│ Knowledge Base Agent         │ Declarative             │ Microsoft 365 Agents │ N/A            │ 56789012-5678-5678-5678-56789abcdef0   │
├──────────────────────────────┼─────────────────────────┼──────────────────────┼────────────────┼────────────────────────────────────────┤
│ IT Support Bot               │ Copilot Studio Full     │ Copilot Studio       │ Published      │ 67890123-6789-6789-6789-6789abcdef01   │
├──────────────────────────────┼─────────────────────────┼──────────────────────┼────────────────┼────────────────────────────────────────┤
│ Customer Service             │ Copilot Studio Full     │ Copilot Studio       │ Published      │ 78901234-7890-7890-7890-789abcdef012   │
├──────────────────────────────┼─────────────────────────┼──────────────────────┼────────────────┼────────────────────────────────────────┤
│ FAQ Bot                      │ Copilot Studio Lite     │ Copilot Studio       │ Published      │ 89012345-8901-8901-8901-89abcdef0123   │
├──────────────────────────────┼─────────────────────────┼──────────────────────┼────────────────┼────────────────────────────────────────┤
│ Meeting Scheduler            │ Copilot Studio Lite     │ Copilot Studio       │ Draft          │ 90123456-9012-9012-9012-9abcdef01234   │
├──────────────────────────────┼─────────────────────────┼──────────────────────┼────────────────┼────────────────────────────────────────┤
│ Corporate Policies           │ Declarative             │ SharePoint           │ N/A            │ app-001                                │
└──────────────────────────────┴─────────────────────────┴──────────────────────┴────────────────┴────────────────────────────────────────┘

Total agents found: 10
Discovered at: 2024-10-29T15:43:25.123Z

=== Agent Summary ===

Total Agents: 10

Breakdown by Platform & Type:
  Microsoft Teams - Declarative: 3
  Microsoft 365 Agents - Declarative: 2
  Copilot Studio - Copilot Studio Full: 2
  Copilot Studio - Copilot Studio Lite: 2
  SharePoint - Declarative: 1
```

## Output Formats

### JSON Output

```bash
agent-detective discover --output json
```

**Sample Output:**

```json
{
  "agents": [
    {
      "id": "12345678-1234-1234-1234-123456789abc",
      "name": "Sales Copilot",
      "description": "AI assistant for sales team",
      "type": "Declarative",
      "platform": "Microsoft Teams",
      "capabilities": ["Bot", "Message Extension"],
      "metadata": {
        "distributionMethod": "organization",
        "version": "1.0.0"
      }
    },
    {
      "id": "67890123-6789-6789-6789-6789abcdef01",
      "name": "IT Support Bot",
      "description": "Automated IT help desk",
      "type": "Copilot Studio Full",
      "platform": "Copilot Studio",
      "status": "Published",
      "created": "2024-01-15T10:30:00.000Z",
      "modified": "2024-10-20T14:22:00.000Z",
      "metadata": {
        "environmentId": "env-12345",
        "schemaName": "cr123_ITSupportBot",
        "language": "en-US"
      }
    }
  ],
  "totalCount": 10,
  "timestamp": "2024-10-29T15:43:25.123Z"
}
```

### CSV Output

```bash
agent-detective discover --output csv --file agents.csv
```

**Sample agents.csv:**

```csv
Name,Type,Platform,Status,ID,Description,Created,Modified
Sales Copilot,Declarative,Microsoft Teams,N/A,12345678-1234-1234-1234-123456789abc,AI assistant for sales team,,
HR Assistant,Declarative,Microsoft Teams,N/A,23456789-2345-2345-2345-23456789abcd,Employee onboarding assistant,,
IT Support Bot,Copilot Studio Full,Copilot Studio,Published,67890123-6789-6789-6789-6789abcdef01,Automated IT help desk,2024-01-15T10:30:00.000Z,2024-10-20T14:22:00.000Z
```

### Detailed Output

```bash
agent-detective discover --output detailed
```

**Sample Output:**

```
=== Microsoft 365 Agents Discovery Report ===

Discovery Time: 2024-10-29T15:43:25.123Z
Total Agents Found: 10

Sales Copilot
──────────────────────────────────────────────────
  ID: 12345678-1234-1234-1234-123456789abc
  Type: Declarative
  Platform: Microsoft Teams
  Description: AI assistant for sales team
  Capabilities: Bot, Message Extension
  Metadata:
    - distributionMethod: "organization"
    - version: "1.0.0"

IT Support Bot
──────────────────────────────────────────────────
  ID: 67890123-6789-6789-6789-6789abcdef01
  Type: Copilot Studio Full
  Platform: Copilot Studio
  Description: Automated IT help desk
  Status: Published
  Created: 2024-01-15T10:30:00.000Z
  Modified: 2024-10-20T14:22:00.000Z
  Metadata:
    - environmentId: "env-12345"
    - schemaName: "cr123_ITSupportBot"
    - language: "en-US"
```

## Filtering Examples

### Discover Only Teams Agents

```bash
agent-detective discover --no-sharepoint --no-copilot-studio --no-m365
```

### Discover Only Copilot Studio Agents

```bash
agent-detective discover --no-teams --no-sharepoint --no-m365
```

### With SharePoint URL

```bash
agent-detective discover --sharepoint-url https://contoso.sharepoint.com/sites/apps
```

### Specific Power Platform Environment

```bash
agent-detective discover --environment-id 12345678-1234-1234-1234-123456789abc
```

## Configuration Examples

### Using Environment Variables

```bash
# Set environment variables
export TENANT_ID="12345678-1234-1234-1234-123456789abc"
export CLIENT_ID="87654321-4321-4321-4321-cba987654321"
export CLIENT_SECRET="your-secret-here"

# Run discovery
agent-detective discover
```

### Using Configuration File

**config.json:**
```json
{
  "tenantId": "12345678-1234-1234-1234-123456789abc",
  "clientId": "87654321-4321-4321-4321-cba987654321",
  "clientSecret": "your-secret-here"
}
```

```bash
agent-detective discover --config config.json
```

### Using Command-Line Arguments

```bash
agent-detective discover \
  --tenant-id "12345678-1234-1234-1234-123456789abc" \
  --client-id "87654321-4321-4321-4321-cba987654321" \
  --client-secret "your-secret-here"
```

## Programmatic Usage Examples

### Basic Discovery

```typescript
import { DiscoverCommand } from 'agent-detective';

async function main() {
  const command = new DiscoverCommand({
    tenantId: process.env.TENANT_ID!,
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!
  });

  const result = await command.execute();
  
  console.log(`Discovered ${result.totalCount} agents`);
  
  result.agents.forEach(agent => {
    console.log(`- ${agent.name} (${agent.type})`);
  });
}

main().catch(console.error);
```

### Filter and Process Results

```typescript
import { DiscoverCommand, AgentType } from 'agent-detective';

async function getCopilotStudioAgents() {
  const command = new DiscoverCommand({
    tenantId: process.env.TENANT_ID!,
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!
  });

  const result = await command.execute();
  
  // Filter for Copilot Studio agents
  const copilotAgents = result.agents.filter(
    agent => agent.type === AgentType.COPILOT_STUDIO_FULL ||
             agent.type === AgentType.COPILOT_STUDIO_LITE
  );
  
  return copilotAgents;
}
```

### Generate Custom Report

```typescript
import { DiscoverCommand, OutputFormatter } from 'agent-detective';
import * as fs from 'fs';

async function generateReport() {
  const command = new DiscoverCommand({
    tenantId: process.env.TENANT_ID!,
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!
  });

  const result = await command.execute();
  
  // Save in multiple formats
  fs.writeFileSync('agents.json', OutputFormatter.formatAsJson(result));
  fs.writeFileSync('agents.csv', OutputFormatter.formatAsCsv(result));
  
  console.log('Report generated successfully!');
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
    
    // Check for partial failures
    if (result.errors && result.errors.length > 0) {
      console.warn('Some platforms failed:');
      result.errors.forEach(error => console.warn(`  - ${error}`));
    }
    
    return result.agents;
  } catch (error) {
    console.error('Discovery failed completely:', error);
    throw error;
  }
}
```

## Integration Examples

### GitHub Actions

```yaml
name: Agent Discovery
on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM
  workflow_dispatch:

jobs:
  discover:
    runs-on: ubuntu-latest
    steps:
      - name: Install Agent Detective
        run: npm install -g agent-detective
      
      - name: Discover Agents
        run: |
          agent-detective discover \
            --tenant-id ${{ secrets.TENANT_ID }} \
            --client-id ${{ secrets.CLIENT_ID }} \
            --client-secret ${{ secrets.CLIENT_SECRET }} \
            --output json \
            --file agents.json
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: agent-discovery
          path: agents.json
```

### Azure Function (Timer Trigger)

```typescript
import { AzureFunction, Context } from "@azure/functions";
import { DiscoverCommand, OutputFormatter } from 'agent-detective';

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    context.log('Agent discovery started');

    const command = new DiscoverCommand({
        tenantId: process.env.TENANT_ID!,
        clientId: process.env.CLIENT_ID!,
        clientSecret: process.env.CLIENT_SECRET!
    });

    const result = await command.execute();
    
    context.log(`Discovered ${result.totalCount} agents`);
    
    // Store results in blob storage, database, etc.
    const json = OutputFormatter.formatAsJson(result);
    
    context.bindings.outputBlob = json;
};

export default timerTrigger;
```

### Docker Container

```dockerfile
FROM node:18-alpine

WORKDIR /app

RUN npm install -g agent-detective

ENV TENANT_ID=""
ENV CLIENT_ID=""
ENV CLIENT_SECRET=""

CMD ["agent-detective", "discover", "--output", "json"]
```

```bash
docker build -t agent-detective .
docker run -e TENANT_ID="xxx" -e CLIENT_ID="xxx" -e CLIENT_SECRET="xxx" agent-detective
```

## Troubleshooting Examples

### Verify Configuration

```bash
# Initialize config
agent-detective init

# Check that .env file was created
cat .env

# Test with verbose output
agent-detective discover --output detailed
```

### Test Authentication Only

```typescript
import { AuthProvider } from 'agent-detective';

async function testAuth() {
  try {
    const auth = new AuthProvider(
      process.env.TENANT_ID!,
      process.env.CLIENT_ID!,
      process.env.CLIENT_SECRET!
    );
    
    const token = await auth.getGraphToken();
    console.log('✓ Authentication successful');
    console.log(`Token length: ${token.length}`);
  } catch (error) {
    console.error('✗ Authentication failed:', error);
  }
}
```

### Debug API Calls

```typescript
import { AuthProvider, GraphApiClient } from 'agent-detective';

async function debugGraph() {
  const auth = new AuthProvider(
    process.env.TENANT_ID!,
    process.env.CLIENT_ID!,
    process.env.CLIENT_SECRET!
  );
  
  const client = new GraphApiClient(auth);
  
  console.log('Testing Teams discovery...');
  const agents = await client.discoverTeamsAgents();
  console.log(`Found ${agents.length} Teams agents`);
  
  console.log('Testing M365 discovery...');
  const m365Agents = await client.discoverM365ChatExtensions();
  console.log(`Found ${m365Agents.length} M365 agents`);
}
```

## Real-World Scenarios

### Monthly Compliance Report

```bash
#!/bin/bash
# monthly-agent-report.sh

DATE=$(date +%Y-%m)
OUTPUT_DIR="reports/$DATE"

mkdir -p $OUTPUT_DIR

agent-detective discover \
  --output json \
  --file "$OUTPUT_DIR/agents.json"

agent-detective discover \
  --output csv \
  --file "$OUTPUT_DIR/agents.csv"

echo "Report generated in $OUTPUT_DIR"
```

### Agent Inventory Dashboard

```typescript
import { DiscoverCommand, AgentType, AgentPlatform } from 'agent-detective';

interface AgentStats {
  total: number;
  byType: Record<AgentType, number>;
  byPlatform: Record<AgentPlatform, number>;
  recentlyModified: number;
}

async function getStats(): Promise<AgentStats> {
  const command = new DiscoverCommand({
    tenantId: process.env.TENANT_ID!,
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!
  });

  const result = await command.execute();
  
  const stats: AgentStats = {
    total: result.totalCount,
    byType: {} as Record<AgentType, number>,
    byPlatform: {} as Record<AgentPlatform, number>,
    recentlyModified: 0
  };
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  result.agents.forEach(agent => {
    // Count by type
    stats.byType[agent.type] = (stats.byType[agent.type] || 0) + 1;
    
    // Count by platform
    stats.byPlatform[agent.platform] = (stats.byPlatform[agent.platform] || 0) + 1;
    
    // Count recently modified
    if (agent.modified && agent.modified > thirtyDaysAgo) {
      stats.recentlyModified++;
    }
  });
  
  return stats;
}
```

## Tips & Tricks

### Save Credentials Securely

```bash
# Use Azure Key Vault
TENANT_ID=$(az keyvault secret show --name tenant-id --vault-name my-vault --query value -o tsv)
CLIENT_ID=$(az keyvault secret show --name client-id --vault-name my-vault --query value -o tsv)
CLIENT_SECRET=$(az keyvault secret show --name client-secret --vault-name my-vault --query value -o tsv)

agent-detective discover
```

### Compare Discoveries

```bash
# Take snapshot
agent-detective discover --output json --file snapshot-$(date +%Y%m%d).json

# Compare with previous
diff snapshot-20241001.json snapshot-20241029.json
```

### Quick Agent Count

```bash
agent-detective discover --output json | jq '.totalCount'
```

### Filter JSON Results

```bash
# Get only Copilot Studio agents
agent-detective discover --output json | jq '.agents[] | select(.platform == "Copilot Studio")'
```

---

For more examples and use cases, see the [documentation](README.md) or [discussions](https://github.com/stephanbisser/agent-detective/discussions).

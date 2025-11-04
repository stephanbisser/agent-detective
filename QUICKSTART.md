# Quick Start Guide

Get started with Agent Detective in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Access to Azure Portal as Global Admin or Application Admin
- Microsoft 365 tenant

## Step 1: Install (1 minute)

```bash
npm install -g agent-detective
```

Or install from source:
```bash
git clone https://github.com/stephanbisser/agent-detective.git
cd agent-detective
npm install
npm run build
npm link
```

## Step 2: Azure Setup (3 minutes)

### Create App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
   - Name: `Agent Detective`
   - Supported account types: **Single tenant**
   - Click **Register**
4. Copy **Application (client) ID**
5. Copy **Directory (tenant) ID**

### Add Permissions

1. Click **API permissions**
2. Add **Microsoft Graph** → **Application permissions**:
   - `TeamsAppInstallation.ReadForUser.All`
   - `AppCatalog.Read.All`
   - `Application.Read.All`
   - `Directory.Read.All`
3. Add **SharePoint** → **Application permissions**:
   - `Sites.Read.All`
4. Click **Grant admin consent** ✓

### Create Secret

1. Click **Certificates & secrets**
2. Click **New client secret**
   - Description: `Agent Detective`
   - Expires: **6 months** (or your preference)
3. **Copy the secret value** (shown only once!)

## Step 3: Configure (1 minute)

```bash
agent-detective init
```

Edit the generated `.env` file:

```env
TENANT_ID=your-tenant-id-here
CLIENT_ID=your-client-id-here
CLIENT_SECRET=your-client-secret-here
```

## Step 4: Discover!

```bash
agent-detective discover
```

That's it! You'll see a table of all agents in your tenant.

## Common Commands

### View Help
```bash
agent-detective --help
agent-detective discover --help
```

### Setup Instructions
```bash
agent-detective setup
```

### Different Output Formats

**JSON format:**
```bash
agent-detective discover --output json
```

**CSV to file:**
```bash
agent-detective discover --output csv --file agents.csv
```

**Detailed view:**
```bash
agent-detective discover --output detailed
```

### Filter by Platform

**Only Teams:**
```bash
agent-detective discover --no-sharepoint --no-copilot-studio --no-m365
```

**Only Copilot Studio:**
```bash
agent-detective discover --no-teams --no-sharepoint --no-m365
```

### Specify SharePoint Site
```bash
agent-detective discover --sharepoint-url https://contoso.sharepoint.com/sites/apps
```

## Troubleshooting

### "Missing required configuration"
- Ensure `.env` file exists in current directory
- Check that all three values are set

### "Authentication failed"
- Verify Tenant ID, Client ID, and Client Secret are correct
- Check that client secret hasn't expired
- Ensure you copied the secret value (not the secret ID)

### "Insufficient privileges" or 403 errors
- Verify all API permissions are added
- Ensure admin consent was granted
- Wait 5-10 minutes for permissions to propagate

### "No agents found"
- This is normal if no agents are deployed in your tenant
- Try providing SharePoint URL for SharePoint agents
- Check that you have permission to see the agents

## Next Steps

- Read the [full documentation](README.md)
- Check the [detailed setup guide](SETUP.md)
- Learn about [programmatic usage](API.md)
- Explore [architecture](ARCHITECTURE.md)

## Support

- [GitHub Issues](https://github.com/stephanbisser/agent-detective/issues)
- [GitHub Discussions](https://github.com/stephanbisser/agent-detective/discussions)
- [Documentation](https://github.com/stephanbisser/agent-detective)

---

**Happy agent hunting! 🔍**

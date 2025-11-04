# Setup Guide for Agent Detective

This guide provides detailed instructions for setting up Agent Detective to discover Microsoft 365 agents in your tenant.

## Prerequisites

- Node.js 18.x or higher
- Access to Azure Portal with Global Administrator or Application Administrator role
- Microsoft 365 tenant

## Step-by-Step Setup

### 1. Install Agent Detective

#### Option A: Install from npm (recommended)
```bash
npm install -g agent-detective
```

#### Option B: Install from source
```bash
git clone https://github.com/stephanbisser/agent-detective.git
cd agent-detective
npm install
npm run build
npm link
```

### 2. Create Azure AD App Registration

1. **Navigate to Azure Portal**
   - Go to https://portal.azure.com
   - Sign in with your administrator account

2. **Access App Registrations**
   - Click on "Azure Active Directory" in the left menu
   - Select "App registrations" from the menu
   - Click "New registration"

3. **Register the Application**
   - Name: `Agent Detective`
   - Supported account types: "Accounts in this organizational directory only (Single tenant)"
   - Redirect URI: Leave blank
   - Click "Register"

4. **Note Your IDs**
   - Copy the **Application (client) ID** - you'll need this
   - Copy the **Directory (tenant) ID** - you'll need this

### 3. Configure API Permissions

1. **Add Microsoft Graph Permissions**
   - In your app registration, click "API permissions"
   - Click "Add a permission"
   - Select "Microsoft Graph"
   - Select "Application permissions"
   - Add the following permissions:
     - `TeamsAppInstallation.ReadForUser.All`
     - `AppCatalog.Read.All`
     - `Application.Read.All`
     - `Directory.Read.All`
   - Click "Add permissions"

2. **Add SharePoint Permissions**
   - Click "Add a permission" again
   - Select "SharePoint"
   - Select "Application permissions"
   - Add: `Sites.Read.All`
   - Click "Add permissions"

3. **Add Power Platform Permissions (Optional)**
   - Click "Add a permission"
   - Select "APIs my organization uses"
   - Search for "Dynamics CRM" or "PowerApps"
   - Select "Application permissions"
   - Add available permissions for reading bots/agents
   - Click "Add permissions"

4. **Grant Admin Consent**
   - Click "Grant admin consent for [Your Organization]"
   - Click "Yes" to confirm
   - Wait for the status to show "Granted"

### 4. Create Client Secret

1. **Generate Secret**
   - In your app registration, click "Certificates & secrets"
   - Click "New client secret"
   - Description: `Agent Detective Secret`
   - Expires: Choose appropriate duration (6 months, 12 months, or 24 months)
   - Click "Add"

2. **Copy the Secret Value**
   - **Important:** Copy the secret value immediately
   - You won't be able to see it again after leaving this page
   - Store it securely

### 5. Configure Agent Detective

#### Option A: Using Environment Variables

1. Initialize configuration:
```bash
agent-detective init
```

2. Edit the generated `.env` file:
```env
TENANT_ID=your-tenant-id-here
CLIENT_ID=your-client-id-here
CLIENT_SECRET=your-client-secret-here
```

#### Option B: Using Configuration File

1. Create a `config.json` file:
```json
{
  "tenantId": "your-tenant-id",
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret"
}
```

2. Use it with the `--config` flag:
```bash
agent-detective discover --config ./config.json
```

#### Option C: Using Command-Line Arguments

```bash
agent-detective discover \
  --tenant-id "your-tenant-id" \
  --client-id "your-client-id" \
  --client-secret "your-client-secret"
```

### 6. Test the Setup

Run a discovery to test your configuration:

```bash
agent-detective discover
```

You should see:
- A progress indicator for each platform being scanned
- A table of discovered agents (if any exist)
- A summary of results

## Troubleshooting

### Common Issues

#### 1. "Missing required configuration" Error

**Problem:** TENANT_ID, CLIENT_ID, or CLIENT_SECRET not found

**Solution:**
- Verify your `.env` file exists and has the correct values
- Check that the `.env` file is in the current directory
- Try using `--config` or command-line arguments instead

#### 2. "Authentication failed" Error

**Problem:** Cannot authenticate with Microsoft APIs

**Solutions:**
- Verify tenant ID, client ID, and client secret are correct
- Check that the client secret hasn't expired
- Ensure you copied the secret value correctly (not the secret ID)
- Try generating a new client secret

#### 3. "Insufficient privileges" or 403 Errors

**Problem:** App doesn't have required permissions

**Solutions:**
- Verify all API permissions are added to the app registration
- Ensure admin consent has been granted
- Wait 5-10 minutes for permissions to propagate
- Check that your admin account has rights to grant consent

#### 4. "No agents found"

**Problem:** Discovery completes but finds no agents

**Possible Reasons:**
- No agents are actually deployed in your tenant (this is normal for new/test tenants)
- The app registration lacks specific permissions
- Filters are excluding all agents
- SharePoint URL not provided (for SharePoint agents)

**Solutions:**
- Try running with `--output detailed` to see more information
- Check that you have agents deployed in your tenant
- Verify API permissions and admin consent
- For SharePoint agents, provide `--sharepoint-url`

#### 5. Rate Limiting Errors

**Problem:** Too many API requests

**Solution:**
- Wait a few minutes and try again
- The tool already implements retry logic, but severe rate limiting may require longer waits

## Advanced Configuration

### Discovering Specific Platforms

Include only specific platforms:
```bash
# Only Microsoft Teams
agent-detective discover --no-sharepoint --no-copilot-studio --no-m365

# Only Copilot Studio
agent-detective discover --no-teams --no-sharepoint --no-m365
```

### SharePoint Discovery

For SharePoint agent discovery, specify your site URL:
```bash
agent-detective discover --sharepoint-url https://contoso.sharepoint.com/sites/apps
```

Or add to your `.env`:
```env
SHAREPOINT_URL=https://contoso.sharepoint.com/sites/apps
```

### Power Platform Discovery

For specific Power Platform environments:
```bash
agent-detective discover --environment-id your-environment-id
```

## Security Best Practices

1. **Protect Your Secrets**
   - Never commit `.env` files to version control
   - Use Azure Key Vault for production deployments
   - Rotate client secrets regularly

2. **Limit Permissions**
   - Only grant the minimum required permissions
   - Use application permissions (not delegated)
   - Regularly audit app permissions

3. **Monitor Usage**
   - Review Azure AD sign-in logs
   - Monitor API usage in Azure Portal
   - Set up alerts for unusual activity

4. **Client Secret Expiration**
   - Set reminders for secret expiration
   - Have a process to rotate secrets
   - Consider using certificate authentication instead

## Next Steps

After successful setup:

1. **Run Regular Discoveries**
   - Schedule regular scans to track agent deployments
   - Export results for auditing and compliance

2. **Integrate with Your Workflow**
   - Use JSON output for automation
   - Import CSV into Excel or Power BI
   - Build dashboards with the data

3. **Explore Advanced Features**
   - Try different output formats
   - Filter by specific platforms
   - Use as a library in your own tools

## Support

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/stephanbisser/agent-detective/issues)
2. Review the [README](README.md) for additional examples
3. Open a new issue with details about your problem

## Additional Resources

- [Microsoft Graph API Documentation](https://docs.microsoft.com/graph/)
- [SharePoint REST API Documentation](https://docs.microsoft.com/sharepoint/dev/sp-add-ins/get-to-know-the-sharepoint-rest-service)
- [Power Platform API Documentation](https://docs.microsoft.com/power-platform/admin/programmability-authentication)
- [Azure AD App Registration](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app)

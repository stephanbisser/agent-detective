# Contributing to Agent Detective

Thank you for your interest in contributing to Agent Detective! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on what is best for the community
- Show empathy towards others

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git
- A Microsoft 365 tenant (for testing)
- Azure AD app registration (for testing)

### Areas for Contribution

We welcome contributions in several areas:

- **Bug Fixes** - Fix issues reported in GitHub Issues
- **New Features** - Add support for new agent types or platforms
- **Documentation** - Improve README, guides, and code comments
- **Testing** - Add unit tests and integration tests
- **Performance** - Optimize API calls and processing
- **UI/UX** - Improve CLI output and user experience

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/agent-detective.git
cd agent-detective

# Add upstream remote
git remote add upstream https://github.com/stephanbisser/agent-detective.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your test credentials
# Never commit this file!
```

### 4. Build the Project

```bash
npm run build
```

### 5. Run Locally

```bash
# Using ts-node for development
npm run dev -- discover --help

# Or using built files
node dist/cli.js discover --help
```

## Making Changes

### 1. Create a Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Your Changes

Follow the [coding standards](#coding-standards) and ensure your changes:

- Are focused and atomic (one feature/fix per PR)
- Include appropriate tests
- Update documentation as needed
- Pass all linting and build checks

### 3. Test Your Changes

```bash
# Build
npm run build

# Lint
npm run lint

# Test (when tests are available)
npm test

# Manual testing
node dist/cli.js discover
```

### 4. Commit Your Changes

Follow conventional commit messages:

```bash
git add .
git commit -m "feat: add support for Azure Bot Service agents"
git commit -m "fix: handle null values in SharePoint API response"
git commit -m "docs: update setup instructions"
```

#### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

**Examples:**
```
feat(clients): add Azure Bot Service client

Implements discovery of agents deployed through Azure Bot Service.
Queries the Azure Resource Manager API for bot resources.

Closes #123
```

## Submitting Changes

### 1. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 2. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit the PR

### Pull Request Guidelines

**Title:**
- Use clear, descriptive titles
- Follow commit message conventions
- Example: "feat: add support for Azure Bot Service"

**Description:**
Include:
- What changes were made and why
- Link to related issues
- Screenshots (for UI changes)
- Testing performed
- Breaking changes (if any)

**Checklist:**
- [ ] Code builds without errors
- [ ] Linting passes
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Conventional commit messages

### 3. Review Process

- Maintainers will review your PR
- Address any feedback
- Keep your PR up to date with main
- Once approved, it will be merged

## Coding Standards

### TypeScript Style

- Use TypeScript for all new code
- Enable strict mode
- Provide type annotations
- Avoid `any` types when possible
- Use interfaces for object shapes

### Code Organization

```typescript
// 1. Imports (external first, then internal)
import { SomeType } from 'external-lib';
import { LocalType } from './models';

// 2. Types and interfaces
interface MyInterface {
  // ...
}

// 3. Constants
const MY_CONSTANT = 'value';

// 4. Class or function definitions
export class MyClass {
  // ...
}
```

### Naming Conventions

- **Classes**: PascalCase - `AuthProvider`, `GraphApiClient`
- **Interfaces**: PascalCase - `Agent`, `AgentDiscoveryConfig`
- **Functions/Methods**: camelCase - `getAccessToken`, `discoverAgents`
- **Variables**: camelCase - `clientId`, `accessToken`
- **Constants**: UPPER_SNAKE_CASE - `BASE_URL`, `DEFAULT_TIMEOUT`
- **Files**: PascalCase for classes - `AuthProvider.ts`

### Comments

- Use JSDoc for public APIs
- Comment complex logic
- Avoid obvious comments
- Keep comments up to date

```typescript
/**
 * Discovers agents in a SharePoint site
 * @param siteUrl - The SharePoint site URL
 * @returns Array of discovered agents
 */
async discoverAgents(siteUrl: string): Promise<Agent[]> {
  // Implementation
}
```

### Error Handling

```typescript
try {
  // Attempt operation
  const result = await apiCall();
  return result;
} catch (error) {
  // Log error with context
  console.error('Error in discoverAgents:', error);
  // Return safe default or rethrow
  return [];
}
```

### ESLint

We use ESLint for code quality. Run:

```bash
npm run lint
```

Fix auto-fixable issues:

```bash
npm run lint -- --fix
```

## Testing

### Writing Tests

(Note: Test infrastructure to be added)

```typescript
import { AuthProvider } from '../auth/AuthProvider';

describe('AuthProvider', () => {
  it('should acquire token successfully', async () => {
    const provider = new AuthProvider('tenant', 'client', 'secret');
    const token = await provider.getGraphToken();
    expect(token).toBeDefined();
  });
});
```

### Running Tests

```bash
npm test
```

### Manual Testing

Always test your changes manually:

1. Build the project
2. Run the CLI with various options
3. Test error scenarios
4. Verify output formats
5. Check with real M365 tenant

## Documentation

### When to Update Documentation

Update documentation when:
- Adding new features
- Changing existing behavior
- Fixing bugs that affect usage
- Adding new configuration options
- Changing API

### Documentation Files

- **README.md** - Main documentation, quick start
- **SETUP.md** - Detailed setup instructions
- **ARCHITECTURE.md** - Technical architecture
- **CONTRIBUTING.md** - This file
- **Code comments** - JSDoc and inline comments

### Writing Style

- Use clear, simple language
- Provide examples
- Include code snippets
- Add screenshots for visual features
- Keep it up to date

## Adding New Features

### Adding a New API Client

1. Create file in `src/clients/`
2. Extend base patterns from existing clients
3. Implement discovery methods
4. Add to DiscoverCommand
5. Update types if needed
6. Add documentation
7. Test thoroughly

Example:

```typescript
// src/clients/AzureBotClient.ts
export class AzureBotClient {
  private authProvider: AuthProvider;

  constructor(authProvider: AuthProvider) {
    this.authProvider = authProvider;
  }

  async discoverBots(): Promise<Agent[]> {
    // Implementation
  }
}
```

### Adding Output Formats

1. Add method to `OutputFormatter`
2. Add CLI option
3. Handle in format switch
4. Document usage
5. Add examples

## Release Process

(For maintainers)

1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag
4. Build and test
5. Publish to npm
6. Create GitHub release
7. Announce

## Getting Help

### Questions?

- Check existing documentation
- Search GitHub Issues
- Ask in GitHub Discussions
- Contact maintainers

### Found a Bug?

1. Check if already reported
2. Create detailed issue
3. Include reproduction steps
4. Provide environment details

### Want a Feature?

1. Check existing issues/discussions
2. Describe the use case
3. Explain expected behavior
4. Consider contributing it!

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in commit history

Thank you for contributing to Agent Detective! 🎉

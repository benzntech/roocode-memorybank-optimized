# Roo-Code Integration

This document provides detailed information about integrating the Memory Bank system with Roo-Code, an AI-powered autonomous coding agent.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [How It Works](#how-it-works)
5. [Integration with Existing Roo-Code Configuration](#integration-with-existing-roo-code-configuration)
6. [Advanced Usage](#advanced-usage)
7. [Automated Integration](#automated-integration)
8. [Example Scenarios](#example-scenarios)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

## Overview

The Memory Bank system provides structured documentation and context retention for your projects. Integrating it with Roo-Code allows the AI agent to access this context, improving its understanding of your codebase and project goals.

The integration works by generating custom instruction files for Roo-Code that reference the content stored in your memory bank. These instructions are stored in the `.roo/rules` directory, which Roo-Code automatically reads when providing assistance.

## Quick Start

To quickly set up the integration:

```bash
# Initialize the memory bank if you haven't already
npx umb init

# Set up Roo-Code integration
npx umb roo-setup

# Update your memory bank with project context
npx umb update activeContext currentFocus='Current development focus'
npx umb update productContext projectOverview='Project overview and goals'

# Sync memory bank changes to Roo-Code
npx umb roo-sync
```

## Detailed Setup

### 1. Install and Initialize

First, install the Memory Bank system following one of the methods in the [README.md](../README.md):

```bash
# Option 1: Install in a separate directory (Recommended)
git clone https://github.com/shipdocs/roocode-memorybank-optimized.git
cd roocode-memorybank-optimized
npm install
npm run build
npm link  # Makes the tool available globally

# Then, in your project directory
cd /path/to/your/project
npx umb init
```

> **Note:** The Memory Bank can be used with any project regardless of where it's installed, as it creates its own directory structure in the project where you run `npx umb init`. See the [README.md](../README.md) for all installation options.

### 2. Set Up Roo-Code Integration

Set up the integration with Roo-Code:

```bash
npx umb roo-setup
```

This command:
- Detects if Roo-Code is configured in your workspace
- Creates a `.roo/rules` directory if needed
- Generates initial custom instruction files based on memory bank contents

### 3. Update Your Memory Bank

Populate your memory bank with relevant context:

```bash
# Update active context
npx umb update activeContext currentFocus='Implementing feature X'
npx umb update activeContext openQuestions='How should we handle edge case Y?'

# Update product context
npx umb update productContext projectOverview='A system for managing...'
npx umb update productContext coreFeatures='- Feature A\n- Feature B'

# Add important decisions
npx umb add decision title='Use TypeScript' rationale='Type safety' implications='Learning curve' status='Implemented'
```

### 4. Sync to Roo-Code

After updating your memory bank, sync the changes to Roo-Code:

```bash
npx umb roo-sync
```

This generates updated custom instruction files in the `.roo/rules` directory based on your memory bank content.

## How It Works

The integration:

1. **Creates Custom Instructions**: Generates Markdown files in `.roo/rules` that Roo-Code reads to understand project context
2. **Maintains References**: Keeps references to memory bank files so Roo-Code knows where context is stored
3. **Auto-updates**: Can automatically update Roo-Code rules when memory bank content changes

The generated files include:
- `01-memory-bank-reference.md`: General reference to the memory bank
- `02-active-context.md`: Current development focus and open questions
- `03-product-context.md`: Project overview, goals, and features

### Generated Files Example

Here's what the generated files typically contain:

#### 01-memory-bank-reference.md

```markdown
# Memory Bank Reference

This file provides Roo with context from the memory bank located at:
`/path/to/memory-bank`

## Active Context
The active context is the current focus of development and recent changes.
Refer to this when working on the codebase to understand the current state.

## Product Context
The product context provides an overview of the project, its goals, features,
and architecture. Use this information to ensure your responses align with
the project vision.

## System Patterns
System patterns describe the architectural and design patterns used in the project.
Follow these patterns when suggesting code changes.

## Decision Log
The decision log contains important decisions and their rationale.
Respect these decisions when making suggestions.
```

#### 02-active-context.md

```markdown
# Active Development Context

## Current Focus
- Implementing memory bank integration with Roo-Code
- Creating a seamless experience for Roo users

## Recent Changes
- Added Roo-Code integration module
- Created templates for Roo rules
- Implemented auto-configuration for workspaces

## Open Questions/Issues
- What is the best way to keep Roo rules updated when memory bank changes?
- How can we provide a smooth setup experience for new users?

---
This file is automatically generated from the memory bank. Do not edit directly.
Last updated: 2023-05-05T12:34:56Z
```

#### 03-product-context.md

```markdown
# Product Context

## Project Overview
The Memory Bank system is designed to solve the problem of context loss during 
software development. It provides a structured way to document and track 
active context, product information, system patterns, and decisions.

## Goals and Objectives
- Maintain persistent memory of development work
- Provide structured documentation for projects
- Track statistics like time spent and code changes
- Integrate with development tools like Roo-Code

## Core Features
- Daily context files for tracking current work
- Session tracking based on time gaps
- Statistics tracking for development metrics
- Git integration for tracking changes
- Roo-Code integration for AI assistance

## Architecture Overview
- TypeScript-based implementation
- File-based storage using Markdown
- Hierarchical organization (daily files, sessions, archives)

---
This file is automatically generated from the memory bank. Do not edit directly.
Last updated: 2023-05-05T12:34:56Z
```

## Integration with Existing Roo-Code Configuration

If you already have custom rules in `.roomodes` or `.roo/rules`, this integration will not interfere with them. The memory bank rules are added alongside your existing rules, following Roo-Code's instruction combination order:

1. Language preferences
2. Global instructions
3. Mode-specific instructions
4. Mode-specific file instructions
5. Workspace-wide file instructions

Your existing custom rules will still be applied according to this hierarchy.

### Example: Combining with Existing Rules

If you have an existing rule file like `.roo/rules/coding-standards.md`:

```markdown
# Coding Standards

- Use 2-space indentation
- Prefer arrow functions
- Use TypeScript for all new code
```

It will work alongside the memory bank rules:

```
.roo/rules/
├── 01-memory-bank-reference.md  # From memory bank
├── 02-active-context.md         # From memory bank
├── 03-product-context.md        # From memory bank
└── coding-standards.md          # Your existing rule
```

Roo-Code will consider both your coding standards and the project context from the memory bank.

## Advanced Usage

### Programmatic Integration

You can use the Roo-Code integration programmatically:

```javascript
import { RooIntegration } from 'roocode-memorybank-optimized';

// Auto-configure for the current workspace
const integration = await RooIntegration.autoConfigureForWorkspace();

// Or with custom configuration
const customIntegration = new RooIntegration({
  memoryBankDir: '/path/to/memory-bank',
  rooRulesDir: '/path/to/.roo/rules',
  autoGenerateRules: true,
  workspaceDir: '/path/to/workspace'
});

await customIntegration.initialize();
await customIntegration.syncMemoryBankToRoo();
```

### Custom Rule Generation

You can customize how rules are generated by extending the `RooIntegration` class:

```javascript
import { RooIntegration } from 'roocode-memorybank-optimized';
import fs from 'fs-extra';
import path from 'path';

class CustomRooIntegration extends RooIntegration {
  async generateRooRules() {
    // Call the parent implementation
    await super.generateRooRules();
    
    // Add your custom rule
    const customRule = `# Custom Development Guidelines

Based on our memory bank context, follow these additional guidelines:
- Focus on the current task: ${await this.getCurrentFocus()}
- Follow our established patterns
- Consider our recent decisions

---
Custom rule generated: ${new Date().toISOString()}
`;
    
    await fs.writeFile(
      path.join(this.config.rooRulesDir, '04-custom-guidelines.md'),
      customRule
    );
    
    return true;
  }
  
  async getCurrentFocus() {
    // Get memory bank instance
    const memoryBank = this.getMemoryBank();
    const activeContextPath = path.join(memoryBank.baseDir, 'activeContext.md');
    
    if (await fs.pathExists(activeContextPath)) {
      const content = await fs.readFile(activeContextPath, 'utf8');
      const focusRegex = /## Current Focus\n([^#]*)/;
      const match = content.match(focusRegex);
      return match ? match[1].trim() : 'No current focus specified';
    }
    
    return 'No active context found';
  }
}

// Use your custom integration
const customIntegration = new CustomRooIntegration();
await customIntegration.initialize();
```

## Automated Integration

For a fully automated workflow, consider:

### 1. Post-commit Hook

Create a Git post-commit hook to update Roo-Code rules:

```bash
#!/bin/sh
# .git/hooks/post-commit

# Update the memory bank
npx umb

# Sync to Roo-Code
npx umb roo-sync
```

Make it executable:
```bash
chmod +x .git/hooks/post-commit
```

### 2. Scheduled Updates

Use cron jobs to periodically sync content:

```bash
# Example crontab entry - sync every hour
0 * * * * cd /path/to/project && npx umb roo-sync
```

### 3. Editor Integration

Create editor plugins that trigger sync on save. For example, with VS Code:

```json
// .vscode/settings.json
{
  "emeraldwalk.runonsave": {
    "commands": [
      {
        "match": ".*\\.(js|ts|jsx|tsx)$",
        "cmd": "npx umb roo-sync"
      }
    ]
  }
}
```

## Example Scenarios

### Scenario 1: New Project Setup

```bash
# Initialize a new project
mkdir my-project
cd my-project
npm init -y
git init

# Install memory bank
npm install roocode-memorybank-optimized

# Initialize memory bank
npx umb init

# Set up core project context
npx umb update productContext projectOverview='A web application for tracking fitness goals'
npx umb update productContext goalsAndObjectives='- Help users track workouts\n- Provide progress visualization\n- Support goal setting'
npx umb update productContext coreFeatures='- User authentication\n- Workout logging\n- Progress charts\n- Goal setting'

# Document initial architectural decisions
npx umb add decision title='Use React' rationale='Team expertise and component reusability' implications='Need to set up React environment' status='Implemented'
npx umb add decision title='Express backend' rationale='Simplicity and scalability' implications='Need to design REST API' status='Implemented'

# Set up initial active context
npx umb update activeContext currentFocus='Setting up project structure and dev environment'

# Set up Roo-Code integration
npx umb roo-setup
```

### Scenario 2: Daily Development Workflow

```bash
# Start of day - update active context
npx umb update activeContext currentFocus='Implementing user authentication'
npx umb update activeContext openQuestions='Should we use JWT or session-based auth?'

# Make a decision after research
npx umb add decision title='Use JWT for authentication' rationale='Better for scalability and mobile clients' implications='Need to handle token refresh' status='Implemented'

# Update active context after implementing
npx umb update activeContext currentFocus='Adding token refresh logic to auth system'
npx umb update activeContext recentChanges='Implemented JWT authentication'

# End of day - sync to Roo-Code
npx umb roo-sync
```

### Scenario 3: Team Onboarding

```bash
# Clone project repository
git clone https://github.com/example/project.git
cd project

# Install dependencies
npm install

# Explore memory bank content
cat memory-bank/productContext.md
cat memory-bank/activeContext.md
cat memory-bank/decisionLog.md

# Set up personal Roo-Code integration
npx umb roo-setup

# Start contributing with context
npx umb update activeContext currentFocus='Learning codebase and fixing initial bugs'
```

## Troubleshooting

### Common Issues

#### Roo-Code Not Detecting Rules

```
Roo-Code doesn't seem to be using the memory bank context
```

Solutions:
1. Verify rules are in the correct `.roo/rules` directory
2. Check if the rules files have the correct format
3. Restart Roo-Code to reload the rules

#### Rules Not Updating

```
Rules files aren't updating when memory bank changes
```

Solutions:
1. Make sure you run `npx umb roo-sync` after updating the memory bank
2. Check for file permission issues
3. Verify the Roo integration is properly configured

#### Integration Setup Failing

```
Failed to set up Roo-Code integration
```

Solutions:
1. Check if Roo-Code is installed
2. Verify you have write permissions for the `.roo/rules` directory
3. Run with verbose logging: `DEBUG=* npx umb roo-setup`

### Checking Configuration

To verify your setup:

```bash
# Check if .roo/rules directory exists
ls -la .roo/rules

# Check generated rule files
cat .roo/rules/01-memory-bank-reference.md
cat .roo/rules/02-active-context.md
cat .roo/rules/03-product-context.md
```

## Best Practices

### 1. Contextual Completeness

Provide comprehensive context in your memory bank:
- Document all major decisions with clear rationale
- Keep current focus up-to-date
- Include architectural patterns and project structure

### 2. Regular Updates

Keep context fresh:
- Update the memory bank at least daily
- Sync to Roo-Code after significant changes
- Document decisions as they happen, not after

### 3. Clear Descriptions

Write clear content for Roo-Code:
- Use concise, descriptive language
- Format content with proper Markdown
- Organize information logically

### 4. Automated Workflow

Set up automation:
- Use Git hooks for automatic updates
- Schedule regular sync operations
- Integrate with your CI/CD pipeline

### 5. Shell Integration

Use Roo's shell integration for a seamless workflow:
- Run Memory Bank commands directly from Roo chat
- Update context without leaving your coding environment
- Let Roo suggest context updates based on your work

## Shell Integration with Roo

The Memory Bank system can be used directly from the Roo chat interface using Roo's shell integration feature. This allows you to update your project context without switching to a terminal.

### Using UMB Commands in Roo Chat

With Roo's shell integration, you can run Memory Bank commands directly in the chat by prefixing them with `!`:

```
!umb update activeContext currentFocus='Implementing feature X'
!umb add decision title='Use TypeScript' rationale='Better type safety' implications='Need to refactor existing code' status='Implemented'
!umb update productContext coreFeatures='- Feature A\n- Feature B'
!umb roo-sync
```

### Setup Requirements

To use Memory Bank commands in Roo chat:

1. Ensure the Memory Bank is installed with the `npm link` option to make the `umb` command globally available
2. Verify that the `umb` command works in your terminal
3. Make sure Roo's shell integration is enabled

### Common Use Cases

Here are some effective ways to use Memory Bank commands in Roo chat:

1. **Update context while discussing code**:
   ```
   !umb update activeContext currentFocus='Refactoring authentication system'
   ```

2. **Record decisions during design discussions**:
   ```
   !umb add decision title='Switch to GraphQL' rationale='More efficient data fetching' implications='Need to learn GraphQL schema design' status='Pending'
   ```

3. **Sync context after making changes**:
   ```
   !umb roo-sync
   ```

4. **Check current context**:
   ```
   !cat memory-bank/activeContext.md
   ```

This integration creates a powerful workflow where code changes and context documentation happen simultaneously, with Roo acting as both a coding assistant and a Memory Bank facilitator.

### 5. Team Alignment

Ensure team consistency:
- Establish team conventions for memory bank updates
- Review memory bank content in team meetings
- Use the memory bank during onboarding
# User Guide

This comprehensive guide explains how to use the Roocode Memory Bank Optimized system efficiently for project context retention and documentation.

## Table of Contents

1. [Installation](#installation)
2. [Initialization](#initialization)
3. [Basic Concepts](#basic-concepts)
4. [Command Line Interface](#command-line-interface)
5. [Managing Active Context](#managing-active-context)
6. [Product Context](#product-context)
7. [System Patterns](#system-patterns)
8. [Decision Logging](#decision-logging)
9. [Progress Tracking](#progress-tracking)
10. [Git Integration](#git-integration)
11. [Session Tracking](#session-tracking)
12. [Statistics](#statistics)
13. [Archiving](#archiving)
14. [Roo-Code Integration](#roo-code-integration)
15. [Programmatic Usage](#programmatic-usage)
16. [Best Practices](#best-practices)
17. [Troubleshooting](#troubleshooting)

## Installation

There are two recommended ways to use this package:

### Method 1: Clone the repository in a dedicated directory

```bash
git clone https://github.com/shipdocs/roocode-memorybank-optimized.git
cd roocode-memorybank-optimized
npm install
npm run build
```

### Method 2: Download as a ZIP file

1. Download the ZIP from GitHub: https://github.com/shipdocs/roocode-memorybank-optimized/archive/refs/heads/main.zip
2. Extract to a directory of your choice
3. Navigate to the directory and run:
```bash
cd path/to/extracted/directory
npm install
npm run build
```

> **Note:** This package is not currently registered on npm. Do not clone this repository directly inside another git repository to avoid git-in-git issues.

## Initialization

Before using the memory bank, you need to initialize it:

```bash
npx umb init
```

This creates the memory bank directory structure in your current workspace:

```
memory-bank/
├── .last_update           # Timestamp of last update
├── activeContext.md       # Master active context file
├── productContext.md      # Product context file
├── systemPatterns.md      # System patterns file
├── decisionLog.md         # Decision log file
├── progress.md            # Progress tracking file
├── daily/                 # Daily context files
├── sessions/              # Session tracking files
└── archive/               # Archived files
```

## Basic Concepts

The memory bank is built around several key concepts:

- **Active Context**: What you're currently working on, recent changes, and open questions
- **Product Context**: Project overview, goals, and features
- **System Patterns**: Architectural and design patterns used in the project
- **Decisions**: Important decisions and their rationale
- **Progress**: Current, completed, and upcoming tasks

Each concept is stored in its own file and updated through the command line interface.

## Command Line Interface

The `umb` command is the primary interface for interacting with the memory bank.

### General Syntax

```bash
npx umb [command] [options]
```

### Available Commands

- `init`: Initialize the memory bank
- `help`: Show help information
- `update`: Update a specific section in a file
- `add`: Add a new item (like a decision)
- `archive`: Archive old files
- `reconstruct`: Reconstruct memory bank from Git history
- `roo-setup`: Set up Roo-Code integration
- `roo-sync`: Sync memory bank to Roo-Code rules

### Examples

```bash
# Show help
npx umb help

# Initialize memory bank
npx umb init

# Update active context
npx umb update activeContext currentFocus='Implementing new feature'

# Add a decision
npx umb add decision title='Use Redux' rationale='Centralized state management' implications='Learning curve' status='Implemented'
```

## Managing Active Context

The active context tracks what you're currently working on.

### Updating Current Focus

```bash
npx umb update activeContext currentFocus='Implementing authentication system'
```

### Recording Recent Changes

```bash
npx umb update activeContext recentChanges='Added login form validation'
```

### Documenting Open Questions

```bash
npx umb update activeContext openQuestions='How should we handle session timeout?'
```

The active context is automatically tracked in daily files (`daily/activeContext-YYYY-MM-DD.md`) and aggregated into the master file (`activeContext.md`).

## Product Context

The product context provides an overview of the project.

### Updating Project Overview

```bash
npx umb update productContext projectOverview='A web application for managing customer relationships'
```

### Defining Goals and Objectives

```bash
npx umb update productContext goalsAndObjectives='- Increase customer retention\n- Streamline communication\n- Automate follow-ups'
```

### Listing Core Features

```bash
npx umb update productContext coreFeatures='- User authentication\n- Contact management\n- Email integration\n- Reporting'
```

### Describing Architecture

```bash
npx umb update productContext architectureOverview='React frontend with Node.js backend and MongoDB database'
```

## System Patterns

System patterns document the architectural and design patterns used in the project.

### Recording Architectural Patterns

```bash
npx umb update systemPatterns architecturalPatterns='- Microservices\n- Event-driven architecture\n- REST API'
```

### Documenting Design Patterns

```bash
npx umb update systemPatterns designPatterns='- Singleton for logging\n- Observer for event handling\n- Factory for component creation'
```

### Noting Technical Decisions

```bash
npx umb update systemPatterns technicalDecisions='- TypeScript for static typing\n- Jest for testing\n- Redux for state management'
```

## Decision Logging

The decision log keeps track of important decisions and their rationale.

### Adding a Decision

```bash
npx umb add decision title='Switch to GraphQL' rationale='More efficient data fetching' implications='Need to learn GraphQL schema design' status='Pending'
```

### Decision Fields

- `title`: Short description of the decision
- `rationale`: Why the decision was made
- `implications`: What are the consequences of this decision
- `status`: Current status (Implemented, Pending, Revised)

## Progress Tracking

Progress tracking keeps track of tasks and milestones.

### Updating Current Tasks

```bash
npx umb update progress currentTasks='- Implement user authentication\n- Design dashboard UI\n- Set up database schema'
```

### Recording Completed Tasks

```bash
npx umb update progress completedTasks='- Project setup\n- Initial wireframes\n- API design'
```

### Planning Upcoming Tasks

```bash
npx umb update progress upcomingTasks='- Implement reporting feature\n- Add user roles\n- Create admin dashboard'
```

### Setting Milestones

```bash
npx umb update progress milestones='- Alpha release: End of month\n- Beta testing: Next quarter\n- V1 launch: Q4'
```

## Git Integration

The memory bank integrates with Git to track changes and reconstruct context.

### Auto-updating Based on Git History

```bash
npx umb
```

This command:
1. Analyzes your Git history
2. Tracks files modified since the last update
3. Updates statistics like time spent and lines changed
4. Creates or updates the daily context file

### Reconstructing from Git History

```bash
npx umb reconstruct 30
```

This reconstructs the memory bank based on the last 30 days of Git history.

## Session Tracking

The memory bank tracks development sessions based on time gaps.

When you run `npx umb`, it:
1. Checks if a new session should be started (based on time since last update)
2. Creates a new session file if needed
3. Updates the end time of the current session

Session files are stored in the `sessions` directory and named `session-YYYY-MM-DD-N.md`.

## Statistics

The memory bank automatically tracks the following statistics:

- Time spent on the project
- Estimated cost (based on hourly rate)
- Files created, modified, and deleted
- Lines of code added and removed
- Total lines of code

These statistics are updated when you run `npx umb` and stored in the active context file.

## Archiving

Old files are automatically archived to keep the system organized.

```bash
npx umb archive
```

This command:
1. Identifies files older than the threshold (default: 7 days)
2. Moves them to the `archive` directory
3. Organizes them by year-month

## Roo-Code Integration

The memory bank integrates with Roo-Code to provide AI assistance with project context.

### Setting Up the Integration

```bash
npx umb roo-setup
```

This command:
1. Detects if Roo-Code is used in your workspace
2. Creates the `.roo/rules` directory if needed
3. Generates initial rules based on memory bank content

### Syncing Memory Bank to Roo-Code

```bash
npx umb roo-sync
```

This command:
1. Reads the current memory bank content
2. Generates custom instruction files for Roo-Code
3. Places them in the `.roo/rules` directory

### How the Integration Works

The integration creates three main files in the `.roo/rules` directory:
1. `01-memory-bank-reference.md`: General reference to the memory bank
2. `02-active-context.md`: Current development focus and open questions
3. `03-product-context.md`: Project overview, goals, and features

Roo-Code reads these files to gain context about your project, which helps it provide more relevant assistance.

## Programmatic Usage

You can also use the memory bank programmatically:

```javascript
import { MemoryBank, RooIntegration } from 'roocode-memorybank-optimized';

// Create and initialize memory bank
const memoryBank = new MemoryBank('/path/to/memory-bank');
await memoryBank.initialize();

// Update active context
await memoryBank.updateActiveContext({
  currentFocus: 'Implementing new feature',
  recentChanges: 'Added unit tests',
  openQuestions: 'How to handle edge cases?'
});

// Set up Roo-Code integration
const rooIntegration = new RooIntegration({
  memoryBankDir: '/path/to/memory-bank',
  rooRulesDir: '/path/to/.roo/rules'
});
await rooIntegration.initialize();
await rooIntegration.syncMemoryBankToRoo();
```

## Best Practices

### Regular Updates

- Update the memory bank at the beginning and end of each work session
- Record important decisions as they happen
- Keep the active context updated when switching tasks

### Meaningful Descriptions

- Use clear, concise descriptions for current focus
- Provide detailed rationale for decisions
- Document open questions as they arise

### Integration with Development Workflow

- Set up Git hooks to remind you to update the memory bank
- Integrate with your project management tool
- Use the Roo-Code integration for AI assistance

### Team Usage

- Create a shared memory bank for team projects
- Include the memory bank in your repository
- Establish team conventions for updates

## Troubleshooting

### Common Issues

#### Command Not Found

```
Command not found: umb
```

Solution: Install the package globally or use `npx umb` instead.

#### Git Integration Not Working

```
Error: Git repository not found
```

Solution: Ensure you're running the command in a Git repository.

#### Roo-Code Integration Issues

```
Failed to sync memory bank to Roo-Code rules
```

Solution:
1. Check that Roo-Code is properly set up in your workspace
2. Ensure the `.roo/rules` directory exists and is writable
3. Run `npx umb roo-setup` to reconfigure the integration

#### File Permission Errors

```
Error: EACCES: permission denied
```

Solution: Check the file permissions in your memory bank directory.

### Getting Help

For more help, check the following resources:

- GitHub repository: [shipdocs/roocode-memorybank-optimized](https://github.com/shipdocs/roocode-memorybank-optimized)
- Issue tracker: [shipdocs/roocode-memorybank-optimized/issues](https://github.com/shipdocs/roocode-memorybank-optimized/issues)

## Further Reading

- [API Reference](API.md): Detailed API documentation
- [Roo-Code Integration](ROO-INTEGRATION.md): In-depth guide to Roo-Code integration
- [Quick Start Guide](QUICK-START.md): Simplified setup instructions
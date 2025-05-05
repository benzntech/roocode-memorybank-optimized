# Roocode Memory Bank Optimized - Usage Guide

This guide provides detailed instructions on how to use the Enhanced Memory Bank system effectively.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Advanced Usage](#advanced-usage)
5. [File Structure](#file-structure)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Introduction

The Enhanced Memory Bank system is designed to solve the problem of context loss during software development. It provides a structured way to document and track your work, making it easier to resume tasks after interruptions and maintain a clear understanding of the project's state.

### Key Concepts

- **Active Context**: What you're currently working on, recent changes, and open questions
- **Product Context**: Project overview, goals, features, and architecture
- **System Patterns**: Architectural and design patterns used in the project
- **Decision Log**: Important decisions and their rationale
- **Progress Tracking**: Current, completed, and upcoming tasks

## Installation

There are two recommended ways to use this package:

### Method 1: Clone the repository in a dedicated directory

```bash
# Clone the repository
git clone https://github.com/shipdocs/roocode-memorybank-optimized.git

# Navigate to the directory
cd roocode-memorybank-optimized

# Install dependencies
npm install

# Build the project
npm run build

# Link for global usage (optional)
npm link
```

### Method 2: Download as a ZIP file

1. Download the ZIP from GitHub: https://github.com/shipdocs/roocode-memorybank-optimized/archive/refs/heads/main.zip
2. Extract to a directory of your choice
3. Navigate to the directory and run:
```bash
cd path/to/extracted/directory
npm install
npm run build

# Link for global usage (optional)
npm link
```

> **Note:** This package is not currently registered on npm. Do not clone this repository directly inside another git repository to avoid git-in-git issues.

## Basic Usage

### Initializing the Memory Bank

Before using the memory bank, you need to initialize it:

```bash
# If installed globally
umb init

# If installed locally
npx umb init
```

This creates the necessary directory structure and initial files.

### Updating the Memory Bank

The simplest way to update the memory bank is to run the `umb` command without arguments:

```bash
umb
```

This automatically updates the memory bank based on Git history and tracks statistics.

### Updating Specific Sections

You can update specific sections of the memory bank:

```bash
# Update active context
umb update activeContext currentFocus='Implementing new feature X'
umb update activeContext recentChanges='Added unit tests for feature X'
umb update activeContext openQuestions='How to handle edge case Y?'

# Update product context
umb update productContext projectOverview='A system for project context retention'
umb update productContext goalsAndObjectives='Improve developer productivity'
umb update productContext coreFeatures='- Feature A\n- Feature B'
umb update productContext architectureOverview='Uses a modular design'

# Update system patterns
umb update systemPatterns architecturalPatterns='- MVC\n- Repository Pattern'
umb update systemPatterns designPatterns='- Singleton\n- Factory'
umb update systemPatterns technicalDecisions='- TypeScript for type safety'
```

### Adding Decisions

You can add decisions to the decision log:

```bash
umb add decision title='Switch to TypeScript' rationale='Better type safety' implications='Need to refactor existing code' status='Implemented'
```

## Advanced Usage

### Git Hooks

You can install Git hooks to automatically remind you to update the memory bank before commits:

```bash
npm run install-hooks
```

This adds a pre-commit hook that checks if the memory bank has been updated recently.

### Archiving Old Files

You can manually archive old files:

```bash
umb archive
```

This moves files older than the threshold (default: 7 days) to the archive directory.

### Reconstructing from Git History

You can reconstruct the memory bank from Git history:

```bash
# Reconstruct from the last 30 days (default)
umb reconstruct

# Reconstruct from the last 60 days
umb reconstruct 60
```

### Programmatic Usage

You can use the memory bank programmatically in your Node.js applications:

```javascript
import { MemoryBank } from 'roocode-memorybank-optimized';

// Create a new memory bank instance
const memoryBank = new MemoryBank('/path/to/memory-bank');

// Initialize the memory bank
await memoryBank.initialize();

// Update active context
await memoryBank.updateActiveContext({
  currentFocus: 'Implementing new feature',
  recentChanges: 'Added unit tests',
  openQuestions: 'How to handle edge cases?'
});

// Update product context
await memoryBank.updateProductContext({
  projectOverview: 'A system for project context retention',
  goalsAndObjectives: 'Improve developer productivity',
  coreFeatures: '- Feature A\n- Feature B',
  architectureOverview: 'Uses a modular design'
});

// Handle UMB command
const result = await memoryBank.handleUMBCommand({
  activeContext: {
    currentFocus: 'Implementing new feature'
  }
});
```

## File Structure

The memory bank creates the following directory structure:

```
memory-bank/
├── .last_update           # Timestamp of last update
├── activeContext.md       # Master active context file
├── productContext.md      # Product context file
├── systemPatterns.md      # System patterns file
├── decisionLog.md         # Decision log file
├── progress.md            # Progress tracking file
├── daily/                 # Daily context files
│   ├── activeContext-YYYY-MM-DD.md
│   └── ...
├── sessions/              # Session tracking files
│   ├── session-YYYY-MM-DD-1.md
│   └── ...
└── archive/               # Archived files
    └── YYYY-MM/           # Organized by year-month
        ├── activeContext-YYYY-MM-DD.md
        └── ...
```

### File Descriptions

- **activeContext.md**: Contains information about what you're currently working on, recent changes, and open questions.
- **productContext.md**: Contains information about the project's overview, goals, features, and architecture.
- **systemPatterns.md**: Contains information about architectural and design patterns used in the project.
- **decisionLog.md**: Contains a log of important decisions, their rationale, and implications.
- **progress.md**: Contains information about current, completed, and upcoming tasks.

## Best Practices

### Regular Updates

Update the memory bank regularly, ideally:
- At the start of each work session
- After completing a significant task
- Before ending a work session
- Before committing code

### Detailed Context

Provide detailed context in your updates:
- Be specific about what you're working on
- Document recent changes with clear descriptions
- Note any open questions or issues
- Record important decisions and their rationale

### Integration with Workflow

Integrate the memory bank into your workflow:
- Use Git hooks to remind you to update the memory bank
- Include memory bank updates in your code review process
- Reference memory bank entries in commit messages

## Troubleshooting

### Common Issues

#### Memory Bank Not Updating

If the memory bank is not updating, check:
- If you have the necessary permissions to write to the memory bank directory
- If the memory bank has been initialized (`umb init`)
- If there are any errors in the console output

#### Git Hooks Not Working

If Git hooks are not working, check:
- If the hooks have been installed (`npm run install-hooks`)
- If the hooks have the correct permissions (executable)
- If the hooks are in the correct location (`.git/hooks`)

#### Reconstruction Failing

If reconstruction from Git history is failing, check:
- If the repository has a valid Git history
- If you have the necessary permissions to access the Git history
- If there are any errors in the console output

### Getting Help

If you encounter any issues not covered in this guide, please:
- Check the [GitHub repository](https://github.com/shipdocs/roocode-memorybank-optimized) for known issues
- Open a new issue on GitHub with a detailed description of the problem
- Contact the maintainers for support
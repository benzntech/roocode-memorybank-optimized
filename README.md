# VibeCoding Memory Bank

A powerful system for project context retention and documentation that helps developers maintain a persistent memory of their work, with Roo-Code integration.
May work with other tools as well, or change it so it does

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

The Memory Bank system is designed to solve the problem of context loss during software development. It provides a structured way to document and track:

- **Active Context**: What you're currently working on
- **Product Context**: Project overview, goals, features
- **System Patterns**: Architectural and design patterns
- **Decision Logs**: Important decisions and their rationale
- **Progress Tracking**: Current, completed, and upcoming tasks

The system automatically tracks statistics like time spent, estimated cost, files modified, and lines of code changed.

## Features

- **Daily Context Files**: Automatically creates and manages daily context files
- **Session Tracking**: Tracks development sessions based on time gaps
- **Statistics Tracking**: Monitors development metrics like time spent and code changes
- **Git Integration**: Uses Git history to track file changes and reconstruct context
- **Archiving**: Automatically archives old files to keep the system organized
- **Command Line Interface**: Simple CLI for updating and managing the memory bank
- **Roo-Code Integration**: Seamlessly integrates with Roo-Code AI assistant

## Quick Start

### Installation

```bash
# Install from npm
npm install vibecoding-memory-bank

# Or clone and install locally
git clone https://github.com/vibecoding/memory-bank.git
cd memory-bank
npm install
npm run build
```

### Initialize the Memory Bank

```bash
# If installed globally or via npx
npx umb init

# If installed locally
npm run umb init
```

### Update the Memory Bank

```bash
# Auto-update based on Git history
npx umb

# Update specific sections
npx umb update activeContext currentFocus='Implementing new feature X'
npx umb update productContext coreFeatures='- Feature A\n- Feature B'
```

### Roo-Code Integration

Set up and use the Roo-Code integration to provide project context to the AI assistant:

```bash
# Set up Roo-Code integration
npx umb roo-setup

# After updating memory bank, sync with Roo-Code
npx umb roo-sync
```

### Install Git Hooks

```bash
# Install Git hooks for automatic reminders
npm run install-hooks
```

## Detailed Usage

### Command Line Interface

The `umb` command provides a simple interface to the memory bank:

```bash
# Show help
npx umb help

# Initialize the memory bank
npx umb init

# Archive old files
npx umb archive

# Reconstruct from Git history (default: 30 days)
npx umb reconstruct 60

# Update active context
npx umb update activeContext currentFocus='Implementing enhanced memory bank'

# Add a decision
npx umb add decision title='Switch to TypeScript' rationale='Better type safety' implications='Need to refactor existing code' status='Implemented'

# Roo-Code integration commands
npx umb roo-setup
npx umb roo-sync
```

### Programmatic Usage

```javascript
import { MemoryBank, RooIntegration } from 'vibecoding-memory-bank';

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

// Set up Roo-Code integration
const rooIntegration = new RooIntegration({
  memoryBankDir: '/path/to/memory-bank',
  workspaceDir: '/path/to/workspace'
});
await rooIntegration.initialize();
await rooIntegration.syncMemoryBankToRoo();
```

## Directory Structure

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

## Configuration

You can configure the memory bank by passing options to the `MemoryBank` constructor:

```javascript
const memoryBank = new MemoryBank({
  baseDir: '/path/to/memory-bank',
  dailyDirName: 'daily',
  sessionsDirName: 'sessions',
  archiveDirName: 'archive',
  sessionTimeoutHours: 2,
  archiveThresholdDays: 7,
  developerHourlyRate: 60
});
```

For Roo-Code integration, you can configure:

```javascript
const rooIntegration = new RooIntegration({
  memoryBankDir: '/path/to/memory-bank',
  rooRulesDir: '/path/to/.roo/rules',
  autoGenerateRules: true,
  workspaceDir: '/path/to/workspace'
});
```

## Integration with Other Tools

The memory bank system can be integrated with other tools:

- **Git Hooks**: Automatically remind you to update the memory bank before commits
- **CI/CD Pipelines**: Update the memory bank as part of your CI/CD process
- **Project Management Tools**: Link memory bank updates to your project management workflow
- **Roo-Code**: Integrate with Roo-Code to provide context to the AI assistant

### Roo-Code Integration

The memory bank system integrates seamlessly with Roo-Code, an AI-powered autonomous coding agent. This integration allows Roo-Code to access your project context, decisions, and patterns.

```bash
# Set up Roo-Code integration
npx umb roo-setup

# After updating memory bank, sync with Roo-Code
npx umb roo-sync
```

For detailed instructions, see [Roo-Code Integration](docs/ROO-INTEGRATION.md).

## Documentation

- [Quick Start Guide](docs/QUICK-START.md) - Get started quickly
- [User Guide](docs/USER-GUIDE.md) - Complete usage instructions
- [API Reference](docs/API.md) - API documentation for developers
- [Roo-Code Integration](docs/ROO-INTEGRATION.md) - Integration with Roo-Code

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

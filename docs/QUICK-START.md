# Quick Start Guide

This guide will help you quickly set up and start using the Roocode Memory Bank Optimized, including the Roo-Code integration.

## Installation

The Memory Bank system can be installed and used in several ways:

### Option 1: Install in a separate directory (Recommended)

This approach keeps the Memory Bank separate from your projects but still allows you to use it with any project.

```bash
# Clone the repository in a dedicated directory
git clone https://github.com/shipdocs/roocode-memorybank-optimized.git
cd roocode-memorybank-optimized
npm install
npm run build
npm link  # Makes the tool available globally
```

Then, in any project where you want to use it:

```bash
# Initialize the memory bank in your project
cd /path/to/your/project
npx umb init
```

### Option 2: Download as a ZIP file

1. Download the ZIP from GitHub: https://github.com/shipdocs/roocode-memorybank-optimized/archive/refs/heads/main.zip
2. Extract to a directory of your choice
3. Navigate to the directory and run:
```bash
cd path/to/extracted/directory
npm install
npm run build
npm link  # Makes the tool available globally
```

### Option 3: Install directly in your project (Advanced)

If you want to include the Memory Bank directly in your project:

```bash
# 1. Navigate to your project root
cd /path/to/your/project

# 2. Clone the repository
git clone https://github.com/shipdocs/roocode-memorybank-optimized.git

# 3. Remove the .git directory to avoid git-in-git issues
cd roocode-memorybank-optimized
rm -rf .git

# 4. Install and build
npm install
npm run build
```

> **Note:** The Memory Bank can be used with any project regardless of where it's installed, as it creates its own directory structure in the project where you run `npx umb init`.

## Basic Setup

### Initialize the Memory Bank

First, initialize the memory bank to create the necessary directory structure:

```bash
npx umb init
```

This creates a `memory-bank` directory in your current workspace with the following structure:

```
memory-bank/
├── activeContext.md 
├── productContext.md
├── systemPatterns.md
├── decisionLog.md
├── progress.md
├── daily/
├── sessions/
└── archive/
```

## Daily Usage

### Record Your Current Focus

When starting work on a new task or feature, update your active context:

```bash
npx umb update activeContext currentFocus='Implementing feature X'
```

### Document Open Questions

Keep track of questions that arise during development:

```bash
npx umb update activeContext openQuestions='How should we handle error states?'
```

### Record Important Decisions

When you make a significant decision, add it to the decision log:

```bash
npx umb add decision title='Use React hooks' rationale='Better component composition' implications='Need to refactor class components' status='Implemented'
```

### Auto-Update Based on Git

To automatically update the memory bank based on Git history:

```bash
npx umb
```

This analyzes your Git history to track changes, time spent, and files modified.

## Roo-Code Integration

### Setup Roo-Code Integration

To integrate with Roo-Code:

```bash
npx umb roo-setup
```

This sets up the necessary files and directories for Roo-Code to access your memory bank.

### Update Roo-Code Rules

After updating your memory bank, sync the changes to Roo-Code:

```bash
npx umb roo-sync
```

## Examples

### Complete Workflow Example

```bash
# Initialize memory bank
npx umb init

# Start working on a new feature
npx umb update activeContext currentFocus='Adding authentication system'
npx umb update activeContext openQuestions='What authentication provider should we use?'

# Make a decision
npx umb add decision title='Use JWT for authentication' rationale='Better scalability' implications='Need to handle token refresh' status='Implemented'

# Update product context
npx umb update productContext coreFeatures='- User authentication\n- Role-based access control\n- Password reset'

# Set up Roo-Code integration
npx umb roo-setup

# After making changes, sync with Roo-Code
npx umb roo-sync
```

## Next Steps

- Read the full [User Guide](USER-GUIDE.md) for complete usage instructions
- Check out the [Roo-Code Integration](ROO-INTEGRATION.md) documentation for advanced integration options
- Explore the [API Reference](API.md) if you want to use the memory bank programmatically
# Memory Bank

This directory contains the memory bank for your project.
It helps maintain context and documentation across development sessions.

## Structure

- daily/: Daily context files
- sessions/: Session tracking files
- archive/: Archived files

## Usage

This directory is automatically populated when you initialize and use the memory bank.
The content of this directory is excluded from git to avoid committing user-specific data.

To initialize the memory bank, run:

```bash
npx umb init
```

Or programmatically:

```javascript
const { MemoryBank } = require('roocode-memorybank-optimized');
const memoryBank = new MemoryBank();
await memoryBank.initialize();

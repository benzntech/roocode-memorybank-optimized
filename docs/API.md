# API Reference

This document provides a comprehensive reference for developers who want to use the Roocode Memory Bank Optimized programmatically. It covers all the available classes, interfaces, methods, and their parameters.

## Table of Contents

1. [MemoryBank Class](#memorybank-class)
2. [EnhancedMemoryBank Class](#enhancedmemorybank-class)
3. [RooIntegration Class](#roointegration-class)
4. [Interfaces](#interfaces)
5. [Utility Functions](#utility-functions)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)

## MemoryBank Class

The `MemoryBank` class is the primary interface for interacting with the memory bank system.

### Constructor

```typescript
constructor(baseDir?: string)
```

Creates a new Memory Bank instance.

**Parameters:**
- `baseDir` (optional): Base directory for the memory bank (default: `process.cwd()/memory-bank`)

**Example:**
```javascript
import { MemoryBank } from 'roocode-memorybank-optimized';

// With default directory
const memoryBank = new MemoryBank();

// With custom directory
const customMemoryBank = new MemoryBank('/path/to/memory-bank');
```

### Methods

#### initialize

```typescript
public async initialize(): Promise<boolean>
```

Initializes the memory bank by creating necessary directories and files.

**Returns:** `Promise<boolean>` - True if initialization was successful

**Example:**
```javascript
const success = await memoryBank.initialize();
if (success) {
  console.log('Memory bank initialized successfully');
}
```

#### updateProductContext

```typescript
public async updateProductContext(update: {
  projectOverview?: string;
  goalsAndObjectives?: string;
  coreFeatures?: string;
  architectureOverview?: string;
}): Promise<boolean>
```

Updates the product context with the specified information.

**Parameters:**
- `update`: Object containing sections to update
  - `projectOverview` (optional): Project overview text
  - `goalsAndObjectives` (optional): Goals and objectives text
  - `coreFeatures` (optional): Core features text
  - `architectureOverview` (optional): Architecture overview text

**Returns:** `Promise<boolean>` - True if update was successful

**Example:**
```javascript
const success = await memoryBank.updateProductContext({
  projectOverview: 'A web application for managing customer relationships',
  coreFeatures: '- User authentication\n- Contact management\n- Email integration'
});
```

#### updateActiveContext

```typescript
public async updateActiveContext(update: {
  currentFocus?: string;
  recentChanges?: string;
  openQuestions?: string;
}): Promise<boolean>
```

Updates the active context with the specified information.

**Parameters:**
- `update`: Object containing sections to update
  - `currentFocus` (optional): Current focus text
  - `recentChanges` (optional): Recent changes text
  - `openQuestions` (optional): Open questions text

**Returns:** `Promise<boolean>` - True if update was successful

**Example:**
```javascript
const success = await memoryBank.updateActiveContext({
  currentFocus: 'Implementing user authentication',
  recentChanges: 'Added login form validation',
  openQuestions: 'How should we handle password reset?'
});
```

#### handleUMBCommand

```typescript
public async handleUMBCommand(updates: {
  productContext?: { /* ... */ };
  activeContext?: { /* ... */ };
  systemPatterns?: { /* ... */ };
  decision?: { /* ... */ };
  progress?: { /* ... */ };
}): Promise<{ success: boolean; message: string }>
```

Handles a UMB command by updating multiple parts of the memory bank.

**Parameters:**
- `updates`: Object containing updates for different parts of the memory bank
  - `productContext` (optional): Product context updates
  - `activeContext` (optional): Active context updates
  - `systemPatterns` (optional): System patterns updates
  - `decision` (optional): Decision to add
  - `progress` (optional): Progress updates

**Returns:** `Promise<{ success: boolean; message: string }>` - Result object with success status and message

**Example:**
```javascript
const result = await memoryBank.handleUMBCommand({
  activeContext: {
    currentFocus: 'Implementing authentication'
  },
  decision: {
    title: 'Use JWT',
    rationale: 'Better for scalability',
    implications: 'Need to handle token refresh',
    status: 'Implemented'
  }
});

console.log(result.message);
```

## EnhancedMemoryBank Class

The `EnhancedMemoryBank` class provides the core functionality for the memory bank system.

### Constructor

```typescript
constructor(config: MemoryBankConfig)
```

Creates a new Enhanced Memory Bank instance.

**Parameters:**
- `config`: Configuration options for the memory bank

**Example:**
```javascript
import { EnhancedMemoryBank, MemoryBankConfig } from 'roocode-memorybank-optimized';

const config: MemoryBankConfig = {
  baseDir: '/path/to/memory-bank',
  dailyDirName: 'daily',
  sessionTimeoutHours: 3
};

const enhancedMemoryBank = new EnhancedMemoryBank(config);
```

### Methods

#### initialize

```typescript
public async initialize(): Promise<boolean>
```

Initializes the enhanced memory bank by creating necessary directories.

**Returns:** `Promise<boolean>` - True if initialization was successful

#### getDateString

```typescript
public getDateString(date: Date = new Date()): string
```

Gets the current date in YYYY-MM-DD format.

**Parameters:**
- `date` (optional): Date to format (defaults to current date)

**Returns:** `string` - Formatted date string

#### getTimestamp

```typescript
public getTimestamp(): string
```

Gets the current timestamp in a consistent format.

**Returns:** `string` - Formatted timestamp string

#### readFile

```typescript
public async readFile(filePath: string): Promise<string>
```

Reads a file and returns its content.

**Parameters:**
- `filePath`: Path to the file

**Returns:** `Promise<string>` - File content as string

#### writeFile

```typescript
public async writeFile(filePath: string, content: string): Promise<boolean>
```

Writes content to a file.

**Parameters:**
- `filePath`: Path to the file
- `content`: Content to write

**Returns:** `Promise<boolean>` - True if write was successful

#### extractSection

```typescript
public extractSection(content: string, sectionHeader: string): string
```

Extracts a section from markdown content.

**Parameters:**
- `content`: Markdown content
- `sectionHeader`: Section header to extract

**Returns:** `string` - Extracted section content

#### updateSection

```typescript
public updateSection(content: string, sectionHeader: string, newContent: string): string
```

Updates a section in markdown content.

**Parameters:**
- `content`: Markdown content
- `sectionHeader`: Section header to update
- `newContent`: New content for the section

**Returns:** `string` - Updated markdown content

#### Other Methods

The `EnhancedMemoryBank` class provides additional methods for managing daily files, sessions, and statistics:

- `createDailyFile(date: Date = new Date()): Promise<string>`
- `getLatestDailyFile(pattern: string): Promise<string | null>`
- `shouldStartNewSession(): Promise<boolean>`
- `createSessionFile(): Promise<string>`
- `getCurrentSessionFile(): Promise<string | null>`
- `updateSessionEndTime(sessionFile: string): Promise<boolean>`
- `archiveOldFiles(): Promise<boolean>`
- `loadContext(): Promise<boolean>`
- `trackStatistics(): Promise<Statistics>`
- `updateDailyActiveContext(update: { /* ... */ }): Promise<boolean>`
- `aggregateDailyFiles(): Promise<boolean>`
- `reconstructMemoryBank(days: number = 30): Promise<{ success: boolean; message: string }>`

## RooIntegration Class

The `RooIntegration` class provides integration between the Memory Bank system and Roo-Code.

### Constructor

```typescript
constructor(config: RooIntegrationConfig = {})
```

Creates a new Roo-Code integration instance.

**Parameters:**
- `config` (optional): Configuration options for the integration

**Example:**
```javascript
import { RooIntegration } from 'roocode-memorybank-optimized';

// With default configuration
const rooIntegration = new RooIntegration();

// With custom configuration
const customRooIntegration = new RooIntegration({
  memoryBankDir: '/path/to/memory-bank',
  rooRulesDir: '/path/to/.roo/rules',
  autoGenerateRules: true,
  workspaceDir: '/path/to/workspace'
});
```

### Methods

#### initialize

```typescript
public async initialize(): Promise<boolean>
```

Initializes the Roo-Code integration.

**Returns:** `Promise<boolean>` - True if initialization was successful

**Example:**
```javascript
const success = await rooIntegration.initialize();
```

#### generateRooRules

```typescript
public async generateRooRules(): Promise<boolean>
```

Generates Roo-Code custom instruction files from memory bank content.

**Returns:** `Promise<boolean>` - True if generation was successful

**Example:**
```javascript
const success = await rooIntegration.generateRooRules();
```

#### updateRooRules

```typescript
public async updateRooRules(): Promise<boolean>
```

Updates Roo-Code rules with current memory bank content.

**Returns:** `Promise<boolean>` - True if update was successful

**Example:**
```javascript
const success = await rooIntegration.updateRooRules();
```

#### syncMemoryBankToRoo

```typescript
public async syncMemoryBankToRoo(): Promise<boolean>
```

Syncs memory bank changes to Roo-Code rules.

**Returns:** `Promise<boolean>` - True if sync was successful

**Example:**
```javascript
const success = await rooIntegration.syncMemoryBankToRoo();
```

#### getMemoryBank

```typescript
public getMemoryBank(): MemoryBank
```

Gets the memory bank instance.

**Returns:** `MemoryBank` - The memory bank instance

**Example:**
```javascript
const memoryBank = rooIntegration.getMemoryBank();
await memoryBank.updateActiveContext({ currentFocus: 'New focus' });
```

#### autoConfigureForWorkspace (static)

```typescript
public static async autoConfigureForWorkspace(
  workspacePath: string = process.cwd()
): Promise<RooIntegration | null>
```

Auto-detects and configures for a Roo-Code workspace.

**Parameters:**
- `workspacePath` (optional): Path to the workspace root (defaults to current directory)

**Returns:** `Promise<RooIntegration | null>` - Configured integration instance or null if not a Roo-Code workspace

**Example:**
```javascript
const integration = await RooIntegration.autoConfigureForWorkspace('/path/to/workspace');
if (integration) {
  await integration.syncMemoryBankToRoo();
}
```

## Interfaces

### MemoryBankConfig

```typescript
interface MemoryBankConfig {
  /** Base directory for the memory bank */
  baseDir: string;
  /** Directory name for daily files */
  dailyDirName?: string;
  /** Directory name for session files */
  sessionsDirName?: string;
  /** Directory name for archived files */
  archiveDirName?: string;
  /** Session timeout in hours */
  sessionTimeoutHours?: number;
  /** Archive threshold in days */
  archiveThresholdDays?: number;
  /** Developer hourly rate for cost estimation */
  developerHourlyRate?: number;
}
```

### RooIntegrationConfig

```typescript
interface RooIntegrationConfig {
  /** Base directory for the memory bank (defaults to ./memory-bank) */
  memoryBankDir?: string;
  /** Directory where Roo rules will be stored (defaults to .roo/rules) */
  rooRulesDir?: string;
  /** Automatically generate Roo rules from memory bank content */
  autoGenerateRules?: boolean;
  /** Workspace root directory */
  workspaceDir?: string;
}
```

### Statistics

```typescript
interface Statistics {
  timeSpent: string;
  estimatedCost: number;
  filesCreated: number;
  filesModified: number;
  filesDeleted: number;
  linesAdded: number;
  linesRemoved: number;
  totalLines: number;
}
```

## Utility Functions

The following utility functions are re-exported from the memory bank for convenience:

```typescript
import {
  getDateString,
  getTimestamp,
  createDailyFile,
  getLatestDailyFile,
  shouldStartNewSession,
  createSessionFile,
  getCurrentSessionFile,
  updateSessionEndTime,
  archiveOldFiles,
  loadContext,
  trackStatistics,
  updateDailyActiveContext,
  aggregateDailyFiles,
  reconstructMemoryBank
} from 'vibecoding-memory-bank';
```

These functions provide direct access to specific functionality without needing to create a memory bank instance.

## Error Handling

The Memory Bank system uses try-catch blocks for error handling and returns boolean values to indicate success or failure for most operations.

```javascript
try {
  const success = await memoryBank.updateActiveContext({
    currentFocus: 'Implementing new feature'
  });
  
  if (!success) {
    console.error('Failed to update active context');
  }
} catch (error) {
  console.error('Error updating active context:', error);
}
```

For more complex operations, a result object with success status and message is returned:

```javascript
const result = await memoryBank.handleUMBCommand({
  activeContext: {
    currentFocus: 'Implementing new feature'
  }
});

if (!result.success) {
  console.error(result.message);
}
```

## Best Practices

### Initialization

Always initialize the memory bank before using it:

```javascript
const memoryBank = new MemoryBank('/path/to/memory-bank');
await memoryBank.initialize();
```

### Update Operations

For better performance, batch updates when possible:

```javascript
// Good: Batch updates
await memoryBank.handleUMBCommand({
  activeContext: {
    currentFocus: 'New feature',
    openQuestions: 'How to handle edge cases?'
  },
  productContext: {
    coreFeatures: 'Updated feature list'
  }
});

// Less efficient: Separate updates
await memoryBank.updateActiveContext({ currentFocus: 'New feature' });
await memoryBank.updateActiveContext({ openQuestions: 'How to handle edge cases?' });
await memoryBank.updateProductContext({ coreFeatures: 'Updated feature list' });
```

### Error Handling

Always check the result of operations:

```javascript
const success = await memoryBank.updateActiveContext({
  currentFocus: 'New feature'
});

if (!success) {
  // Handle failure
}
```

### Path Handling

Use `path.join()` for cross-platform path construction:

```javascript
import path from 'path';

const filePath = path.join(baseDir, 'activeContext.md');
```

### Roo-Code Integration

When integrating with Roo-Code, update rules after significant changes:

```javascript
// Update memory bank
await memoryBank.updateActiveContext({ currentFocus: 'New focus' });

// Sync changes to Roo-Code
await rooIntegration.syncMemoryBankToRoo();
```
import fs from 'fs-extra';
import path from 'path';
import { EnhancedMemoryBank, Statistics } from './enhanced-memory-bank';

/**
 * Options for the MemoryBank constructor.
 */
export interface MemoryBankOptions {
  /**
   * Absolute or relative path to the base directory for the memory bank.
   * If provided, this takes precedence over projectName.
   */
  baseDir?: string;
  /**
   * Name of the project. If provided (and baseDir is not), the memory bank
   * will be created in a directory with this name within the current working directory.
   * e.g., path.join(process.cwd(), projectName)
   */
  projectName?: string;
}

/**
 * Memory Bank Manager
 *
 * This class provides a simplified interface to the Enhanced Memory Bank system.
 * It handles the initialization, configuration, and operations of the memory bank.
 */
export class MemoryBank {
  private _enhancedMemoryBank: EnhancedMemoryBank;
  private baseDir: string;
  private productContextPath: string;
  private activeContextPath: string;
  private systemPatternsPath: string;
  private decisionLogPath: string;
  private progressPath: string;
  private lastUpdatePath: string;

  /**
   * Create a new Memory Bank instance.
   * @param options Optional configuration for base directory or project name, or a string for baseDir for backward compatibility.
   *                - If options is a string, it's treated as `baseDir`.
   *                - If options is an object:
   *                  - `options.baseDir`: Specifies the exact base directory.
   *                  - `options.projectName`: Creates a directory named `projectName` in `process.cwd()`.
   *                - If no options are provided, defaults to `path.join(process.cwd(), 'memory-bank')`.
   */
  constructor(options?: MemoryBankOptions | string) {
    if (typeof options === 'string') {
      // Backward compatibility: if a string is passed, treat it as baseDir
      this.baseDir = options;
    } else if (options?.baseDir) {
      this.baseDir = options.baseDir;
    } else if (options?.projectName) {
      this.baseDir = path.join(process.cwd(), options.projectName);
    } else {
      this.baseDir = path.join(process.cwd(), 'memory-bank');
    }

    // Initialize the enhanced memory bank
    this._enhancedMemoryBank = new EnhancedMemoryBank({
      baseDir: this.baseDir
    });

    // Define file paths
    this.productContextPath = path.join(this.baseDir, 'productContext.md');
    this.activeContextPath = path.join(this.baseDir, 'activeContext.md');
    this.systemPatternsPath = path.join(this.baseDir, 'systemPatterns.md');
    this.decisionLogPath = path.join(this.baseDir, 'decisionLog.md');
    this.progressPath = path.join(this.baseDir, 'progress.md');
    this.lastUpdatePath = path.join(this.baseDir, '.last_update');
  }

  // Public methods to expose EnhancedMemoryBank functionality
  public getTimestamp(): string {
    return this._enhancedMemoryBank.getTimestamp();
  }

  public getDateString(date?: Date): string {
    return this._enhancedMemoryBank.getDateString(date);
  }

  public async createDailyFile(date?: Date): Promise<string> {
    return this._enhancedMemoryBank.createDailyFile(date);
  }

  public async getLatestDailyFile(): Promise<string | null> {
    return this._enhancedMemoryBank.getLatestDailyFile();
  }

  public async shouldStartNewSession(): Promise<boolean> {
    return this._enhancedMemoryBank.shouldStartNewSession();
  }

  public async createSessionFile(): Promise<string> {
    return this._enhancedMemoryBank.createSessionFile();
  }

  public async getCurrentSessionFile(): Promise<string | null> {
    return this._enhancedMemoryBank.getCurrentSessionFile();
  }

  public async updateSessionEndTime(filePath: string): Promise<boolean> {
    return this._enhancedMemoryBank.updateSessionEndTime(filePath);
  }

  public async archiveOldFiles(): Promise<boolean> {
    return this._enhancedMemoryBank.archiveOldFiles();
  }

  public async loadContext(): Promise<boolean> {
    return this._enhancedMemoryBank.loadContext();
  }

  public async trackStatistics(): Promise<Statistics> {
    return this._enhancedMemoryBank.trackStatistics();
  }

  public async updateDailyActiveContext(update: any): Promise<boolean> {
    return this._enhancedMemoryBank.updateDailyActiveContext(update);
  }

  public async aggregateDailyFiles(): Promise<boolean> {
    return this._enhancedMemoryBank.aggregateDailyFiles();
  }

  public async reconstructMemoryBank(): Promise<boolean> {
    return this._enhancedMemoryBank.reconstructMemoryBank();
  }

  /**
   * Initialize the memory bank
   * @returns True if initialization was successful
   */
  public async initialize(): Promise<boolean> {
    try {
      // Initialize the enhanced memory bank
      const success = await this._enhancedMemoryBank.initialize();

      // Create master files if they don't exist
      if (success) {
        await this.createMasterFiles();
      }

      return success;
    } catch (error) {
      console.error('Error initializing memory bank:', error);
      return false;
    }
  }

  /**
   * Create master files if they don't exist
   */
  private async createMasterFiles(): Promise<void> {
    const date = new Date();
    const timestamp = this._enhancedMemoryBank.getTimestamp();

    // Create productContext.md
    if (!await fs.pathExists(this.productContextPath)) {
      const content = `# Product Context

## Project Overview
- 

## Goals and Objectives
- 

## Core Features
- 

## Architecture Overview
- 

---
Footnotes:
[${timestamp}] - Created product context
`;
      await fs.writeFile(this.productContextPath, content, 'utf8');
    }

    // Create activeContext.md
    if (!await fs.pathExists(this.activeContextPath)) {
      const content = `# Active Context

## Current Focus
- 

## Recent Changes
- 

## Open Questions/Issues
- 

## Statistics
- Time Spent: 0h 0m
- Estimated Cost: $0
- Files Created: 0
- Files Modified: 0
- Files Deleted: 0
- Lines of Code Added: 0
- Lines of Code Removed: 0
- Total Lines of Code: 0
`;
      await fs.writeFile(this.activeContextPath, content, 'utf8');
    }

    // Create systemPatterns.md
    if (!await fs.pathExists(this.systemPatternsPath)) {
      const content = `# System Patterns

## Architectural Patterns
- 

## Design Patterns
- 

## Technical Decisions
- 

---
[${timestamp}] - Created system patterns
`;
      await fs.writeFile(this.systemPatternsPath, content, 'utf8');
    }

    // Create decisionLog.md
    if (!await fs.pathExists(this.decisionLogPath)) {
      const content = `# Decision Log

## Decisions
- 

`;
      await fs.writeFile(this.decisionLogPath, content, 'utf8');
    }

    // Create progress.md
    if (!await fs.pathExists(this.progressPath)) {
      const content = `# Progress

## Current Tasks
- 

## Completed Tasks
- 

## Upcoming Tasks
- 

## Milestones
- 

`;
      await fs.writeFile(this.progressPath, content, 'utf8');
    }
  }

  /**
   * Update product context
   * @param update Update object with sections to update
   * @returns True if update was successful
   */
  public async updateProductContext(update: {
    projectOverview?: string;
    goalsAndObjectives?: string;
    coreFeatures?: string;
    architectureOverview?: string;
  }): Promise<boolean> {
    try {
      const content = await this._enhancedMemoryBank.readFile(this.productContextPath);
      let updatedContent = content;

      if (update.projectOverview) {
        updatedContent = this._enhancedMemoryBank.updateSection(
          updatedContent,
          '## Project Overview',
          update.projectOverview
        );
      }

      if (update.goalsAndObjectives) {
        updatedContent = this._enhancedMemoryBank.updateSection(
          updatedContent,
          '## Goals and Objectives',
          update.goalsAndObjectives
        );
      }

      if (update.coreFeatures) {
        updatedContent = this._enhancedMemoryBank.updateSection(
          updatedContent,
          '## Core Features',
          update.coreFeatures
        );
      }

      if (update.architectureOverview) {
        updatedContent = this._enhancedMemoryBank.updateSection(
          updatedContent,
          '## Architecture Overview',
          update.architectureOverview
        );
      }

      // Add timestamp to footnotes
      const timestamp = this._enhancedMemoryBank.getTimestamp();
      updatedContent = updatedContent.replace(
        /---\nFootnotes:\n([\s\S]*?)$/,
        `---\nFootnotes:\n[${timestamp}] - Updated product context\n`
      );

      return await this._enhancedMemoryBank.writeFile(this.productContextPath, updatedContent);
    } catch (error) {
      console.error('Error updating product context:', error);
      return false;
    }
  }

  /**
   * Update active context
   * @param update Update object with sections to update
   * @returns True if update was successful
   */
  public async updateActiveContext(update: {
    currentFocus?: string;
    recentChanges?: string;
    openQuestions?: string;
  }): Promise<boolean> {
    try {
      // First update the daily active context file
      const dailyUpdateSuccess = await this._enhancedMemoryBank.updateDailyActiveContext(update);

      // Then update the master active context file for backward compatibility
      const content = await this._enhancedMemoryBank.readFile(this.activeContextPath);
      let updatedContent = content;

      if (update.currentFocus) {
        updatedContent = this._enhancedMemoryBank.updateSection(
          updatedContent,
          '## Current Focus',
          update.currentFocus
        );
      }

      // Add new recent change at the top of the list
      if (update.recentChanges) {
        const timestamp = this._enhancedMemoryBank.getTimestamp();
        updatedContent = updatedContent.replace(
          /## Recent Changes\n/,
          `## Recent Changes\n[${timestamp}] - ${update.recentChanges}\n`
        );
      }

      if (update.openQuestions) {
        updatedContent = this._enhancedMemoryBank.updateSection(
          updatedContent,
          '## Open Questions/Issues',
          update.openQuestions
        );
      }

      const masterUpdateSuccess = await this._enhancedMemoryBank.writeFile(this.activeContextPath, updatedContent);

      // Update the last update timestamp
      await fs.writeFile(this.lastUpdatePath, new Date().toISOString());

      return dailyUpdateSuccess && masterUpdateSuccess;
    } catch (error) {
      console.error('Error updating active context:', error);
      return false;
    }
  }

  /**
   * Handle UMB command
   * @param updates Update object with sections to update
   * @returns Result object with success status and message
   */
  public async handleUMBCommand(updates: {
    productContext?: {
      projectOverview?: string;
      goalsAndObjectives?: string;
      coreFeatures?: string;
      architectureOverview?: string;
    };
    activeContext?: {
      currentFocus?: string;
      recentChanges?: string;
      openQuestions?: string;
    };
    systemPatterns?: {
      architecturalPatterns?: string;
      designPatterns?: string;
      technicalDecisions?: string;
    };
    decision?: {
      title: string;
      rationale: string;
      implications: string;
      status: 'Implemented' | 'Pending' | 'Revised';
    };
    progress?: {
      currentTasks?: string[];
      completedTasks?: string[];
      upcomingTasks?: string[];
      milestones?: { title: string; description?: string }[];
    };
  }): Promise<{ success: boolean; message: string }> {
    try {
      let updatedFiles = [];

      // Check if we need to start a new session
      const startNewSession = await this._enhancedMemoryBank.shouldStartNewSession();
      let sessionFile = await this._enhancedMemoryBank.getCurrentSessionFile();

      if (startNewSession) {
        // Load context from previous day if needed
        await this._enhancedMemoryBank.loadContext();

        // Create a new session file
        sessionFile = await this._enhancedMemoryBank.createSessionFile();
        console.log(`Started new session: ${sessionFile}`);
      } else if (sessionFile) {
        // Update the end time of the current session
        await this._enhancedMemoryBank.updateSessionEndTime(sessionFile);
        console.log(`Updated session: ${sessionFile}`);
      } else {
        // No current session, create one
        sessionFile = await this._enhancedMemoryBank.createSessionFile();
        console.log(`Created new session: ${sessionFile}`);
      }

      // Track statistics for this update
      const stats = await this._enhancedMemoryBank.trackStatistics();
      console.log(`Statistics tracked: ${stats.timeSpent} spent, $${stats.estimatedCost} estimated cost`);

      if (updates.productContext) {
        const success = await this.updateProductContext(updates.productContext);
        if (success) updatedFiles.push('productContext.md');
      }

      if (updates.activeContext) {
        const success = await this.updateActiveContext(updates.activeContext);
        if (success) {
          updatedFiles.push('activeContext.md');
          // Also add the daily file
          const dateStr = this._enhancedMemoryBank.getDateString();
          updatedFiles.push(`daily/activeContext-${dateStr}.md`);
        }
      }

      // Aggregate daily files into master files
      await this._enhancedMemoryBank.aggregateDailyFiles();

      // Archive old files
      await this._enhancedMemoryBank.archiveOldFiles();

      if (updatedFiles.length === 0) {
        return {
          success: false,
          message: 'No updates provided. Memory bank remains unchanged.'
        };
      }

      // Update the last update timestamp
      await fs.writeFile(this.lastUpdatePath, new Date().toISOString());

      return {
        success: true,
        message: `Memory bank updated successfully. Updated files: ${updatedFiles.join(', ')}`
      };
    } catch (error) {
      console.error('Error handling UMB command:', error);
      return {
        success: false,
        message: `Failed to update memory bank: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
}

// Export a default instance for backward compatibility
// This will use the default path: path.join(process.cwd(), 'memory-bank')
export const memoryBank = new MemoryBank();

// Re-export functions from memory bank for backward compatibility
export const getTimestamp = memoryBank.getTimestamp.bind(memoryBank);
export const getDateString = memoryBank.getDateString.bind(memoryBank);
export const createDailyFile = async () => memoryBank.createDailyFile();
export const getLatestDailyFile = async () => memoryBank.getLatestDailyFile();
export const shouldStartNewSession = async () => memoryBank.shouldStartNewSession();
export const createSessionFile = async () => memoryBank.createSessionFile();
export const getCurrentSessionFile = async () => memoryBank.getCurrentSessionFile();
export const updateSessionEndTime = async (filePath: string) => memoryBank.updateSessionEndTime(filePath);
export const archiveOldFiles = async () => memoryBank.archiveOldFiles();
export const loadContext = async () => memoryBank.loadContext();
export const trackStatistics = async () => memoryBank.trackStatistics();
export const updateDailyActiveContext = async (update: any) => memoryBank.updateDailyActiveContext(update);
export const aggregateDailyFiles = async () => memoryBank.aggregateDailyFiles();
export const reconstructMemoryBank = async () => memoryBank.reconstructMemoryBank();
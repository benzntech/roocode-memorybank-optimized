import fs from 'fs-extra';
import path from 'path';
import { EnhancedMemoryBank } from './enhanced-memory-bank';

/**
 * Memory Bank Manager
 * 
 * This class provides a simplified interface to the Enhanced Memory Bank system.
 * It handles the initialization, configuration, and operations of the memory bank.
 */
export class MemoryBank {
  private enhancedMemoryBank: EnhancedMemoryBank;
  private baseDir: string;
  private productContextPath: string;
  private activeContextPath: string;
  private systemPatternsPath: string;
  private decisionLogPath: string;
  private progressPath: string;
  private lastUpdatePath: string;

  /**
   * Create a new Memory Bank instance
   * @param baseDir Base directory for the memory bank (default: process.cwd()/memory-bank)
   */
  constructor(baseDir?: string) {
    this.baseDir = baseDir || path.join(process.cwd(), 'memory-bank');
    
    // Initialize the enhanced memory bank
    this.enhancedMemoryBank = new EnhancedMemoryBank({
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

  /**
   * Initialize the memory bank
   * @returns True if initialization was successful
   */
  public async initialize(): Promise<boolean> {
    try {
      // Initialize the enhanced memory bank
      const success = await this.enhancedMemoryBank.initialize();
      
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
    const timestamp = this.enhancedMemoryBank.getTimestamp();
    
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
      const content = await this.enhancedMemoryBank.readFile(this.productContextPath);
      let updatedContent = content;
      
      if (update.projectOverview) {
        updatedContent = this.enhancedMemoryBank.updateSection(
          updatedContent,
          '## Project Overview',
          update.projectOverview
        );
      }
      
      if (update.goalsAndObjectives) {
        updatedContent = this.enhancedMemoryBank.updateSection(
          updatedContent,
          '## Goals and Objectives',
          update.goalsAndObjectives
        );
      }
      
      if (update.coreFeatures) {
        updatedContent = this.enhancedMemoryBank.updateSection(
          updatedContent,
          '## Core Features',
          update.coreFeatures
        );
      }
      
      if (update.architectureOverview) {
        updatedContent = this.enhancedMemoryBank.updateSection(
          updatedContent,
          '## Architecture Overview',
          update.architectureOverview
        );
      }
      
      // Add timestamp to footnotes
      const timestamp = this.enhancedMemoryBank.getTimestamp();
      updatedContent = updatedContent.replace(
        /---\nFootnotes:\n([\s\S]*?)$/,
        `---\nFootnotes:\n[${timestamp}] - Updated product context\n`
      );
      
      return await this.enhancedMemoryBank.writeFile(this.productContextPath, updatedContent);
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
      const dailyUpdateSuccess = await this.enhancedMemoryBank.updateDailyActiveContext(update);
      
      // Then update the master active context file for backward compatibility
      const content = await this.enhancedMemoryBank.readFile(this.activeContextPath);
      let updatedContent = content;
      
      if (update.currentFocus) {
        updatedContent = this.enhancedMemoryBank.updateSection(
          updatedContent,
          '## Current Focus',
          update.currentFocus
        );
      }
      
      // Add new recent change at the top of the list
      if (update.recentChanges) {
        const timestamp = this.enhancedMemoryBank.getTimestamp();
        updatedContent = updatedContent.replace(
          /## Recent Changes\n/,
          `## Recent Changes\n[${timestamp}] - ${update.recentChanges}\n`
        );
      }
      
      if (update.openQuestions) {
        updatedContent = this.enhancedMemoryBank.updateSection(
          updatedContent,
          '## Open Questions/Issues',
          update.openQuestions
        );
      }
      
      const masterUpdateSuccess = await this.enhancedMemoryBank.writeFile(this.activeContextPath, updatedContent);
      
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
      const startNewSession = await this.enhancedMemoryBank.shouldStartNewSession();
      let sessionFile = await this.enhancedMemoryBank.getCurrentSessionFile();
      
      if (startNewSession) {
        // Load context from previous day if needed
        await this.enhancedMemoryBank.loadContext();
        
        // Create a new session file
        sessionFile = await this.enhancedMemoryBank.createSessionFile();
        console.log(`Started new session: ${sessionFile}`);
      } else if (sessionFile) {
        // Update the end time of the current session
        await this.enhancedMemoryBank.updateSessionEndTime(sessionFile);
        console.log(`Updated session: ${sessionFile}`);
      } else {
        // No current session, create one
        sessionFile = await this.enhancedMemoryBank.createSessionFile();
        console.log(`Created new session: ${sessionFile}`);
      }
      
      // Track statistics for this update
      const stats = await this.enhancedMemoryBank.trackStatistics();
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
          const dateStr = this.enhancedMemoryBank.getDateString();
          updatedFiles.push(`daily/activeContext-${dateStr}.md`);
        }
      }
      
      // Aggregate daily files into master files
      await this.enhancedMemoryBank.aggregateDailyFiles();
      
      // Archive old files
      await this.enhancedMemoryBank.archiveOldFiles();
      
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
export const memoryBank = new MemoryBank();

// Re-export functions from enhanced memory bank for backward compatibility
export const {
  getTimestamp,
  getDateString,
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
} = memoryBank.enhancedMemoryBank;
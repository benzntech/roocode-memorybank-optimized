import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Configuration options for the Enhanced Memory Bank
 */
export interface MemoryBankConfig {
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

/**
 * Statistics tracking for the memory bank
 */
export interface Statistics {
  timeSpent: string;
  estimatedCost: number;
  filesCreated: number;
  filesModified: number;
  filesDeleted: number;
  linesAdded: number;
  linesRemoved: number;
  totalLines: number;
}

/**
 * Enhanced Memory Bank class for project context retention
 */
export class EnhancedMemoryBank {
  private baseDir: string;
  private dailyDir: string;
  private sessionsDir: string;
  private archiveDir: string;
  private lastUpdatePath: string;
  private sessionTimeoutHours: number;
  private archiveThresholdDays: number;
  private developerHourlyRate: number;

  /**
   * Create a new Enhanced Memory Bank instance
   * @param config Configuration options
   */
  constructor(config: MemoryBankConfig) {
    this.baseDir = config.baseDir;
    
    // Set up directory paths
    this.dailyDir = path.join(this.baseDir, config.dailyDirName || 'daily');
    this.sessionsDir = path.join(this.baseDir, config.sessionsDirName || 'sessions');
    this.archiveDir = path.join(this.baseDir, config.archiveDirName || 'archive');
    this.lastUpdatePath = path.join(this.baseDir, '.last_update');
    
    // Set up configuration values
    this.sessionTimeoutHours = config.sessionTimeoutHours || 2;
    this.archiveThresholdDays = config.archiveThresholdDays || 7;
    this.developerHourlyRate = config.developerHourlyRate || 60;
  }

  /**
   * Initialize the memory bank directories
   * @returns True if initialization was successful
   */
  public async initialize(): Promise<boolean> {
    try {
      // Create the necessary directories
      await fs.ensureDir(this.baseDir);
      await fs.ensureDir(this.dailyDir);
      await fs.ensureDir(this.sessionsDir);
      await fs.ensureDir(this.archiveDir);
      
      // Initialize the last update timestamp if it doesn't exist
      if (!await fs.pathExists(this.lastUpdatePath)) {
        await fs.writeFile(this.lastUpdatePath, new Date().toISOString());
      }
      
      return true;
    } catch (error) {
      console.error('Error initializing enhanced memory bank:', error);
      return false;
    }
  }

  /**
   * Get current date in YYYY-MM-DD format
   * @param date Optional date to format (defaults to current date)
   * @returns Formatted date string
   */
  public getDateString(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Get current timestamp in a consistent format
   * @returns Formatted timestamp string
   */
  public getTimestamp(): string {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
  }

  /**
   * Read a file
   * @param filePath Path to the file
   * @returns File content as string
   */
  public async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return '';
    }
  }

  /**
   * Write to a file
   * @param filePath Path to the file
   * @param content Content to write
   * @returns True if write was successful
   */
  public async writeFile(filePath: string, content: string): Promise<boolean> {
    try {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      await fs.ensureDir(dir);
      
      await fs.writeFile(filePath, content, 'utf8');
      return true;
    } catch (error) {
      console.error(`Error writing to file ${filePath}:`, error);
      return false;
    }
  }

  /**
   * Extract a section from markdown content
   * @param content Markdown content
   * @param sectionHeader Section header to extract
   * @returns Extracted section content
   */
  public extractSection(content: string, sectionHeader: string): string {
    const sectionRegex = new RegExp(`${sectionHeader}\\n([\\s\\S]*?)(?=\\n## |$)`);
    const match = content.match(sectionRegex);
    return match ? match[1].trim() : '';
  }

  /**
   * Update a section in markdown content
   * @param content Markdown content
   * @param sectionHeader Section header to update
   * @param newContent New content for the section
   * @returns Updated markdown content
   */
  public updateSection(content: string, sectionHeader: string, newContent: string): string {
    const sectionRegex = new RegExp(`${sectionHeader}\\n([\\s\\S]*?)(?=\\n## |$)`);
    return content.replace(sectionRegex, `${sectionHeader}\n${newContent}\n`);
  }
  /**
   * Create a daily file
   * @param date Optional date (defaults to current date)
   * @returns Path to the created file
   */
  public async createDailyFile(date: Date = new Date()): Promise<string> {
    const dateStr = this.getDateString(date);
    const filePath = path.join(this.dailyDir, `activeContext-${dateStr}.md`);
    
    if (!await fs.pathExists(filePath)) {
      const content = `# Active Context - ${dateStr}

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
      await this.writeFile(filePath, content);
    }
    
    return filePath;
  }

  /**
   * Get the latest daily file
   * @returns Path to the latest daily file
   */
  public async getLatestDailyFile(): Promise<string | null> {
    try {
      const files = await fs.readdir(this.dailyDir);
      const dailyFiles = files.filter(file => file.startsWith('activeContext-') && file.endsWith('.md'));
      
      if (dailyFiles.length === 0) {
        return null;
      }
      
      // Sort by date (newest first)
      dailyFiles.sort().reverse();
      
      return path.join(this.dailyDir, dailyFiles[0]);
    } catch (error) {
      console.error('Error getting latest daily file:', error);
      return null;
    }
  }

  /**
   * Check if a new session should be started
   * @returns True if a new session should be started
   */
  public async shouldStartNewSession(): Promise<boolean> {
    try {
      if (!await fs.pathExists(this.lastUpdatePath)) {
        return true;
      }
      
      const lastUpdateStr = await fs.readFile(this.lastUpdatePath, 'utf8');
      const lastUpdate = new Date(lastUpdateStr);
      const now = new Date();
      
      // Check if the last update was more than sessionTimeoutHours ago
      const hoursDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
      
      return hoursDiff > this.sessionTimeoutHours;
    } catch (error) {
      console.error('Error checking if new session should be started:', error);
      return true;
    }
  }

  /**
   * Create a new session file
   * @returns Path to the created session file
   */
  public async createSessionFile(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(this.sessionsDir, `session-${timestamp}.md`);
    
    const content = `# Development Session - ${this.getTimestamp()}

## Start Time
${this.getTimestamp()}

## End Time
(In progress)

## Focus
-

## Notes
-

## Statistics
- Time Spent: 0h 0m
- Estimated Cost: $0
`;
    
    await this.writeFile(filePath, content);
    return filePath;
  }

  /**
   * Get the current session file
   * @returns Path to the current session file
   */
  public async getCurrentSessionFile(): Promise<string | null> {
    try {
      const files = await fs.readdir(this.sessionsDir);
      const sessionFiles = files.filter(file => file.startsWith('session-') && file.endsWith('.md'));
      
      if (sessionFiles.length === 0) {
        return null;
      }
      
      // Sort by date (newest first)
      sessionFiles.sort().reverse();
      
      // Check if the newest session is still active
      const filePath = path.join(this.sessionsDir, sessionFiles[0]);
      const content = await this.readFile(filePath);
      
      if (content.includes('End Time\n(In progress)')) {
        return filePath;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting current session file:', error);
      return null;
    }
  }

  /**
   * Update the end time of a session file
   * @param filePath Path to the session file
   * @returns True if update was successful
   */
  public async updateSessionEndTime(filePath: string): Promise<boolean> {
    try {
      const content = await this.readFile(filePath);
      const updatedContent = content.replace(
        /## End Time\n(.*)/,
        `## End Time\n${this.getTimestamp()}`
      );
      
      return await this.writeFile(filePath, updatedContent);
    } catch (error) {
      console.error('Error updating session end time:', error);
      return false;
    }
  }

  /**
   * Archive old files
   * @returns True if archiving was successful
   */
  public async archiveOldFiles(): Promise<boolean> {
    try {
      const now = new Date();
      const thresholdDate = new Date(now.getTime() - this.archiveThresholdDays * 24 * 60 * 60 * 1000);
      const thresholdDateStr = this.getDateString(thresholdDate);
      
      // Archive daily files
      const dailyFiles = await fs.readdir(this.dailyDir);
      for (const file of dailyFiles) {
        if (!file.startsWith('activeContext-') || !file.endsWith('.md')) {
          continue;
        }
        
        const dateStr = file.replace('activeContext-', '').replace('.md', '');
        if (dateStr < thresholdDateStr) {
          const sourcePath = path.join(this.dailyDir, file);
          const destPath = path.join(this.archiveDir, file);
          await fs.move(sourcePath, destPath, { overwrite: true });
          console.log(`Archived ${file}`);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error archiving old files:', error);
      return false;
    }
  }

  /**
   * Load context from previous day
   * @returns True if context was loaded successfully
   */
  public async loadContext(): Promise<boolean> {
    try {
      const latestDailyFile = await this.getLatestDailyFile();
      if (!latestDailyFile) {
        return false;
      }
      
      // Create a new daily file for today
      const todayFile = await this.createDailyFile();
      
      // Copy content from latest daily file to today's file
      const latestContent = await this.readFile(latestDailyFile);
      const todayContent = await this.readFile(todayFile);
      
      // Extract sections from latest file
      const currentFocus = this.extractSection(latestContent, '## Current Focus');
      const openQuestions = this.extractSection(latestContent, '## Open Questions/Issues');
      
      // Update today's file with content from latest file
      let updatedContent = todayContent;
      updatedContent = this.updateSection(updatedContent, '## Current Focus', currentFocus);
      updatedContent = this.updateSection(updatedContent, '## Open Questions/Issues', openQuestions);
      
      return await this.writeFile(todayFile, updatedContent);
    } catch (error) {
      console.error('Error loading context:', error);
      return false;
    }
  }

  /**
   * Track statistics for this update
   * @returns Statistics object
   */
  public async trackStatistics(): Promise<Statistics> {
    try {
      // Get the last update time
      let lastUpdate = new Date();
      if (await fs.pathExists(this.lastUpdatePath)) {
        const lastUpdateStr = await fs.readFile(this.lastUpdatePath, 'utf8');
        lastUpdate = new Date(lastUpdateStr);
      }
      
      const now = new Date();
      const minutesSpent = Math.round((now.getTime() - lastUpdate.getTime()) / (1000 * 60));
      const hoursSpent = Math.floor(minutesSpent / 60);
      const remainingMinutes = minutesSpent % 60;
      const timeSpent = `${hoursSpent}h ${remainingMinutes}m`;
      
      // Calculate estimated cost
      const estimatedCost = Math.round((minutesSpent / 60) * this.developerHourlyRate * 100) / 100;
      
      // Get git statistics if available
      let filesCreated = 0;
      let filesModified = 0;
      let filesDeleted = 0;
      let linesAdded = 0;
      let linesRemoved = 0;
      let totalLines = 0;
      
      try {
        // Get git diff stats
        const gitDiffStats = execSync('git diff --stat', { encoding: 'utf8' });
        const gitDiffMatch = gitDiffStats.match(/(\d+) files? changed, (\d+) insertions?\(\+\), (\d+) deletions?\(-\)/);
        
        if (gitDiffMatch) {
          filesModified = parseInt(gitDiffMatch[1], 10);
          linesAdded = parseInt(gitDiffMatch[2], 10);
          linesRemoved = parseInt(gitDiffMatch[3], 10);
        }
        
        // Get total lines of code
        const gitLsFiles = execSync('git ls-files | grep -v "node_modules" | xargs wc -l', { encoding: 'utf8' });
        const gitLsMatch = gitLsFiles.match(/(\d+) total/);
        
        if (gitLsMatch) {
          totalLines = parseInt(gitLsMatch[1], 10);
        }
      } catch (error) {
        console.warn('Git statistics not available:', error);
      }
      
      const stats: Statistics = {
        timeSpent,
        estimatedCost,
        filesCreated,
        filesModified,
        filesDeleted,
        linesAdded,
        linesRemoved,
        totalLines
      };
      
      return stats;
    } catch (error) {
      console.error('Error tracking statistics:', error);
      return {
        timeSpent: '0h 0m',
        estimatedCost: 0,
        filesCreated: 0,
        filesModified: 0,
        filesDeleted: 0,
        linesAdded: 0,
        linesRemoved: 0,
        totalLines: 0
      };
    }
  }

  /**
   * Update daily active context
   * @param update Update object with sections to update
   * @returns True if update was successful
   */
  public async updateDailyActiveContext(update: {
    currentFocus?: string;
    recentChanges?: string;
    openQuestions?: string;
  }): Promise<boolean> {
    try {
      // Create or get today's daily file
      const todayFile = await this.createDailyFile();
      const content = await this.readFile(todayFile);
      let updatedContent = content;
      
      if (update.currentFocus) {
        updatedContent = this.updateSection(
          updatedContent,
          '## Current Focus',
          update.currentFocus
        );
      }
      
      // Add new recent change at the top of the list
      if (update.recentChanges) {
        const timestamp = this.getTimestamp();
        updatedContent = updatedContent.replace(
          /## Recent Changes\n/,
          `## Recent Changes\n[${timestamp}] - ${update.recentChanges}\n`
        );
      }
      
      if (update.openQuestions) {
        updatedContent = this.updateSection(
          updatedContent,
          '## Open Questions/Issues',
          update.openQuestions
        );
      }
      
      return await this.writeFile(todayFile, updatedContent);
    } catch (error) {
      console.error('Error updating daily active context:', error);
      return false;
    }
  }

  /**
   * Aggregate daily files into master files
   * @returns True if aggregation was successful
   */
  public async aggregateDailyFiles(): Promise<boolean> {
    try {
      // This is a placeholder for future implementation
      // In a real implementation, this would combine information from daily files
      // into master files for better organization
      return true;
    } catch (error) {
      console.error('Error aggregating daily files:', error);
      return false;
    }
  }

  /**
   * Reconstruct memory bank from existing files
   * @returns True if reconstruction was successful
   */
  public async reconstructMemoryBank(): Promise<boolean> {
    try {
      // This is a placeholder for future implementation
      // In a real implementation, this would rebuild the memory bank structure
      // from existing files, useful for recovery or migration
      return true;
    } catch (error) {
      console.error('Error reconstructing memory bank:', error);
      return false;
    }
  }
}
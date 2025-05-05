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
}
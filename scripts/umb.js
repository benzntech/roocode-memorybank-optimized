#!/usr/bin/env node

/**
 * UMB (Update Memory Bank) Command Line Tool
 * 
 * This script allows you to run UMB commands from the command line.
 * It integrates with the enhanced memory bank system for improved context retention.
 * 
 * Usage:
 *   umb [command]
 * 
 * Examples:
 *   umb                     # Auto-update memory bank
 *   umb help                # Show help message
 *   umb init                # Initialize enhanced memory bank
 *   umb archive             # Archive old files
 *   umb reconstruct [days]  # Reconstruct memory bank from Git history
 *   umb update activeContext currentFocus='New feature development'
 */

const fs = require('fs');
const path = require('path');

// Get current directory
const projectRoot = path.resolve(process.cwd());

/**
 * Initialize the memory bank directories
 * @returns True if initialization was successful
 */
async function initializeMemoryBank() {
  try {
    const baseDir = path.join(projectRoot, 'memory-bank');
    const dailyDir = path.join(baseDir, 'daily');
    const sessionsDir = path.join(baseDir, 'sessions');
    const archiveDir = path.join(baseDir, 'archive');
    const lastUpdatePath = path.join(baseDir, '.last_update');
    
    // Create the necessary directories
    await ensureDir(baseDir);
    await ensureDir(dailyDir);
    await ensureDir(sessionsDir);
    await ensureDir(archiveDir);
    
    // Initialize the last update timestamp if it doesn't exist
    if (!fs.existsSync(lastUpdatePath)) {
      fs.writeFileSync(lastUpdatePath, new Date().toISOString());
    }
    
    // Create initial README files
    const readmeContent = `# Memory Bank

This directory contains the memory bank for your project.
It helps maintain context and documentation across development sessions.

## Structure

- daily/: Daily context files
- sessions/: Session tracking files
- archive/: Archived files
`;
    
    fs.writeFileSync(path.join(baseDir, 'README.md'), readmeContent);
    
    console.log('Enhanced memory bank initialized successfully.');
    return true;
  } catch (error) {
    console.error('Error initializing enhanced memory bank:', error);
    return false;
  }
}

/**
 * Ensure a directory exists
 * @param {string} dir Directory path
 */
async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Please specify a command. Use "umb help" for available commands.');
    return;
  }
  
  const command = args[0];
  
  switch (command) {
    case 'help':
      showHelp();
      break;
    
    case 'init':
      // Initialize enhanced memory bank
      await initializeMemoryBank();
      break;
      
    default:
      console.log(`Command "${command}" not implemented in this simplified version.`);
      console.log('Only "init" and "help" commands are available.');
      break;
  }
}

function showHelp() {
  console.log(`
UMB (Update Memory Bank) Command Line Tool
------------------------------------------

This tool helps you maintain a persistent memory bank for your project.
The enhanced memory bank system provides improved context retention with daily files,
session tracking, and statistics.

Usage:
  umb [command]

Commands:
  help                               Show this help message
  init                               Initialize enhanced memory bank
  
Note: This is a simplified version that only supports the "init" command.
`);
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
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
    
    case 'roo-setup':
      // Setup Roo integration
      await setupRooIntegration();
      break;
      
    default:
      console.log(`Command "${command}" not implemented in this simplified version.`);
      console.log('Only "init", "roo-setup", and "help" commands are available.');
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
  roo-setup                          Setup Roo integration for the memory bank
  
Note: This is a simplified version with limited commands.
`);
}

/**
 * Setup Roo integration for the memory bank
 */
async function setupRooIntegration() {
  try {
    // Create .roo directory if it doesn't exist
    const rooDir = path.join(projectRoot, '.roo');
    await ensureDir(rooDir);
    
    // Create rules directory
    const rulesDir = path.join(rooDir, 'rules');
    await ensureDir(rulesDir);
    
    // Create memory bank directory if it doesn't exist
    const memoryBankDir = path.join(projectRoot, 'memory-bank');
    await ensureDir(memoryBankDir);
    
    // Create product context rule file
    const productContextRule = `# Product Context
    
This file provides Roo with context about the product from the memory bank.

## Project Overview
The project is a memory bank system that helps maintain context across development sessions.

## Goals and Objectives
- Improve context retention during development
- Provide a structured way to document project decisions
- Integrate with Roo-Code for enhanced assistance

## Core Features
- Daily context tracking
- Session management
- Statistics tracking
- Roo-Code integration

## Architecture Overview
- Enhanced Memory Bank: Core functionality for context retention
- Memory Bank: Simplified interface to the enhanced system
- Roo Integration: Connects memory bank with Roo-Code
`;

    // Create active context rule file
    const activeContextRule = `# Active Development Context

## Current Focus
- Setting up Roo integration for the memory bank

## Recent Changes
- Initialized memory bank
- Set up Roo integration

## Open Questions/Issues
- How to best maintain context across development sessions?

---
This file is automatically generated from the memory bank. Do not edit directly.
Last updated: ${new Date().toISOString()}
`;

    // Write the rule files
    fs.writeFileSync(path.join(rulesDir, '01-product-context.md'), productContextRule);
    fs.writeFileSync(path.join(rulesDir, '02-active-context.md'), activeContextRule);
    
    console.log('Roo integration setup completed successfully.');
    console.log('Created Roo rules in: ' + rulesDir);
    console.log('');
    console.log('Next steps:');
    console.log('1. Update your memory bank with project context');
    console.log('2. Roo will now have access to your project context');
    
    return true;
  } catch (error) {
    console.error('Error setting up Roo integration:', error);
    return false;
  }
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
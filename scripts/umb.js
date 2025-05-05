#!/usr/bin/env node

/**
 * UMB (Update Memory Bank) Command Line Tool
 * 
 * This script allows you to run UMB commands from the command line.
 * It's a wrapper around the update-memory-bank.js script.
 * 
 * Usage:
 *   node scripts/umb.js [command]
 * 
 * Examples:
 *   node scripts/umb.js
 *   node scripts/umb.js help
 *   node scripts/umb.js update activeContext currentFocus='New feature development'
 */

const { spawn } = require('child_process');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);

// If no arguments are provided, run the update-memory-bank.js script
if (args.length === 0) {
  console.log('UMB command received. Updating memory bank...');
  
  // Run the update-memory-bank.js script
  const updateScript = path.join(__dirname, 'update-memory-bank.js');
  const child = spawn('node', [updateScript], { stdio: 'inherit' });
  
  child.on('close', (code) => {
    if (code === 0) {
      console.log('\nMemory bank updated successfully.');
      console.log('You can view the updated files in the memory-bank directory.');
    } else {
      console.error(`\nError updating memory bank. Exit code: ${code}`);
    }
  });
} else if (args[0] === 'help') {
  // Display help information
  console.log(`
UMB Command Help:
----------------
UMB commands update the memory bank files in the memory-bank directory.

Usage:
  UMB - Automatically gather information and update the memory bank
  UMB help - Show this help message
  UMB update <file> <section>='<content>' - Update a specific section in a file
  UMB add decision title='<title>' rationale='<rationale>' implications='<implications>' status='<status>' - Add a new decision

Examples:
  UMB update activeContext currentFocus='Implementing new authentication flow'
  UMB update productContext coreFeatures='- Feature 1\\n- Feature 2\\n- Feature 3'
  UMB add decision title='Switch to TypeScript' rationale='Better type safety' implications='Need to refactor existing code' status='Implemented'
  UMB update progress completedTasks=['Task 1', 'Task 2']
`);
} else {
  // For now, we'll just run the update-memory-bank.js script for all commands
  // In a future implementation, we could parse the arguments and call the appropriate functions
  console.log('Advanced UMB commands are not yet implemented.');
  console.log('Running the default UMB command to update the memory bank...');
  
  // Run the update-memory-bank.js script
  const updateScript = path.join(__dirname, 'update-memory-bank.js');
  const child = spawn('node', [updateScript], { stdio: 'inherit' });
  
  child.on('close', (code) => {
    if (code === 0) {
      console.log('\nMemory bank updated successfully.');
      console.log('You can view the updated files in the memory-bank directory.');
    } else {
      console.error(`\nError updating memory bank. Exit code: ${code}`);
    }
  });
}
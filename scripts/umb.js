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

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(process.cwd());

// Process UMB command
async function processCommand(command) {
  console.log(`Processing UMB command: ${command}`);
  
  try {
    // Import the memory-bank module
    const { MemoryBank } = await import('../dist/index.js');
    const memoryBank = new MemoryBank(path.join(projectRoot, 'memory-bank'));
    
    // Parse the command
    const parts = command.trim().split(' ');
    
    // Skip the "UMB" part
    parts.shift();
    
    if (parts.length === 0) {
      // Just "UMB" command, trigger auto-update
      const result = await memoryBank.handleUMBCommand({});
      return result.message;
    }
    
    // Handle different command types
    const commandType = parts[0].toLowerCase();
    
    switch (commandType) {
      case 'update':
        // Format: UMB update <file> <section>='<content>'
        if (parts.length < 3) {
          return 'Invalid update command. Format: UMB update <file> <section>=\'<content>\'';
        }
        
        const fileType = parts[1];
        const updateParts = parts.slice(2).join(' ').split('=');
        
        if (updateParts.length !== 2) {
          return 'Invalid update format. Use: <section>=\'<content>\'';
        }
        
        const section = updateParts[0];
        // Remove quotes if present
        const content = updateParts[1].replace(/^['"]|['"]$/g, '');
        
        // Create update object
        const updates = {};
        
        switch (fileType) {
          case 'activeContext':
            updates.activeContext = {};
            if (section === 'currentFocus') updates.activeContext.currentFocus = content;
            else if (section === 'recentChanges') updates.activeContext.recentChanges = content;
            else if (section === 'openQuestions') updates.activeContext.openQuestions = content;
            break;
            
          case 'productContext':
            updates.productContext = {};
            if (section === 'projectOverview') updates.productContext.projectOverview = content;
            else if (section === 'goalsAndObjectives') updates.productContext.goalsAndObjectives = content;
            else if (section === 'coreFeatures') updates.productContext.coreFeatures = content;
            else if (section === 'architectureOverview') updates.productContext.architectureOverview = content;
            break;
            
          case 'systemPatterns':
            updates.systemPatterns = {};
            if (section === 'architecturalPatterns') updates.systemPatterns.architecturalPatterns = content;
            else if (section === 'designPatterns') updates.systemPatterns.designPatterns = content;
            else if (section === 'technicalDecisions') updates.systemPatterns.technicalDecisions = content;
            break;
            
          default:
            return `Unknown file type: ${fileType}`;
        }
        
        const result = await memoryBank.handleUMBCommand(updates);
        return result.message;
        
      case 'add':
        // Format: UMB add decision title='<title>' rationale='<rationale>' implications='<implications>' status='<status>'
        if (parts.length < 2) {
          return 'Invalid add command. Format: UMB add <type> <params>';
        }
        
        const addType = parts[1].toLowerCase();
        
        if (addType === 'decision') {
          // Parse decision parameters
          const decisionParams = parts.slice(2).join(' ');
          const decision = {
            title: extractParam(decisionParams, 'title'),
            rationale: extractParam(decisionParams, 'rationale'),
            implications: extractParam(decisionParams, 'implications'),
            status: extractParam(decisionParams, 'status') || 'Pending'
          };
          
          if (!decision.title || !decision.rationale) {
            return 'Decision requires at least title and rationale.';
          }
          
          const result = await memoryBank.handleUMBCommand({ decision });
          return result.message;
        } else {
          return `Unknown add type: ${addType}`;
        }
        
      default:
        return `Unknown command type: ${commandType}`;
    }
  } catch (error) {
    console.error('Error processing command:', error);
    return `Error processing command: ${error.message}`;
  }
}

// Helper function to extract parameters from command string
function extractParam(str, paramName) {
  const regex = new RegExp(`${paramName}=['"]([^'"]*?)['"]`);
  const match = str.match(regex);
  return match ? match[1] : '';
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Auto-update memory bank
    console.log('Auto-updating memory bank...');
    
    // Import the memory-bank module
    try {
      const { MemoryBank } = await import('../dist/index.js');
      const memoryBank = new MemoryBank(path.join(projectRoot, 'memory-bank'));
      
      // Initialize if needed
      await memoryBank.initialize();
      
      // Call the handleUMBCommand function with empty updates to trigger auto-update
      const result = await memoryBank.handleUMBCommand({});
      console.log(result.message);
    } catch (error) {
      console.error('Error auto-updating memory bank:', error);
    }
    
    return;
  }
  
  const command = args[0];
  
  switch (command) {
    case 'help':
      showHelp();
      break;
    
    case 'init':
      // Initialize enhanced memory bank
      try {
        const { MemoryBank } = await import('../dist/index.js');
        const memoryBank = new MemoryBank(path.join(projectRoot, 'memory-bank'));
        const success = await memoryBank.initialize();
        if (success) {
          console.log('Enhanced memory bank initialized successfully.');
        } else {
          console.error('Failed to initialize enhanced memory bank.');
        }
      } catch (error) {
        console.error('Error initializing enhanced memory bank:', error);
      }
      break;
      
    case 'roo-setup':
      // Set up Roo-Code integration
      try {
        console.log('Setting up Roo-Code integration...');
        const { RooIntegration } = await import('../dist/roo-integration.js');
        const integration = await RooIntegration.autoConfigureForWorkspace(projectRoot);
        if (integration) {
          console.log('Roo-Code integration set up successfully.');
        } else {
          console.error('Failed to set up Roo-Code integration.');
        }
      } catch (error) {
        console.error('Error setting up Roo-Code integration:', error);
      }
      break;
      
    case 'roo-sync':
      // Sync memory bank content to Roo-Code rules
      try {
        console.log('Syncing memory bank to Roo-Code rules...');
        const { RooIntegration } = await import('../dist/roo-integration.js');
        const integration = new RooIntegration({
          workspaceDir: projectRoot,
          memoryBankDir: path.join(projectRoot, 'memory-bank'),
          rooRulesDir: path.join(projectRoot, '.roo', 'rules')
        });
        const success = await integration.syncMemoryBankToRoo();
        if (success) {
          console.log('Memory bank synced to Roo-Code rules successfully.');
        } else {
          console.error('Failed to sync memory bank to Roo-Code rules.');
        }
      } catch (error) {
        console.error('Error syncing memory bank to Roo-Code rules:', error);
      }
      break;
    
    case 'archive':
      // Archive old files
      try {
        const { MemoryBank } = await import('../dist/index.js');
        const memoryBank = new MemoryBank(path.join(projectRoot, 'memory-bank'));
        await memoryBank.initialize();
        await memoryBank.enhancedMemoryBank.archiveOldFiles();
        console.log('Old files archived successfully.');
      } catch (error) {
        console.error('Error archiving old files:', error);
      }
      break;
    
    case 'reconstruct':
      // Reconstruct memory bank from Git history
      const days = args[1] ? parseInt(args[1], 10) : 30;
      try {
        const { MemoryBank, reconstructMemoryBank } = await import('../dist/index.js');
        const memoryBank = new MemoryBank(path.join(projectRoot, 'memory-bank'));
        await memoryBank.initialize();
        const result = await reconstructMemoryBank(days);
        console.log(result.message);
      } catch (error) {
        console.error('Error reconstructing memory bank:', error);
      }
      break;
    
    default:
      // Process UMB command
      const umbCommand = 'UMB ' + args.join(' ');
      const result = await processCommand(umbCommand);
      console.log(result);
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
  (no command)                       Auto-update memory bank based on Git history
  help                               Show this help message
  init                               Initialize enhanced memory bank directories
  archive                            Archive files older than a week
  reconstruct [days]                 Reconstruct memory bank from Git history (default: 30 days)
  update <file> <section>='<content>' Update a specific section in a file
  add decision title='<title>' rationale='<rationale>' implications='<implications>' status='<status>'
                                     Add a new decision to the decision log
  
  Roo-Code Integration:
  roo-setup                          Set up Roo-Code integration with the memory bank
  roo-sync                           Sync memory bank content to Roo-Code rules

Examples:
  umb
  umb init
  umb archive
  umb reconstruct 60
  umb update activeContext currentFocus='Implementing enhanced memory bank'
  umb add decision title='Switch to TypeScript' rationale='Better type safety' implications='Need to refactor existing code' status='Implemented'
  umb roo-setup
  umb roo-sync
`);
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
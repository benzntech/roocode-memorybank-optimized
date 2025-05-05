#!/usr/bin/env node

/**
 * Install Git Hooks for Enhanced Memory Bank
 * 
 * This script installs Git hooks to automatically update the memory bank
 * before commits and provide reminders if the memory bank hasn't been
 * updated in a while.
 * 
 * Usage:
 *   node scripts/install-git-hooks.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(process.cwd());

// Define paths
const gitHooksDir = path.join(projectRoot, '.git', 'hooks');
const preCommitHookPath = path.join(gitHooksDir, 'pre-commit');

// Create pre-commit hook content
const preCommitHookContent = `#!/bin/sh

# Enhanced Memory Bank Pre-Commit Hook
# This hook checks if the memory bank needs updating before committing

# Get the last update time of the memory bank
LAST_UPDATE_FILE="memory-bank/.last_update"

if [ -f "$LAST_UPDATE_FILE" ]; then
  LAST_UPDATE=$(cat "$LAST_UPDATE_FILE")
  
  # Count commits since last memory bank update
  COMMIT_COUNT=$(git log --since="$LAST_UPDATE" --oneline | wc -l)
  
  # If there are 5+ commits since last update, remind to update memory bank
  if [ $COMMIT_COUNT -ge 5 ]; then
    echo "⚠️ Memory bank hasn't been updated in $COMMIT_COUNT commits."
    echo "Consider running 'umb' to update the memory bank before committing."
    
    # Ask if the user wants to update the memory bank now
    echo -n "Would you like to update the memory bank now? [y/N] "
    read answer
    
    if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
      echo "Updating memory bank..."
      umb
      
      # Check if the update was successful
      if [ $? -ne 0 ]; then
        echo "❌ Failed to update memory bank. Commit aborted."
        exit 1
      fi
      
      echo "✅ Memory bank updated successfully."
    else
      echo "Proceeding with commit without updating memory bank."
    fi
  fi
else
  echo "⚠️ Memory bank has never been initialized."
  echo "Consider running 'umb init' to initialize the enhanced memory bank."
  
  # Ask if the user wants to initialize the memory bank now
  echo -n "Would you like to initialize the memory bank now? [y/N] "
  read answer
  
  if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    echo "Initializing memory bank..."
    umb init
    
    # Check if the initialization was successful
    if [ $? -ne 0 ]; then
      echo "❌ Failed to initialize memory bank. Commit aborted."
      exit 1
    fi
    
    echo "✅ Memory bank initialized successfully."
  else
    echo "Proceeding with commit without initializing memory bank."
  fi
fi

# Continue with the commit
exit 0
`;

// Main function
function main() {
  try {
    console.log('Installing Git hooks for Enhanced Memory Bank...');
    
    // Check if .git directory exists
    if (!fs.existsSync(path.join(projectRoot, '.git'))) {
      console.error('Error: .git directory not found. Make sure you are in a Git repository.');
      process.exit(1);
    }
    
    // Create hooks directory if it doesn't exist
    if (!fs.existsSync(gitHooksDir)) {
      fs.mkdirSync(gitHooksDir, { recursive: true });
    }
    
    // Write pre-commit hook
    fs.writeFileSync(preCommitHookPath, preCommitHookContent);
    
    // Make the hook executable
    fs.chmodSync(preCommitHookPath, '755');
    
    console.log('✅ Git hooks installed successfully.');
    console.log('Pre-commit hook will now check if the memory bank needs updating before commits.');
  } catch (error) {
    console.error('Error installing Git hooks:', error);
    process.exit(1);
  }
}

// Run the main function
main();
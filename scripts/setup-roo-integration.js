#!/usr/bin/env node

/**
 * Setup Roo-Code Integration
 * 
 * This script sets up the memory bank integration with Roo-Code.
 * It creates the necessary directories, configuration, and sample rules.
 * 
 * Usage:
 *   node scripts/setup-roo-integration.js [workspace-path]
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { RooIntegration } from '../dist/roo-integration.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const workspacePath = args[0] || process.cwd();

/**
 * Main function to set up Roo-Code integration
 */
async function setupRooIntegration() {
  console.log('🚀 Setting up Roo-Code Integration for Memory Bank');
  console.log('================================================');
  
  try {
    // Check if the workspace path exists
    if (!await fs.pathExists(workspacePath)) {
      console.error(`❌ Workspace path does not exist: ${workspacePath}`);
      process.exit(1);
    }
    
    console.log(`📂 Using workspace path: ${workspacePath}`);
    
    // Auto-configure for the workspace
    console.log('🔍 Detecting Roo-Code workspace...');
    const integration = await RooIntegration.autoConfigureForWorkspace(workspacePath);
    
    if (!integration) {
      console.log('🔧 Creating Roo-Code configuration...');
      
      // Create .roo directory if it doesn't exist
      const rooDir = path.join(workspacePath, '.roo');
      await fs.ensureDir(rooDir);
      
      // Create rules directory
      const rulesDir = path.join(rooDir, 'rules');
      await fs.ensureDir(rulesDir);
      
      // Create memory bank directory
      const memoryBankDir = path.join(workspacePath, 'memory-bank');
      
      // Create new integration with the configured paths
      const manualIntegration = new RooIntegration({
        workspaceDir: workspacePath,
        memoryBankDir,
        rooRulesDir: rulesDir
      });
      
      // Initialize the integration
      console.log('🏗️ Initializing memory bank...');
      await manualIntegration.initialize();
      
      // Generate Roo rules
      console.log('📝 Generating Roo-Code rules...');
      await manualIntegration.generateRooRules();
      
      console.log('');
      console.log('✅ Setup completed successfully!');
      console.log('');
      console.log('📋 Next steps:');
      console.log('  1. Update your memory bank with project context:');
      console.log('     npx umb update activeContext currentFocus="Your current focus"');
      console.log('  2. Update the memory bank whenever context changes');
      console.log('  3. Roo-Code will now have access to your project context');
      console.log('');
    } else {
      console.log('✅ Roo-Code workspace detected and configured!');
      console.log('');
      console.log('📋 Next steps:');
      console.log('  1. Update your memory bank with project context:');
      console.log('     npx umb update activeContext currentFocus="Your current focus"');
      console.log('  2. Roo-Code will now have access to your project context');
      console.log('');
    }
  } catch (error) {
    console.error('❌ Error setting up Roo-Code integration:', error);
    process.exit(1);
  }
}

// Run the setup
setupRooIntegration().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
#!/usr/bin/env node

/**
 * Generate Roo-Code Rules
 * 
 * This script generates custom instruction files for Roo-Code based on
 * the current memory bank content. It can be run manually or set up
 * as a post-update hook for the memory bank.
 * 
 * Usage:
 *   node scripts/generate-roo-rules.js [memory-bank-dir] [rules-dir]
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
const memoryBankDir = args[0] || path.join(process.cwd(), 'memory-bank');
const rulesDir = args[1] || path.join(process.cwd(), '.roo', 'rules');

/**
 * Main function to generate Roo-Code rules
 */
async function generateRooRules() {
  console.log('📝 Generating Roo-Code Rules from Memory Bank');
  console.log('==========================================');
  
  try {
    console.log(`📂 Memory Bank directory: ${memoryBankDir}`);
    console.log(`📂 Rules directory: ${rulesDir}`);
    
    // Check if directories exist
    if (!await fs.pathExists(memoryBankDir)) {
      console.error(`❌ Memory bank directory does not exist: ${memoryBankDir}`);
      console.log('   Run initialization first: npx umb init');
      process.exit(1);
    }
    
    // Create rules directory if it doesn't exist
    await fs.ensureDir(rulesDir);
    
    // Create Roo integration
    const integration = new RooIntegration({
      memoryBankDir,
      rooRulesDir: rulesDir
    });
    
    // Generate rules
    console.log('🔄 Generating rules from memory bank content...');
    const result = await integration.generateRooRules();
    
    if (result) {
      console.log('✅ Rules generated successfully!');
      console.log(`   Rules are available in: ${rulesDir}`);
    } else {
      console.error('❌ Failed to generate rules');
    }
    
    console.log('');
    console.log('📋 Generated Files:');
    const files = await fs.readdir(rulesDir);
    files.forEach(file => {
      console.log(`   - ${file}`);
    });
    
  } catch (error) {
    console.error('❌ Error generating Roo-Code rules:', error);
    process.exit(1);
  }
}

// Run the generator
generateRooRules().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
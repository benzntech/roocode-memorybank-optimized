#!/usr/bin/env node

/**
 * Update Context Script
 * 
 * This script demonstrates how to use the Memory Bank programmatically
 * to update the active context.
 */

const { MemoryBank } = require('../dist/memory-bank');

async function main() {
  try {
    console.log('Updating memory bank...');
    
    // Create a new memory bank instance
    const memoryBank = new MemoryBank();
    
    // Update active context
    const activeContextUpdate = {
      currentFocus: 'Testing the programmatic API of the memory bank',
      recentChanges: 'Updated the memory bank using the JavaScript API',
      openQuestions: 'How can we extend the CLI to support all the commands mentioned in the README?'
    };
    
    const updateSuccess = await memoryBank.updateActiveContext(activeContextUpdate);
    
    if (updateSuccess) {
      console.log('Active context updated successfully.');
      
      // Update product context as well
      const productContextUpdate = {
        projectOverview: 'Enhanced Memory Bank System for project context retention and documentation',
        goalsAndObjectives: '- Maintain project context across development sessions\n- Track decisions and their rationale\n- Provide statistics on development effort',
        coreFeatures: '- Daily context files\n- Session tracking\n- Statistics tracking\n- Git integration\n- Archiving',
        architectureOverview: '- MemoryBank: Main class for memory bank operations\n- EnhancedMemoryBank: Core functionality\n- RooIntegration: Integration with Roo-Code'
      };
      
      const productUpdateSuccess = await memoryBank.updateProductContext(productContextUpdate);
      
      if (productUpdateSuccess) {
        console.log('Product context updated successfully.');
      } else {
        console.error('Failed to update product context.');
      }
    } else {
      console.error('Failed to update active context.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
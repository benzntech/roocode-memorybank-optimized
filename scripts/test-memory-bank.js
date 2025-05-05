#!/usr/bin/env node

/**
 * Test Memory Bank Script
 * 
 * This script tests the memory bank functionality by initializing it
 * and creating all the master files.
 */

const { MemoryBank } = require('../dist/memory-bank');

async function main() {
  try {
    console.log('Initializing memory bank...');
    
    // Create a new memory bank instance
    const memoryBank = new MemoryBank();
    
    // Initialize the memory bank (this will create all master files)
    const success = await memoryBank.initialize();
    
    if (success) {
      console.log('Memory bank initialized successfully with all master files.');
      
      // Update active context as a test
      const activeContextUpdate = {
        currentFocus: 'Testing the memory bank functionality',
        recentChanges: 'Created and initialized the memory bank',
        openQuestions: 'How can we extend the memory bank functionality?'
      };
      
      const updateSuccess = await memoryBank.updateActiveContext(activeContextUpdate);
      
      if (updateSuccess) {
        console.log('Active context updated successfully.');
      } else {
        console.error('Failed to update active context.');
      }
    } else {
      console.error('Failed to initialize memory bank.');
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
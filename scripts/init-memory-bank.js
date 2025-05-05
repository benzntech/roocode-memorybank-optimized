#!/usr/bin/env node

/**
 * Initialize Memory Bank
 * 
 * This script initializes the memory bank with the required files.
 */

const { MemoryBank } = require('../dist/memory-bank');

async function main() {
  try {
    console.log('Initializing memory bank...');
    
    // Create a new memory bank instance
    const memoryBank = new MemoryBank();
    
    // Initialize the memory bank
    const success = await memoryBank.initialize();
    
    if (success) {
      console.log('Memory bank initialized successfully.');
      console.log('You can now use the UMB command to update the memory bank.');
    } else {
      console.error('Failed to initialize memory bank.');
    }
  } catch (error) {
    console.error('Error initializing memory bank:', error);
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
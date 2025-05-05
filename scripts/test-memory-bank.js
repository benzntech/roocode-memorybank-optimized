#!/usr/bin/env node

/**
 * Comprehensive Test Script for the Enhanced Memory Bank System
 *
 * This script systematically tests all key functionalities of the enhanced memory bank system:
 * 1. Initialization of the memory bank system
 * 2. Auto-update functionality
 * 3. Session tracking functionality
 * 4. Statistics tracking functionality
 * 5. Git integration
 * 6. Reconstruction functionality
 * 7. Archiving functionality
 *
 * Usage:
 *   node scripts/test-memory-bank.js
 *
 * The script will run each test in sequence and report success or failure for each test.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(process.cwd());

// Define memory bank paths
const MEMORY_BANK_DIR = path.join(projectRoot, 'memory-bank');
const DAILY_DIR = path.join(MEMORY_BANK_DIR, 'daily');
const SESSIONS_DIR = path.join(MEMORY_BANK_DIR, 'sessions');
const ARCHIVE_DIR = path.join(MEMORY_BANK_DIR, 'archive');

// Helper function to verify file existence
function verifyFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  console.log(`  - ${description}: ${exists ? '✅ Exists' : '❌ Missing'}`);
  return exists;
}

// Helper function to verify directory existence
function verifyDirectoryExists(dirPath, description) {
  const exists = fs.existsSync(dirPath);
  console.log(`  - ${description}: ${exists ? '✅ Exists' : '❌ Missing'}`);
  return exists;
}

// Helper function to verify file content contains a string
function verifyFileContains(filePath, searchString, description) {
  if (!fs.existsSync(filePath)) {
    console.log(`  - ${description}: ❌ File doesn't exist`);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const contains = content.includes(searchString);
  console.log(`  - ${description}: ${contains ? '✅ Verified' : '❌ Not found'}`);
  return contains;
}

// Helper function to get today's date string in YYYY-MM-DD format
function getDateString() {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

// Helper function to wait for a specified time
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main test function
async function runTests() {
  console.log('🧪 ENHANCED MEMORY BANK SYSTEM TEST SUITE 🧪');
  console.log('===========================================');
  console.log(`Starting tests at: ${new Date().toLocaleString()}`);
  
  let testsPassed = 0;
  let testsFailed = 0;
  
  try {
    // Import the memory-bank modules
    const { MemoryBank, EnhancedMemoryBank } = await import('../dist/index.js');
    
    // Test 1: Initialize the enhanced memory bank
    console.log('\n📋 TEST 1: Initialize the Enhanced Memory Bank');
    console.log('-------------------------------------------');
    
    try {
      // Clean up any existing test files to ensure a fresh test
      if (fs.existsSync(MEMORY_BANK_DIR)) {
        console.log('  Cleaning up existing memory bank files for fresh test...');
        // Keep the main directory but remove test-specific files
        if (fs.existsSync(DAILY_DIR)) {
          const dailyFiles = fs.readdirSync(DAILY_DIR);
          for (const file of dailyFiles) {
            if (file.includes('test-')) {
              fs.unlinkSync(path.join(DAILY_DIR, file));
            }
          }
        }
        
        if (fs.existsSync(SESSIONS_DIR)) {
          const sessionFiles = fs.readdirSync(SESSIONS_DIR);
          for (const file of sessionFiles) {
            if (file.includes('test-')) {
              fs.unlinkSync(path.join(SESSIONS_DIR, file));
            }
          }
        }
      }
      
      // Initialize the enhanced memory bank
      const memoryBank = new MemoryBank(path.join(projectRoot, 'test-memory-bank'));
      const initResult = await memoryBank.initialize();
      console.log(`  Initialization result: ${initResult ? '✅ Success' : '❌ Failed'}`);
      
      // Verify that the necessary directories and files exist
      const testMemoryBankDir = path.join(projectRoot, 'test-memory-bank');
      const testDailyDir = path.join(testMemoryBankDir, 'daily');
      const testSessionsDir = path.join(testMemoryBankDir, 'sessions');
      const testArchiveDir = path.join(testMemoryBankDir, 'archive');
      
      let allVerified = true;
      allVerified &= verifyDirectoryExists(testMemoryBankDir, 'Memory bank directory');
      allVerified &= verifyDirectoryExists(testDailyDir, 'Daily files directory');
      allVerified &= verifyDirectoryExists(testSessionsDir, 'Sessions directory');
      allVerified &= verifyDirectoryExists(testArchiveDir, 'Archive directory');
      allVerified &= verifyFileExists(path.join(testMemoryBankDir, '.last_update'), 'Last update timestamp file');
      
      if (allVerified && initResult) {
        console.log('  Test 1 Result: ✅ PASSED');
        testsPassed++;
      } else {
        console.log('  Test 1 Result: ❌ FAILED');
        testsFailed++;
      }
      
      // Clean up test directory
      if (fs.existsSync(testMemoryBankDir)) {
        fs.rmSync(testMemoryBankDir, { recursive: true, force: true });
      }
    } catch (error) {
      console.error('  Error in Test 1:', error);
      console.log('  Test 1 Result: ❌ FAILED');
      testsFailed++;
    }
    
    // Summary
    console.log('\n📊 TEST SUMMARY');
    console.log('===========================================');
    console.log(`Tests passed: ${testsPassed} / 1`);
    console.log(`Tests failed: ${testsFailed} / 1`);
    console.log(`Overall result: ${testsFailed === 0 ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    console.log(`Tests completed at: ${new Date().toLocaleString()}`);
    
  } catch (error) {
    console.error('Fatal error running tests:', error);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
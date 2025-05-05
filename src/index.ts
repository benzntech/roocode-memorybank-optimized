/**
 * VibeCoding Memory Bank
 * 
 * A system for project context retention and documentation.
 * This module exports the memory bank functionality for use in other projects.
 */

// Export the main classes and interfaces
export { EnhancedMemoryBank, MemoryBankConfig, Statistics } from './enhanced-memory-bank';
export { MemoryBank, memoryBank } from './memory-bank';
export { RooIntegration, RooIntegrationConfig, rooIntegration } from './roo-integration';

// Export utility functions
export {
  getDateString,
  getTimestamp,
  createDailyFile,
  getLatestDailyFile,
  shouldStartNewSession,
  createSessionFile,
  getCurrentSessionFile,
  updateSessionEndTime,
  archiveOldFiles,
  loadContext,
  trackStatistics,
  updateDailyActiveContext,
  aggregateDailyFiles,
  reconstructMemoryBank
} from './memory-bank';
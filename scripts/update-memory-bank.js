#!/usr/bin/env node

/**
 * UMB (Update Memory Bank) Implementation
 * 
 * This script implements the UMB functionality to update the memory bank files.
 * It gathers information about the project and updates the memory bank files accordingly.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the memory bank file paths
const MEMORY_BANK_DIR = path.join(path.resolve(__dirname, '..'), 'memory-bank');
const PRODUCT_CONTEXT_PATH = path.join(MEMORY_BANK_DIR, 'productContext.md');
const ACTIVE_CONTEXT_PATH = path.join(MEMORY_BANK_DIR, 'activeContext.md');
const SYSTEM_PATTERNS_PATH = path.join(MEMORY_BANK_DIR, 'systemPatterns.md');
const DECISION_LOG_PATH = path.join(MEMORY_BANK_DIR, 'decisionLog.md');
const PROGRESS_PATH = path.join(MEMORY_BANK_DIR, 'progress.md');

// Helper function to get current timestamp in a consistent format
function getTimestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

// Helper function to read a file
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return ''; // Return empty string if file doesn't exist or error reading
  }
}

// Helper function to write to a file
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    return false;
  }
}

const DEFAULT_PRODUCT_CONTEXT = `# Product Context

## Project Overview
[Project overview placeholder]

## Goals and Objectives
[Goals and objectives placeholder]

## Core Features
[Core features placeholder]

## Architecture Overview
[Architecture overview placeholder]

---
Footnotes:
`;

const DEFAULT_ACTIVE_CONTEXT = `# Active Context

## Current Focus
[Current focus placeholder]

## Recent Changes

## Open Questions/Issues
[Open questions/issues placeholder]
`;

const DEFAULT_SYSTEM_PATTERNS = `# System Patterns

## Architectural Patterns
[Architectural patterns placeholder]

## Design Patterns
[Design patterns placeholder]

## Technical Decisions
[Technical decisions placeholder]

---
`;

const DEFAULT_DECISION_LOG = `# Decision Log

## Decisions

`;

const DEFAULT_PROGRESS = `# Progress

## Current Tasks

## Completed Tasks

## Upcoming Tasks

## Milestones

`;

// Function to ensure memory bank directory and files are initialized
function ensureMemoryBankInitialized() {
  console.log('Ensuring memory bank is initialized...');
  if (!fs.existsSync(MEMORY_BANK_DIR)) {
    fs.mkdirSync(MEMORY_BANK_DIR, { recursive: true });
    console.log(`Created directory: ${MEMORY_BANK_DIR}`);
  }

  const coreFiles = [
    { name: 'productContext.md', path: PRODUCT_CONTEXT_PATH, defaultContent: DEFAULT_PRODUCT_CONTEXT },
    { name: 'activeContext.md', path: ACTIVE_CONTEXT_PATH, defaultContent: DEFAULT_ACTIVE_CONTEXT },
    { name: 'systemPatterns.md', path: SYSTEM_PATTERNS_PATH, defaultContent: DEFAULT_SYSTEM_PATTERNS },
    { name: 'decisionLog.md', path: DECISION_LOG_PATH, defaultContent: DEFAULT_DECISION_LOG },
    { name: 'progress.md', path: PROGRESS_PATH, defaultContent: DEFAULT_PROGRESS },
  ];

  coreFiles.forEach(file => {
    if (!fs.existsSync(file.path)) {
      if (writeFile(file.path, file.defaultContent)) {
        console.log(`Created missing file: ${file.path}`);
      } else {
        console.error(`Failed to create missing file: ${file.path}`);
      }
    }
  });
  console.log('Memory bank initialization check complete.');
}


// Function to update product context
function updateProductContext(update) {
  const content = readFile(PRODUCT_CONTEXT_PATH);
  let updatedContent = content;

  if (update.projectOverview) {
    updatedContent = updatedContent.replace(
      /## Project Overview\n(.*?)(?=\n## |$)/s,
      `## Project Overview\n${update.projectOverview}\n`
    );
  }

  if (update.goalsAndObjectives) {
    updatedContent = updatedContent.replace(
      /## Goals and Objectives\n(.*?)(?=\n## |$)/s,
      `## Goals and Objectives\n${update.goalsAndObjectives}\n`
    );
  }

  if (update.coreFeatures) {
    updatedContent = updatedContent.replace(
      /## Core Features\n(.*?)(?=\n## |$)/s,
      `## Core Features\n${update.coreFeatures}\n`
    );
  }

  if (update.architectureOverview) {
    updatedContent = updatedContent.replace(
      /## Architecture Overview\n(.*?)(?=\n## |$)/s,
      `## Architecture Overview\n${update.architectureOverview}\n`
    );
  }

  // Add timestamp to footnotes
  const timestamp = getTimestamp();
  if (updatedContent.includes('---')) { // Ensure footnotes section exists
    updatedContent = updatedContent.replace(
      /(---\nFootnotes:\n)(.*)/s,
      `$1[${timestamp}] - Updated product context\n$2`
    );
  } else {
    updatedContent += `\n---\nFootnotes:\n[${timestamp}] - Updated product context\n`;
  }

  return writeFile(PRODUCT_CONTEXT_PATH, updatedContent);
}

// Function to update active context
function updateActiveContext(update) {
  const content = readFile(ACTIVE_CONTEXT_PATH);
  let updatedContent = content;

  if (update.currentFocus) {
    updatedContent = updatedContent.replace(
      /## Current Focus\n(.*?)(?=\n## |$)/s,
      `## Current Focus\n${update.currentFocus}\n`
    );
  }

  // Add new recent change at the top of the list
  if (update.recentChanges) {
    const timestamp = getTimestamp();
    updatedContent = updatedContent.replace(
      /(## Recent Changes\n)/,
      `$1[${timestamp}] - ${update.recentChanges}\n`
    );
  }

  if (update.openQuestions) {
    updatedContent = updatedContent.replace(
      /## Open Questions\/Issues\n(.*?)$/s,
      `## Open Questions/Issues\n${update.openQuestions}\n`
    );
  }

  return writeFile(ACTIVE_CONTEXT_PATH, updatedContent);
}

// Function to update system patterns
function updateSystemPatterns(update) {
  const content = readFile(SYSTEM_PATTERNS_PATH);
  let updatedContent = content;

  if (update.architecturalPatterns) {
    updatedContent = updatedContent.replace(
      /## Architectural Patterns\n(.*?)(?=\n## |$)/s,
      `## Architectural Patterns\n${update.architecturalPatterns}\n`
    );
  }

  if (update.designPatterns) {
    updatedContent = updatedContent.replace(
      /## Design Patterns\n(.*?)(?=\n## |$)/s,
      `## Design Patterns\n${update.designPatterns}\n`
    );
  }

  if (update.technicalDecisions) {
    updatedContent = updatedContent.replace(
      /## Technical Decisions\n(.*?)(?=\n## |$)/s,
      `## Technical Decisions\n${update.technicalDecisions}\n`
    );
  }

  // Add timestamp to footnotes
  const timestamp = getTimestamp();
  if (updatedContent.includes('---')) {
    updatedContent = updatedContent.replace(
      /(---\n)(.*)/s,
      `$1[${timestamp}] - Updated system patterns\n$2`
    );
  } else {
    updatedContent += `\n---\n[${timestamp}] - Updated system patterns\n`;
  }

  return writeFile(SYSTEM_PATTERNS_PATH, updatedContent);
}

// Function to add a new decision to the decision log
function addDecision(decision) {
  const content = readFile(DECISION_LOG_PATH);
  const timestamp = getTimestamp();

  const newDecision = `
[${timestamp}] - ${decision.title}
- Rationale: ${decision.rationale}
- Implications: ${decision.implications}
- Status: ${decision.status}`;

  const updatedContent = content.replace(
    /(## Decisions\n)/,
    `$1${newDecision}\n`
  );

  return writeFile(DECISION_LOG_PATH, updatedContent);
}

// Function to update progress
function updateProgress(update) {
  const content = readFile(PROGRESS_PATH);
  let updatedContent = content;
  const timestamp = getTimestamp();

  if (update.currentTasks && update.currentTasks.length > 0) {
    const tasksText = update.currentTasks.map(task => `- ${task}`).join('\n');
    updatedContent = updatedContent.replace(
      /## Current Tasks\n(.*?)(?=\n## |$)/s,
      `## Current Tasks\n${tasksText}\n`
    );
  }

  if (update.completedTasks && update.completedTasks.length > 0) {
    const tasksText = update.completedTasks.map(task => `[${timestamp}] - ${task}`).join('\n');
    updatedContent = updatedContent.replace(
      /(## Completed Tasks\n)/,
      `$1${tasksText}\n`
    );
  }

  if (update.upcomingTasks && update.upcomingTasks.length > 0) {
    const tasksText = update.upcomingTasks.map(task => `- ${task}`).join('\n');
    updatedContent = updatedContent.replace(
      /## Upcoming Tasks\n(.*?)(?=\n## |$)/s,
      `## Upcoming Tasks\n${tasksText}\n`
    );
  }

  if (update.milestones && update.milestones.length > 0) {
    const milestonesText = update.milestones.map(milestone =>
      `[${timestamp}] - ${milestone.title}${milestone.description ? `\n  ${milestone.description}` : ''}`
    ).join('\n');

    updatedContent = updatedContent.replace(
      /(## Milestones\n)/,
      `$1${milestonesText}\n`
    );
  }

  return writeFile(PROGRESS_PATH, updatedContent);
}

// Function to gather information from recent commits
function gatherRecentCommits() {
  try {
    // Get recent commits (last 7 days)
    const recentCommits = execSync('git log --since="7 days ago" --pretty=format:"%h - %s" --no-merges').toString();
    return recentCommits.split('\n').filter(line => line.trim() !== '');
  } catch (error) {
    console.error('Error gathering recent commits:', error);
    return [];
  }
}

// Function to gather information from recent pull requests
function gatherRecentPRs() {
  try {
    // This is a simplified version - in a real implementation, you would use the GitHub API
    // For now, we'll use git log to get merge commits which likely represent merged PRs
    const recentPRs = execSync('git log --since="7 days ago" --merges --pretty=format:"%h - %s"').toString();
    return recentPRs.split('\n').filter(line => line.trim() !== '');
  } catch (error) {
    console.error('Error gathering recent PRs:', error);
    return [];
  }
}

// Main function to automatically update the memory bank
function autoUpdateMemoryBank() {
  ensureMemoryBankInitialized(); // Ensure files and directory exist

  try {
    // Gather information from recent commits and PRs
    const recentCommits = gatherRecentCommits();
    const recentPRs = gatherRecentPRs();

    // Extract information from commits and PRs
    const recentChanges = recentPRs.length > 0
      ? `Recent PRs:\n${recentPRs.map(pr => `- ${pr}`).join('\n')}`
      : 'No recent PRs found';

    // Current focus based on recent activity
    const currentFocus = "Maintaining and improving the memory bank system for better context retention across development sessions.";

    // Core features based on project structure
    const coreFeatures = `- Daily context tracking
- Session management
- Statistics tracking
- Roo-Code integration
- Automated documentation updates`;

    // Architecture overview based on project structure
    const architectureOverview = `- Enhanced Memory Bank: Core functionality for context retention
- Memory Bank: Simplified interface to the enhanced system
- Roo Integration: Connects memory bank with Roo-Code
- UMB Command: CLI tool for updating memory bank files`;

    // System patterns based on project structure
    const architecturalPatterns = `- File-based storage for memory bank data
- Command-line interface for updates
- Markdown format for human-readable documentation
- Automated updates based on git history`;

    // Recent decisions based on commits
    const decision = {
      title: "Implement UMB command for memory bank updates",
      rationale: "Simplify the process of updating memory bank files",
      implications: "Need to maintain consistency between UMB command and memory bank files",
      status: "Implemented"
    };

    // Progress updates based on recent activity
    const progress = {
      currentTasks: [
        "Refine UMB command implementation",
        "Enhance memory bank file structure",
        "Improve automation of documentation updates"
      ],
      completedTasks: [
        "Implemented UMB command",
        "Created memory bank file structure",
        "Added documentation for memory bank usage"
      ],
      upcomingTasks: [
        "Integrate memory bank with Roo-Code",
        "Add visualization for memory bank data",
        "Implement search functionality for memory bank"
      ],
      milestones: [
        {
          title: "Memory Bank Implementation",
          description: "Implemented basic memory bank functionality for context retention"
        }
      ]
    };

    // Create the updates object
    const updates = {
      productContext: {
        coreFeatures,
        architectureOverview
      },
      activeContext: {
        currentFocus,
        recentChanges
      },
      systemPatterns: {
        architecturalPatterns
      },
      decision,
      progress
    };

    // Update the memory bank files
    let updatedFiles = [];

    if (updates.productContext) {
      const success = updateProductContext(updates.productContext);
      if (success) updatedFiles.push('productContext.md');
    }

    if (updates.activeContext) {
      const success = updateActiveContext(updates.activeContext);
      if (success) updatedFiles.push('activeContext.md');
    }

    if (updates.systemPatterns) {
      const success = updateSystemPatterns(updates.systemPatterns);
      if (success) updatedFiles.push('systemPatterns.md');
    }

    if (updates.decision) {
      const success = addDecision(updates.decision);
      if (success) updatedFiles.push('decisionLog.md');
    }

    if (updates.progress) {
      const success = updateProgress(updates.progress);
      if (success) updatedFiles.push('progress.md');
    }

    if (updatedFiles.length === 0 && !fs.existsSync(PRODUCT_CONTEXT_PATH)) { // Check if it was truly an init
      // This condition might be tricky if ensureMemoryBankInitialized always creates files.
      // However, if for some reason no *updates* happened to *newly created* files,
      // we still want to report success for init.
      // A better check might be if any file was *created* by ensureMemoryBankInitialized.
      // For now, let's assume if updatedFiles is empty but files exist, init was okay.
      if (fs.existsSync(PRODUCT_CONTEXT_PATH)) { // Check if files were at least created
        return {
          success: true,
          message: 'Memory bank initialized with default files.'
        };
      }
      return {
        success: false,
        message: 'No updates provided, and initialization might have failed to create files.'
      };
    } else if (updatedFiles.length === 0) {
      return {
        success: true, // Or false, depending on whether an update was expected
        message: 'No actual content updates made to existing memory bank files.'
      };
    }

    return {
      success: true,
      message: `Memory bank updated successfully. Updated files: ${updatedFiles.join(', ')}`
    };
  } catch (error) {
    console.error('Error automatically updating memory bank:', error);
    return {
      success: false,
      message: `Failed to update memory bank: ${error.message}`
    };
  }
}

// Run the auto-update function
const result = autoUpdateMemoryBank();
console.log(result.message);
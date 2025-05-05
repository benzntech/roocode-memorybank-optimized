# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Test Commands
- Build: `npm run build`
- Dev: `npm run dev`
- Test: `npm run test`
- Run single test: `npx jest path/to/test-file.test.ts`
- Memory bank test: `npm run test-memory-bank`
- CLI tool: `npm run umb`
- Roo integration: `npm run roo-setup`, `npm run roo-sync`

## Code Style Guidelines
- TypeScript with strict typing (`strict: true`)
- Use ES2020 features and NodeNext module system
- Use async/await for asynchronous operations
- Comprehensive error handling with try/catch blocks
- Document errors with format: 'Error <operation>: <details>'
- Use descriptive interface names (e.g., `MemoryBankConfig`)
- Class methods should have JSDoc comments
- Use path.join() for cross-platform path construction
- Imports: group by source (node modules first, then local)
- Error handling: catch specific errors, log details
- Documentation: maintain user guides in docs/ directory
- Maintain backward compatibility where possible
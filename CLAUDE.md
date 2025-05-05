# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Test Commands
- Build: `npm run build`
- Dev: `npm run dev`
- Test: `npm run test`
- Run single test: `npx jest path/to/test-file.test.ts`
- Memory bank test: `npm run test-memory-bank`
- CLI tool: `npm run umb`

## Code Style Guidelines
- TypeScript with strict typing (`strict: true`)
- Use ES2020 features and NodeNext module system
- Use async/await for asynchronous operations
- Comprehensive error handling with try/catch blocks
- Use descriptive interface names (e.g., `MemoryBankConfig`)
- Class methods should be documented with JSDoc comments
- Avoid logging sensitive information
- Consistent error message format: 'Error <operation>: <details>'
- Use path.join() for cross-platform path construction
- Maintain backward compatibility where possible
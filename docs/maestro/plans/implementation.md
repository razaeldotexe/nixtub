---
title: "ytdl-ts-conversion Implementation Plan"
design_ref: "docs/maestro/plans/design.md"
created: "2026-05-01"
status: "draft"
total_phases: 4
estimated_files: 8
task_complexity: "medium"
---

# ytdl-ts-conversion Implementation Plan

## Plan Overview

- **Total phases**: 4
- **Agents involved**: coder, ux_designer, tester
- **Estimated effort**: Medium. Scaffolding a new Bun project, implementing downloader logic, and building a React-based TUI with OpenTUI.

## Dependency Graph

```
Phase 1: Setup
      |
Phase 2: Core Logic (i18n, Downloader)
      |
Phase 3: UI Implementation (OpenTUI)
      |
Phase 4: Integration & Validation
```

## Execution Strategy

| Stage | Phases | Execution | Agent Count | Notes |
|-------|--------|-----------|-------------|-------|
| 1     | Phase 1 | Sequential | 1 | Project Scaffolding |
| 2     | Phase 2 | Sequential | 1 | Backend Logic |
| 3     | Phase 3 | Sequential | 1 | Frontend Components |
| 4     | Phase 4 | Sequential | 1 | Final Testing |

## Phase 1: Project Setup

### Objective
Initialize a Bun project with TypeScript and install necessary dependencies.

### Agent: coder
### Parallel: No

### Files to Create
- `package.json` — Bun project config.
- `tsconfig.json` — TypeScript configuration.
- `.gitignore` — Ignore node_modules, etc.

### Implementation Details
- Use `bun init -y`.
- Install dependencies: `opentui`, `react`, `react-dom`, `@types/react`, `@types/react-dom`.
- Configure `tsconfig.json` for React/JSX (OpenTUI uses React).

### Validation
- `bun install` succeeds.
- `tsc --noEmit` passes (on an empty main file).

### Dependencies
- Blocked by: []- Blocks: Phase 2

---

## Phase 2: Core Logic (i18n & Downloader)

### Objective
Implement the non-UI logic for language support and `yt-dlp` interaction.

### Agent: coder
### Parallel: No

### Files to Create
- `src/i18n.ts` — Service to load and provide translations from `languages/*.json`.
- `src/downloader.ts` — Logic to spawn `yt-dlp`, extract info, and parse progress.
- `src/types.ts` — Shared interfaces for Translations and VideoInfo.

### Implementation Details
- `i18n.ts`: Read `languages/` directory, parse JSON, and provide a lookup function.
- `downloader.ts`: Use `Bun.spawn` to call `yt-dlp`. Implement `extractInfo(url)` and `download(url, options, onProgress)`.
- Handle OS detection logic equivalent to Python version.

### Validation
- Unit tests for `i18n` and `downloader` (mocking `Bun.spawn`).

### Dependencies
- Blocked by: Phase 1
- Blocks: Phase 3

---

## Phase 3: UI Implementation

### Objective
Design and implement the OpenTUI components for the interactive interface.

### Agent: ux_designer, coder
### Parallel: No (UX designs first, then Coder implements)

### Files to Create
- `src/App.tsx` — Main application component using OpenTUI components.
- `src/components/Banner.tsx` — Reusable banner component.
- `src/components/ProgressView.tsx` — Progress display component.

### Implementation Details
- `App.tsx`: State management for URL, Format, and Progress.
- Use OpenTUI `Text`, `Input`, `Select`, and `Box` components.
- Recreate the "Rich" theme aesthetic using OpenTUI styling.

### Validation
- Manual verification of UI layouts.

### Dependencies
- Blocked by: Phase 2
- Blocks: Phase 4

---

## Phase 4: Integration & Validation

### Objective
Connect the UI with the core logic and perform end-to-end verification.

### Agent: tester
### Parallel: No

### Files to Create
- `src/index.tsx` — Entry point that mounts the App.
- `tests/e2e.test.ts` — Basic E2E test script.

### Implementation Details
- Wire `App.tsx` to call `downloader.ts` methods.
- Implement CLI argument parsing for language flags.

### Validation
- `bun run src/index.tsx` runs and displays the UI.
- Downloading a test URL (e.g., a short YouTube video) works as expected.
- Translation files are correctly applied based on flags.

### Dependencies
- Blocked by: Phase 3
- Blocks: None

---

## File Inventory

| # | File | Phase | Purpose |
|---|------|-------|---------|
| 1 | `package.json` | 1 | Bun config |
| 2 | `tsconfig.json` | 1 | TS config |
| 3 | `src/types.ts` | 2 | Shared types |
| 4 | `src/i18n.ts` | 2 | Translation service |
| 5 | `src/downloader.ts` | 2 | yt-dlp wrapper |
| 6 | `src/App.tsx` | 3 | Main UI |
| 7 | `src/components/Banner.tsx` | 3 | UI Component |
| 8 | `src/index.tsx` | 4 | Entry point |

## Risk Classification

| Phase | Risk | Rationale |
|-------|------|-----------|
| 1     | LOW | Standard setup. |
| 2     | MEDIUM | yt-dlp progress parsing can be tricky. |
| 3     | MEDIUM | Mastering OpenTUI layout and state transitions. |
| 4     | LOW | Standard integration. |

## Execution Profile

Execution Profile:
- Total phases: 4
- Parallelizable phases: 0
- Sequential-only phases: 4
- Estimated parallel wall time: N/A
- Estimated sequential wall time: 2-3 hours

Note: Native subagents currently run without user approval gates.
All tool calls are auto-approved without user confirmation.

---
title: "ytdl-ts-conversion"
created: "2026-05-01"
status: "draft"
authors: ["Gemini CLI"]
type: "design"
design_depth: "standard"
task_complexity: "medium"
---

# ytdl-ts-conversion Design Document

## Problem Statement
The current `ytdl_cli.py` is a Python-based CLI tool. The goal is to modernize it by converting it to TypeScript, utilizing Bun as the runtime and OpenTUI for a rich terminal user interface.

## Requirements

### Functional Requirements
1. **REQ-1**: Download videos/audio using `yt-dlp`.
2. **REQ-2**: Support multiple formats (best, mp4, mp3, manual).
3. **REQ-3**: Interactive UI using OpenTUI for URL input, format selection, and progress display.
4. **REQ-4**: Support multi-language banners and prompts using existing `languages/*.json` files.
5. **REQ-5**: Detect OS and set appropriate download directories.

### Non-Functional Requirements
1. **Performance**: Fast startup and efficient process spawning using Bun.
2. **Usability**: Intuitive TUI with clear progress feedback.

### Constraints
- Must use Bun as the runner.
- Must use OpenTUI for the UI.
- Must reuse existing translation files.

## Approach

### Selected Approach
**Bun + TypeScript + OpenTUI (React)**
- **Bun**: Provides high-performance JS/TS runtime and easy process spawning.
- **OpenTUI (React)**: Allows building interactive terminal UIs with a declarative React-like syntax.
- **yt-dlp**: Spawning `yt-dlp` as a child process via `Bun.spawn` to leverage its robust downloading capabilities.

### Alternatives Considered
#### Node.js + Inquirer/Enquirer
- **Description**: Standard Node.js CLI approach.
- **Pros**: Mature ecosystem.
- **Cons**: Slower startup than Bun; lacks the rich, interactive TUI components of OpenTUI.
- **Rejected Because**: User specifically requested Bun and OpenTUI.

## Architecture

### Component Diagram
```
[ User Input ] <-> [ OpenTUI (React App) ]
                        |
                        v
               [ Downloader Logic ] <-> [ Bun.spawn(yt-dlp) ]
                        |
                        v
               [ i18n Service ] <-> [ languages/*.json ]
```

### Data Flow
1. User starts the app with Bun.
2. i18n Service loads language files based on CLI flags or defaults.
3. OpenTUI renders the banner and prompts for URL/Format.
4. Downloader Logic extracts info using `yt-dlp --dump-json`.
5. OpenTUI displays video info and confirms download.
6. Downloader Logic spawns `yt-dlp` for downloading, parsing stdout for progress updates.
7. OpenTUI updates progress bar in real-time.

### Key Interfaces
```typescript
interface Translation {
  welcome: string;
  prompt_url: string;
  prompt_format: string;
  // ... rest of the fields from JSON
}

interface VideoInfo {
  title: string;
  uploader: string;
  duration: number;
  view_count: number;
}
```

## Agent Team

| Phase | Agent | Parallel | Deliverables |
|-------|-------|----------|--------------|
| 1     | architect | No | Design validation and final architecture |
| 2     | coder | No | Implementation of project structure, i18n, and downloader logic |
| 3     | ux_designer | No | OpenTUI components and layouts |
| 4     | tester | No | Verification of functionality |

## Risk Assessment

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| yt-dlp parsing | MEDIUM | MEDIUM | Use `--newline` and regex to parse progress reliably. |
| OpenTUI complexity | LOW | LOW | Use standard OpenTUI components for input and progress. |

## Success Criteria
1. Application compiles and runs with `bun run src/index.tsx`.
2. Successfully downloads a video from a URL.
3. UI matches the functionality of the Python version (banner, prompts, progress bar).
4. Multi-language support works as expected.

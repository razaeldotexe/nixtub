---
title: "UI Polish and Refactoring"
created: "2026-05-01"
status: "draft"
authors: ["Gemini CLI"]
type: "design"
design_depth: "standard"
task_complexity: "medium"
---

# UI Polish and Refactoring Design Document

## Problem Statement
The current UI is functional but could be more visually appealing. The `App.tsx` is becoming a "fat component" containing too much logic. We need to polish the aesthetics and refactor the code for better maintainability.

## Requirements
1. **REQ-1**: Refine UI colors (use consistent theme, subtle dimming for inactive parts).
2. **REQ-2**: Improve layout (better spacing, centered elements where appropriate).
3. **REQ-3**: Refactor `App.tsx` into smaller, focused components/hooks.
4. **REQ-4**: Add a "Loading" spinner or animation state if supported by OpenTUI.

## Approach
1. **Aesthetics**: Use a richer color palette (Claude Orange, subtle grays, vibrant success/error colors). Use better border styles (rounded, double).
2. **Architecture**: 
   - Extract `useDownloader` hook for state/logic management.
   - Separate Step views into their own components (e.g., `UrlStep`, `FormatStep`, `DownloadStep`).
3. **Feedback**: Add real-time visual feedback for keyboard interactions.

## Success Criteria
1. UI feels "modern" and "alive" in the terminal.
2. `App.tsx` is simplified and primarily coordinates sub-components.
3. Code is more idiomatic and follows senior standards.

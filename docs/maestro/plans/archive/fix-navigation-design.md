---
title: "Fix Navigation and Interaction"
created: "2026-05-01"
status: "draft"
authors: ["Gemini CLI"]
type: "design"
design_depth: "standard"
task_complexity: "medium"
---

# Fix Navigation and Interaction Design Document

## Problem Statement
Interactive elements like "[ Download another ]" use `onClick` handlers which don't work well with terminal keyboard navigation (Space, Tab, Enter). Terminal UIs rely on focus management and specific selection components.

## Requirements
1. **REQ-1**: Use `<select>` or proper focusable buttons for interactive choices.
2. **REQ-2**: Implement Tab navigation between focusable elements.
3. **REQ-3**: Ensure "Enter" or "Space" triggers actions on focused elements.

## Approach
1. Refactor `App.tsx` to use state-based focus.
2. Replace simple `<text onClick={...}>` with focusable components or a single-item `<select>` for buttons.
3. Implement a global `useKeyboard` handler for Tab navigation if multiple inputs are present.
4. Update the "Success" and "Error" screens to use a proper selection list for actions.

## Success Criteria
1. Users can navigate between buttons/actions using Tab.
2. Users can trigger actions using Enter/Space.
3. Interactive elements are visually highlighted when focused.

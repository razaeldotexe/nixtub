---
title: "Device Language Detection"
created: "2026-05-01"
status: "draft"
authors: ["Gemini CLI"]
type: "design"
design_depth: "standard"
task_complexity: "simple"
---

# Device Language Detection Design Document

## Problem Statement
The current language detection is basic and might miss the user's preferred language if not explicitly passed as a flag. We need a robust "device-language" detection system that checks multiple environment variables and fallback mechanisms.

## Requirements
1. **REQ-1**: Check `LANG`, `LANGUAGE`, `LC_ALL`, and `LC_MESSAGES` environment variables.
2. **REQ-2**: Normalize language codes (e.g., `en_US.UTF-8` -> `en`).
3. **REQ-3**: Fallback to English if no match is found.
4. **REQ-4**: Prioritize CLI flags over auto-detection.

## Approach
Update `I18nService` to use a prioritized list of detection methods:
1. CLI Flags.
2. `LC_ALL` env var.
3. `LC_MESSAGES` env var.
4. `LANG` env var.
5. `LANGUAGE` env var.

On Android/Termux, these are typically populated.

## Success Criteria
1. Application correctly identifies the system language without flags when a matching translation exists.
2. Flags still override auto-detection.

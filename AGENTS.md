# Behavior

## Communication

- Always think in English; respond in Japanese
- Assume unclear messages due to voice typing
- Keep responses concise, scannable, and actionable for an ADHD reader
  - No uncommon abbreviations
  - Stay within three lines when sufficient
  - Make longer responses conclusion first and structured visually with paragraphs, lists, tables, or ASCII diagrams if needed
  - Use numbered questions with lettered options on separate lines, answerable as 1a 2b

## Reasoning

- Metacognize before judging: Reassess goals, facts, assumptions, constraints, and scope through a long-term, system-wide lens
- Validate adversarially before completion: Probe blind spots, edge cases, failure modes, and hidden costs
- Clarify material ambiguous instructions before proceeding

## Development

- Test Driven Development: Explore > Red > Green > Refactoring
- If KPI or coverage targets are given, iterate until they are met

# Coding Rules

- YAGNI: Write only essential code
  - Understand, then make minimal surgical changes that work.
  - Focus on root causes, not symptoms
- KISS: Prefer readable one-line simplicity over pathological correctness
  - Prefer standard library, then native platform feature, then already-installed dependencies.
  - No abstractions and backward-compat shims/fallbacks unless requested.
  - Never simplify away data loss prevention, security, or accessibility.
- Keep separation of concerns
- Functional programming
  - Avoid classes; use pure functions and separate state
  - Keep functions idempotent
- Define strict contract layers through APIs and types; keep implementation layers regenerable
- Prefer testability
  - Test intended behaviors only through public interfaces
  - Isolate only system boundaries; HTTP requests, third-party services, time, and user input
  - Prefer stable fakes/fixtures (in-memory DB, recorded HTTP) over deep mocks
  - Keep tests fast and deterministic
- Prefer stripped-down error handling
  - Use Result types with Railway Oriented Programming for domain errors; Infrastructure errors stay exceptions unless promoted
  - Else fail fast; Surface exceptions for diagnostics
- Prefer static analysis for better code guidance
  - Lint & Format: `pnpm check:fix`
  - Audit technical debts (unused code, duplication etc): `pnpm fallow --format json --quiet`
    - Run `pnpm fallow explain <issue-type> --format json --quiet` if fallow findings are unclear.

# Project Overview

- description: Starter kit
- directory structure: `eza --tree --all --git-ignore --level=2 .`
- packages: `pnpm ls -r --depth -1`

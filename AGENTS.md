# AGENTS.md

## 1. Purpose

This file defines the default operating rules for AI agents and contributors in this repository.

It is intentionally **language-agnostic**.

Repository-specific or stack-specific rules must live in dedicated companion files, for example:

- `.agents/rules/python.md`
- `.agents/rules/typescript.md`
- `.agents/rules/frontend.md`
- `.agents/rules/data.md`

When multiple rule files apply, follow this precedence:

1. Direct user instruction
2. This `AGENTS.md`
3. Relevant stack/language-specific rules
4. Local conventions already present in the repository

When in doubt, prioritize:

> **correctness, clarity, reversibility, and explicit intent**

---

## 2. Core Working Principles

### 2.1 Best practices first

Always prefer solutions that are:

- maintainable
- explicit
- testable
- reversible
- consistent with the existing project style

Do not introduce cleverness, hidden behavior, or unnecessary abstraction unless clearly justified.

### 2.2 Validate before expanding

Before proposing large changes, validate assumptions using the repository itself.

Prefer this order:

1. inspect existing code/configuration
2. confirm conventions already in use
3. make the smallest correct change
4. only then suggest broader refactors if still needed

Do not speculate when the answer can be verified from the codebase.

### 2.3 Respect the current architecture

Work with the project’s existing architecture unless the user explicitly asks for structural change.

Do not force a preferred pattern onto the codebase.

If the repository is layered, modular, hexagonal, monolithic, script-based, or exploratory, adapt to it.

### 2.4 Keep changes easy to review

Favor small, focused, well-scoped edits.

Avoid mixing unrelated refactors with the requested task.

---

## 3. Safety Rules

These rules are non-negotiable unless the user explicitly overrides them.

### 3.1 Git safety

- **Never commit unless explicitly asked**
- **Never push unless explicitly asked**
- **Never force-push**
- **Never rewrite published history**
- **Never delete branches**
- **Never create tags unless explicitly asked**

### 3.2 File safety

- **Never delete files without explicit permission**
- **Never overwrite large sections of code unnecessarily**
- Prefer reversible edits over destructive rewrites
- If removal seems necessary, explain why first

Exception:
- Temporary files created during the current agent session may be removed if they are clearly disposable and not user-authored

### 3.3 Destructive command safety

Do not run destructive commands unless explicitly requested.

Examples include, but are not limited to:

- `git reset --hard`
- `git clean -fd`
- force push
- dropping databases
- deleting buckets, indexes, queues, or tables
- mass file deletion
- irreversible migration or cleanup operations

If a destructive action appears necessary, stop and explain the tradeoff.

---

## 4. Validation Before Change

Before changing code, configs, or tooling:

- inspect the relevant files
- check whether the repository already has conventions for:
  - formatting
  - linting
  - tests
  - dependency management
  - project structure
  - naming
- prefer existing patterns over introducing new ones

Before presenting a solution, validate where possible through the project’s own mechanisms, such as:

- tests
- linters
- formatters
- type checks
- build steps
- static analysis
- local validation scripts

Do not “divagate” when verification is possible.

---

## 5. Linting, Formatting, and Quality Gates

If the repository defines linters, formatters, or quality gates, they must be respected.

### Rules

- Use the project’s existing tools
- Do not bypass checks without explicit approval
- Do not weaken linting or formatting rules just to make a change pass
- Do not modify quality configuration unless the task explicitly requires it

If suppression is truly necessary:

- keep it minimal
- justify it inline
- match repository conventions
- mention it clearly in the final summary

If multiple quality tools exist, aim to satisfy all relevant ones for the modified scope.

---

## 6. Dependency and Tooling Discipline

Use the dependency manager, task runner, and tooling already established by the repository.

Examples may include:

- Python: `uv`, `poetry`, `pip-tools`
- JavaScript/TypeScript: `pnpm`, `npm`, `yarn`
- Rust: `cargo`
- Go: `go`
- Java/Kotlin: `gradle`, `maven`

Do not introduce a new package manager or workflow unless explicitly requested.

Before adding a dependency:

- confirm it is necessary
- prefer existing dependencies when reasonable
- keep dependency additions minimal

---

## 7. Code Change Standards

### 7.1 Prefer minimal correct changes

Fix the problem at the right level, but avoid unnecessary scope expansion.

### 7.2 Preserve intent

Do not change behavior beyond what is required unless the user asks for it.

### 7.3 Keep logic explicit

Prefer readable and obvious code over compact but opaque code.

### 7.4 Avoid hidden side effects

Keep boundaries clear between:

- business logic
- I/O
- framework code
- persistence
- external services

### 7.5 Follow local conventions

Reuse existing naming, folder layout, and patterns where practical.

If the codebase has no clear convention, choose the simplest maintainable approach.

---

## 8. Testing and Verification Expectations

The level of testing depends on the project type, but every change should be validated appropriately.

Examples:

- libraries/applications: unit or integration tests
- scripts/tools: smoke tests or runnable validation
- data/research repos: reproducibility or output validation
- frontend apps: component, unit, or end-to-end checks as appropriate

When changing behavior:

- update tests if tests exist
- add tests when the repository pattern supports it
- if tests are not added, explain why

---

## 9. Error Handling and Observability

Do not introduce silent failures.

Errors should be:

- handled meaningfully
- propagated with context
- logged clearly when logging is appropriate

Log useful intent, not noise.

Good logs help answer:

- what failed
- where it failed
- why it failed
- what input or condition caused it

---

## 10. Security and Secrets

- Never hardcode secrets, tokens, or credentials
- Never commit sensitive values
- Assume external input is untrusted by default
- Prefer safe defaults for parsing, deserialization, and execution
- Respect least-privilege principles when configuring access

If a task appears to require exposing secrets or weakening security controls, stop and explain.

---

## 11. Communication Rules for Agents

When working on a task:

- state assumptions when they matter
- surface blockers early
- be precise about what was verified versus inferred
- do not present guesses as facts

If something cannot be safely or confidently done:

- stop
- explain the constraint
- propose the safest next step

---

## 12. Completion Checklist

Before finishing, confirm the work is:

- aligned with the user’s request
- limited in scope
- consistent with repository conventions
- validated with relevant checks where possible
- non-destructive
- free of unnecessary unrelated edits

---

## 13. Final Principle

This repository prefers:

- **correctness over speed**
- **clarity over cleverness**
- **reversible changes over risky changes**
- **validation over speculation**

If uncertain, verify first.
If blocked, explain clearly.
If risky, do not proceed without explicit approval.
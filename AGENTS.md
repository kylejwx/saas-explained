# Repository Workflow

Use local Git as the primary workflow for source changes in this repository. Use the Codex GitHub App as the GitHub collaboration layer, not as a substitute for the local development and publishing workflow.

## Local development and publishing

1. Before editing, inspect the current branch, worktree status, remote tracking state, and any existing uncommitted changes.
2. Fetch the latest remote state and update from `origin/main` before starting new work when it is safe to do so. Never discard, reset, or overwrite unrelated local changes.
3. For routine work on this small project, work directly on `main` when the user wants the completed changes published there. Use a dedicated branch or Codex worktree only for concurrent, risky, or explicitly review-based work. Never mix unrelated tasks in one dirty worktree.
4. Make and review changes locally. For site or documentation changes, run `npm run docs:build` and `git diff --check` before publishing.
5. When the user asks to publish, create focused local commits, push them with local Git, and verify the resulting remote branch or `main` state.
6. Treat publication as complete only when the requested changes are visible on the intended remote branch, usually `main`.

## GitHub App responsibilities

Use the Codex GitHub App for repository and pull-request inspection, PR creation after a branch is pushed, reviews, comments, issues, labels, and other GitHub-side metadata.

Do not use GitHub API file updates merely to bypass a broken local Git workflow. If a file or branch is changed directly on GitHub, fetch and reconcile that remote state before continuing local work.

The GitHub App uses separate authorization from local Git. When the installation is limited to selected repositories, confirm that this repository is included before relying on connector write operations.

## Guide content history

Before changing `SaaS_Architecture_Reference.md`, read and follow `CONTENT_MAINTENANCE.md`.

- Classify the change as routine, material, or a new edition before editing.
- Treat Version 1.0 as the baseline. Do not add a Version 1 entry to `CHANGELOG.md`; it records only material changes made after the August 4, 2026 baseline.
- Use Git commits alone for routine corrections and maintenance.
- Add a concise `CHANGELOG.md` entry when guidance changes cost, security, complexity, architecture, vendor selection, or the reader's recommended next step.
- Create frozen editions, annotated `guide-v*` tags, and GitHub Releases only for deliberate edition milestones.
- Never revise a frozen edition or move or delete an existing edition tag.

## Safety and coordination

- Commit or push only when the user requests it or the active task clearly includes publication.
- Preserve existing user and agent changes, including changes in other worktrees.
- Stop and report conflicts, overlapping edits, authentication failures, or branch divergence before choosing a destructive or history-rewriting resolution.
- Keep local checkout state and GitHub state aligned throughout PR, review, and merge work.

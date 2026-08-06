# Repository Workflow

Use local Git as the primary workflow for source changes in this repository. Use the Codex GitHub App as the GitHub collaboration layer, not as a substitute for the local development and publishing workflow.

## Local development and publishing

1. Before editing, inspect the current branch, worktree status, remote tracking state, and any existing uncommitted changes.
2. Fetch the latest remote state and update from `origin/main` before starting new work when it is safe to do so. Never discard, reset, or overwrite unrelated local changes.
3. For routine work on this small project, work directly on `main`. Treat a request to make or implement a change as authorization to complete the normal publication workflow: commit focused changes, push to `origin/main`, and verify the production deployment. Do not pause to ask separately for publication.
4. Make and review changes locally. For site or documentation changes, run `npm run docs:build` and `git diff --check` before publishing.
5. Create focused local commits, push them with local Git, and verify the resulting remote branch or `main` state as part of completing each requested change.
6. Treat publication as complete only when the requested changes are visible on the intended remote branch, usually `main`.

## Default delivery authorization

Unless the user explicitly asks to review, check, preview, hold, or otherwise approve a change first, proceed from implementation through commit, push, and live deployment without requesting a separate publication confirmation. Report the result once the live deployment has been verified.

This default does not override safety boundaries: stop and report conflicts, overlapping changes, authentication failures, branch divergence, or other conditions that require a destructive or materially scope-changing choice.

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
- Make every material change to `SaaS_Architecture_Reference.md` its own focused commit; include its changelog entry and directly dependent summary updates in that commit, but do not combine independent recommendation changes.
- Material guide-change commits require a subject naming the area and changed recommendation, plus a blank-line-separated body explaining the reason and reader-facing consequence. Routine-only commits may group non-substantive cleanup and need only a descriptive subject.
- Create frozen editions, annotated `guide-v*` tags, and GitHub Releases only for deliberate edition milestones.
- Never revise a frozen edition or move or delete an existing edition tag.

## Safety and coordination

- Treat requested implementation as authorization to commit, push, and publish under the default delivery policy above, unless the user explicitly asks to review or hold first.
- Preserve existing user and agent changes, including changes in other worktrees.
- Stop and report conflicts, overlapping edits, authentication failures, or branch divergence before choosing a destructive or history-rewriting resolution.
- Keep local checkout state and GitHub state aligned throughout PR, review, and merge work.

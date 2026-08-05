# Content Maintenance

This procedure keeps changes to the SaaS Architecture Reference understandable to both readers and maintainers.

## Version 1 baseline

Version 1.0 is the official baseline as of August 4, 2026. The baseline is preserved in three places:

- the reader-facing frozen copy at `editions/v1.0.md`;
- the annotated Git tag `guide-v1.0`; and
- the corresponding GitHub Release.

`CHANGELOG.md` intentionally contains no Version 1 entry. It begins only when a material change is made after this baseline.

## Sources of history

Each history mechanism has a different purpose:

- **Git commits** record every published change, including corrections and maintenance.
- **`CHANGELOG.md`** records material post-Version-1 content changes for readers.
- **Frozen editions** preserve reader-visible copies of formal versions.
- **Annotated Git tags and GitHub Releases** identify the exact repository state for each formal version.

VitePress's last-updated timestamp is useful supporting information, but it is not a substitute for explaining a material change.

## Classify the change

Classify proposed work before editing the guide.

| Change type | Examples | Required history |
| --- | --- | --- |
| Routine | Typo, formatting, broken link, wording clarification that does not change the advice, build or site configuration | Descriptive Git commit only |
| Material | Guidance that changes cost, security, complexity, architecture, vendor selection, or the reader's recommended next step; a significant correction or new section | Git commit and changelog entry |
| New edition | A substantial revision that should remain available as a named version | Material-change records, updated version label, frozen edition, annotated tag, and GitHub Release |

When uncertain, treat a change as material if it could cause a reader to make a different technical or purchasing decision.

## Record a material change

Add material changes to `CHANGELOG.md` under a date heading. Keep entries concise and explain the consequence, not merely the edited words:

```markdown
### YYYY-MM-DD

- **Area:** What changed and why it matters to the reader.
```

Do not add routine corrections, internal workflow changes, or deployment maintenance to the changelog.

Usually the changelog is enough. Add a short note inside the guide only when historical context is necessary to prevent confusion—for example, when previously recommended technology is now discouraged for security or support reasons.

## Create a new edition

Create an edition only for a deliberate milestone, not for every material update.

1. Confirm the new version number and edition date.
2. Update the version label in `SaaS_Architecture_Reference.md` and any matching label in `README.md`.
3. Copy the completed guide to `editions/v<version>.md`. Never revise a frozen edition afterward.
4. Add the edition to `versions.md`.
5. Add an annotated `guide-v<version>` tag to the published edition commit.
6. Create a GitHub Release from that tag with a concise summary of the edition.
7. Never move or delete an existing `guide-v*` tag.

The version number is an editorial edition number. A larger restructuring or change in foundational advice normally warrants a new major version; a meaningful expansion that preserves the foundation normally warrants a minor version.

## Update and publish the guide

1. Inspect the branch, working tree, remote tracking state, and unrelated changes.
2. Fetch and safely incorporate the latest `origin/main` before editing.
3. Classify the planned change as routine, material, or a new edition.
4. Edit `SaaS_Architecture_Reference.md`, keeping duplicated summary or version text in `README.md` consistent when applicable.
5. Update `CHANGELOG.md` only for a material post-baseline change.
6. For a new edition, complete the edition steps above before publishing.
7. Review the diff and run:

   ```powershell
   npm run docs:build
   git diff --check
   ```

8. Create a focused commit and publish it using the workflow in `AGENTS.md`.
9. Verify the intended commit on GitHub `main` and confirm the GitHub Pages deployment succeeds.

---
description: Analyze uncommitted changes and create separate commits grouped by function
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*)
---

Analyze all uncommitted changes and create separate commits, grouping related changes together.

## Current state

Staged changes:
!`git diff --cached --stat`

Unstaged changes:
!`git diff --stat`

Untracked files:
!`git status --porcelain | grep "^??" | cut -c4-`

Recent commit style:
!`git log --oneline -5`

## Instructions

1. **Analyze all changes** (staged, unstaged, untracked) by reading the actual diffs:
   - Use `git diff` and `git diff --cached` to understand what each change does
   - For new files, read them to understand their purpose

2. **Group changes by logical function**:
   - Feature additions should be one commit
   - Bug fixes should be separate commits
   - Refactoring should be separate from features
   - Documentation updates should be separate
   - Config/dependency changes should be separate
   - If changes to different files serve the same purpose, group them together

3. **For each group, create a commit**:
   - Stage only the files belonging to that group using `git add <files>`
   - Write a commit message following conventional commits: `type: description`
   - Types: feat, fix, refactor, docs, style, test, chore
   - Keep messages under 72 characters, imperative mood, no period
   - Add the standard footer to each commit

4. **Order commits logically**:
   - Infrastructure/setup changes first
   - Core changes before dependent changes
   - Tests can go with their related code or as separate commits

5. **Present your plan first**:
   - Before making any commits, show the user what groups you identified
   - List which files go into each commit and the proposed commit message
   - Ask for confirmation before proceeding

## Output format

First, show your analysis:
```
Proposed commits:
1. [type: message] - file1, file2
2. [type: message] - file3
...
```

Then ask: "Should I proceed with these commits?"

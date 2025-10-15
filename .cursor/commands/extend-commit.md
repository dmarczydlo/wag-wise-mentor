# Extend Commit Command

## Purpose

This command extends an existing commit by adding new changes to the current branch and pushing the updates to the remote repository.

## What it does

1. **Stage Changes**: Adds all modified and untracked files to the staging area
2. **Amend Commit**: Extends the most recent commit with the new changes (using `git commit --amend`)
3. **Push Updates**: Pushes the amended commit to the current branch on the remote repository

## Usage

- Use this when you want to add more changes to your last commit instead of creating a new commit
- Ideal for fixing typos, adding forgotten files, or making small improvements to recent work
- Only works if you haven't pushed the commit yet, or if you're comfortable force-pushing

## Commands Executed

```bash
git add .
git commit --amend --no-edit
git push --force-with-lease
```

## Safety Notes

- Uses `--force-with-lease` for safer force pushing
- Only amends the most recent commit
- Will overwrite the remote commit history for this branch
- Use with caution on shared branches

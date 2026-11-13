# This fork

A personal fork of [desktop/desktop](https://github.com/desktop/desktop).
The default branch is `development`, as upstream.

## What it adds

**Fetch and pull all repositories.** A sync button beside "Add" in the
repository list, and the same command in the Repository menu. For every
repository in the list, it fetches the remote of the current branch, then
fast-forwards the branch when that is safe. A summary lists what was pulled,
already up to date, skipped and failed.

A repository is skipped, never merged, when it has diverged from its upstream,
has uncommitted changes, has no upstream, has no branch checked out or is in
the middle of a merge, rebase or cherry-pick.

The code is in `app/src/lib/fetch-and-pull-all.ts`,
`AppStore._fetchAndPullAllRepositories` and
`app/src/ui/fetch-and-pull-all/`.

**Commit all repositories.** A commit button beside the sync button. For every
repository included in "Commit all", it commits all the changes, untracked
files too, in one commit, without pushing. Copilot writes the message when a
signed-in account can use it; otherwise the summary names the changed files,
as in "Update a.ts and 2 other files". A summary lists what was committed,
had nothing to commit, was skipped and failed.

Every repository is included by default, shown by a green dot in the
repository list. Right-click a repository and untick "Include in commit all"
to leave it out. A repository is skipped when it has no branch checked out or
is in the middle of a merge, rebase or cherry-pick.

The code is in `app/src/lib/commit-all.ts`, `AppStore._commitAllRepositories`
and `app/src/ui/commit-all/`.

## Installing on Windows

1. On GitHub, open **Actions**, pick **Build Windows installer** and click
   **Run workflow**. It runs only when started by hand.
2. When the run is green, download the `GitHubDesktopSetup-x64` artifact
   from its page, unzip it and run `GitHubDesktopSetup-x64.exe`.
3. Windows SmartScreen warns that the installer is unsigned: click
   **More info**, then **Run anyway**.

It installs over the official GitHub Desktop and keeps your repositories and
settings. The build uses the `test` release channel, so it never auto-updates
to the official release (which would remove this fork's features), and it
shows an extra Test menu. To update, merge upstream and run the workflow
again. The other upstream workflows are disabled on this fork, to save
Actions minutes.

## Taking upstream updates

```bash
git fetch upstream
git merge upstream/development
```

Keep the changes small and in their own files where possible, so these merges
stay easy.

## Building

Follow `docs/contributing/setup.md`. In short: `yarn`, then `yarn build:dev`
and `yarn start`. Checks: `yarn lint` and
`yarn test app/test/unit/fetch-and-pull-all-test.ts
app/test/unit/commit-all-test.ts`.

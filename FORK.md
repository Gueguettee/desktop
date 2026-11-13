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

Install once by hand: on GitHub, open **Releases**, download
`GitHubDesktopSetup-x64.exe` from the latest one and run it. Windows
SmartScreen warns that the installer is unsigned: click **More info**, then
**Run anyway**. It installs over the official GitHub Desktop and keeps your
repositories and settings.

After that the app updates itself: it checks at startup and every four hours,
downloads the new version and shows a banner to restart. **Help > About**
checks at once.

## How updates are published

`.github/workflows/build-windows.yml` runs on every push to `development`
that changes more than docs, and by hand from **Actions**. It publishes a
release holding the installer and the two files the updater reads, `RELEASES`
and the `.nupkg` package, and keeps the last three releases. The app reads
them from `releases/latest/download`.

The updater only installs a higher version, so the build numbers itself:
upstream `3.6.10` built by run 42 is `3.6.10042`.

The build uses the `test` release channel, so it never updates to the
official release (which would remove this fork's features), and it shows an
extra Test menu. The other upstream workflows are disabled on this fork.

## Following upstream

`.github/workflows/follow-upstream.yml` merges the latest official release
tag into `development` every day, which starts a build. It needs the
repository secret `UPSTREAM_SYNC_TOKEN`: the fine-grained personal access
token `desktop-fork-follow-upstream`, limited to this repository, with
**Contents** and **Workflows** set to read and write. It has no expiry date. When a merge conflicts, the run fails and GitHub emails you; merge by
hand:

```bash
git fetch upstream --tags
git merge release-<version>
```

GitHub turns a scheduled workflow off after 60 days without a push; turn it
back on from **Actions**.

Keep the changes small and in their own files where possible, so these merges
stay easy.

## Building

Follow `docs/contributing/setup.md`. In short: `yarn`, then `yarn build:dev`
and `yarn start`. Checks: `yarn lint` and
`yarn test app/test/unit/fetch-and-pull-all-test.ts
app/test/unit/commit-all-test.ts`.

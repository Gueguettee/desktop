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
`yarn test app/test/unit/fetch-and-pull-all-test.ts`.

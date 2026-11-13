import { describe, it } from 'node:test'
import assert from 'node:assert'
import { writeFile } from 'fs/promises'
import * as path from 'path'

import {
  getCommitBlocker,
  getCommitSummary,
  isIncludedInCommitAll,
} from '../../src/lib/commit-all'
import { createCommit, getStatus } from '../../src/lib/git'
import { git } from '../../src/lib/git/core'
import { Repository } from '../../src/models/repository'
import { AppFileStatusKind, FileChange } from '../../src/models/status'
import { setupTwoCommitRepo } from '../helpers/repositories'

async function statusOf(repository: Repository) {
  const status = await getStatus(repository)
  assert.ok(status)
  return status
}

const file = (
  name: string,
  kind: AppFileStatusKind.New | AppFileStatusKind.Modified
) => new FileChange(name, { kind })

describe('isIncludedInCommitAll', () => {
  const repository = (includedInCommitAll?: boolean) =>
    new Repository('/repo', 1, null, false, null, { includedInCommitAll })

  it('is on by default', () => {
    assert.equal(isIncludedInCommitAll(repository()), true)
  })

  it('can be turned off, which changes the hash', () => {
    assert.equal(isIncludedInCommitAll(repository(false)), false)
    assert.notEqual(repository(false).hash, repository().hash)
  })
})

describe('getCommitSummary', () => {
  it('names one or two files', () => {
    assert.equal(
      getCommitSummary([file('src/a.ts', AppFileStatusKind.New)]),
      'Add a.ts'
    )
    assert.equal(
      getCommitSummary([
        file('a.ts', AppFileStatusKind.Modified),
        file('b.ts', AppFileStatusKind.Modified),
      ]),
      'Update a.ts and b.ts'
    )
  })

  it('counts the files after the first, and says Update for mixed changes', () => {
    assert.equal(
      getCommitSummary([
        file('a.ts', AppFileStatusKind.New),
        file('b.ts', AppFileStatusKind.Modified),
        file('c.ts', AppFileStatusKind.Modified),
      ]),
      'Update a.ts and 2 other files'
    )
  })
})

describe('commit all changes', () => {
  it('commits tracked and untracked changes', async t => {
    const repository = await setupTwoCommitRepo(t)
    await writeFile(path.join(repository.path, 'good-file'), 'edited')
    await writeFile(path.join(repository.path, 'new-file'), 'new')

    const status = await statusOf(repository)
    assert.equal(getCommitBlocker(status), null)

    const files = status.workingDirectory.withIncludeAllFiles(true).files
    await createCommit(repository, getCommitSummary(files), files)

    assert.equal((await statusOf(repository)).workingDirectory.files.length, 0)
  })

  it('blocks a detached HEAD', async t => {
    const repository = await setupTwoCommitRepo(t)
    await git(['checkout', '--detach'], repository.path, 'detach')

    assert.equal(
      getCommitBlocker(await statusOf(repository)),
      'No branch checked out'
    )
  })
})

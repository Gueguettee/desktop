import { describe, it, TestContext } from 'node:test'
import assert from 'node:assert'
import { writeFile } from 'fs/promises'
import * as path from 'path'

import { getFastForwardBlocker } from '../../src/lib/fetch-and-pull-all'
import { getStatus, merge, MergeResult } from '../../src/lib/git'
import { git } from '../../src/lib/git/core'
import { Repository } from '../../src/models/repository'
import {
  setupLocalForkOfRepository,
  setupTwoCommitRepo,
} from '../helpers/repositories'
import { makeCommit } from '../helpers/repository-scaffolding'

const commit = (repository: Repository, contents: string) =>
  makeCommit(repository, {
    commitMessage: contents,
    entries: [{ path: `${contents}-file`, contents }],
  })

/** A clone whose origin has one commit the clone has not fetched yet. */
async function setupCloneBehindOrigin(t: TestContext) {
  const origin = await setupTwoCommitRepo(t)
  const clone = await setupLocalForkOfRepository(t, origin)
  await commit(origin, 'upstream')
  await git(['fetch', '--', 'origin'], clone.path, 'fetch')
  return clone
}

async function statusOf(repository: Repository) {
  const status = await getStatus(repository)
  assert.ok(status)
  return status
}

describe('getFastForwardBlocker', () => {
  it('allows a clean branch that is behind its upstream', async t => {
    const clone = await setupCloneBehindOrigin(t)
    const status = await statusOf(clone)

    assert.equal(getFastForwardBlocker(status), null)
    assert.equal(status.branchAheadBehind?.behind, 1)
  })

  it('blocks uncommitted changes when behind', async t => {
    const clone = await setupCloneBehindOrigin(t)
    await writeFile(path.join(clone.path, 'good-file'), 'edited')

    assert.equal(
      getFastForwardBlocker(await statusOf(clone)),
      'There are uncommitted changes'
    )
  })

  it('blocks a branch that has diverged', async t => {
    const clone = await setupCloneBehindOrigin(t)
    await commit(clone, 'local')

    assert.equal(
      getFastForwardBlocker(await statusOf(clone)),
      'The branch has diverged from its upstream'
    )
  })

  it('blocks a branch without an upstream', async t => {
    const repository = await setupTwoCommitRepo(t)

    assert.equal(
      getFastForwardBlocker(await statusOf(repository)),
      'The branch has no upstream'
    )
  })

  it('blocks a detached HEAD', async t => {
    const clone = await setupCloneBehindOrigin(t)
    await git(['checkout', '--detach'], clone.path, 'detach')

    assert.equal(
      getFastForwardBlocker(await statusOf(clone)),
      'No branch checked out'
    )
  })
})

describe('merge with ffOnly', () => {
  it('fast-forwards the current branch to its upstream', async t => {
    const clone = await setupCloneBehindOrigin(t)
    const upstream = (await statusOf(clone)).currentUpstreamBranch
    assert.ok(upstream)

    assert.equal(
      await merge(clone, upstream, { ffOnly: true }),
      MergeResult.Success
    )

    const status = await statusOf(clone)
    assert.equal(status.branchAheadBehind?.behind, 0)
    assert.equal(status.branchAheadBehind?.ahead, 0)
  })
})

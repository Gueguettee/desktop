import { IStatusResult } from './git'

/** What happened to one repository during "Fetch and pull all". */
export interface IFetchAndPullOutcome {
  readonly outcome: 'pulled' | 'up-to-date' | 'skipped' | 'failed'
  /** Why the repository was skipped or failed. */
  readonly detail?: string
}

/** The outcome for one named repository. */
export interface IFetchAndPullResult extends IFetchAndPullOutcome {
  readonly repositoryName: string
}

/**
 * Get the reason the current branch cannot be fast-forwarded.
 *
 * Returns null when a fast-forward is possible or the branch is already up to
 * date.
 */
export function getFastForwardBlocker(status: IStatusResult): string | null {
  if (status.currentBranch === undefined || status.currentTip === undefined) {
    return 'No branch checked out'
  }

  if (status.currentUpstreamBranch === undefined) {
    return 'The branch has no upstream'
  }

  if (
    status.mergeHeadFound ||
    status.squashMsgFound ||
    status.rebaseInternalState !== null ||
    status.isCherryPickingHeadFound ||
    status.doConflictedFilesExist
  ) {
    return 'An operation is in progress'
  }

  const behind = status.branchAheadBehind?.behind ?? 0
  const ahead = status.branchAheadBehind?.ahead ?? 0

  if (behind > 0 && ahead > 0) {
    return 'The branch has diverged from its upstream'
  }

  if (behind > 0 && status.workingDirectory.files.length > 0) {
    return 'There are uncommitted changes'
  }

  return null
}

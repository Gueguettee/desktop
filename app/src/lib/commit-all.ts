import * as Path from 'path'
import { IStatusResult } from './git'
import { Repository } from '../models/repository'
import { AppFileStatusKind, FileChange } from '../models/status'

/** What happened to one repository during "Commit all". */
export interface ICommitAllOutcome {
  readonly outcome: 'committed' | 'nothing-to-commit' | 'skipped' | 'failed'
  /** The commit summary, or why the repository was skipped or failed. */
  readonly detail?: string
}

/** The outcome for one named repository. */
export interface ICommitAllResult extends ICommitAllOutcome {
  readonly repositoryName: string
}

/** Whether "Commit all" commits this repository. On unless turned off. */
export function isIncludedInCommitAll(repository: Repository): boolean {
  return repository.workflowPreferences.includedInCommitAll !== false
}

/** Get the reason the changes cannot be committed, or null when they can. */
export function getCommitBlocker(status: IStatusResult): string | null {
  if (status.currentBranch === undefined) {
    return 'No branch checked out'
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

  return null
}

function getVerb(file: FileChange): string {
  switch (file.status.kind) {
    case AppFileStatusKind.New:
    case AppFileStatusKind.Untracked:
    case AppFileStatusKind.Copied:
      return 'Add'
    case AppFileStatusKind.Deleted:
      return 'Delete'
    case AppFileStatusKind.Renamed:
      return 'Rename'
    default:
      return 'Update'
  }
}

/** Describe the changed files, for when Copilot cannot write the summary. */
export function getCommitSummary(files: ReadonlyArray<FileChange>): string {
  const verbs = new Set(files.map(getVerb))
  const verb = verbs.size === 1 ? getVerb(files[0]) : 'Update'
  const names = files.map(f => Path.basename(f.path))

  if (names.length <= 2) {
    return `${verb} ${names.join(' and ')}`
  }

  return `${verb} ${names[0]} and ${names.length - 1} other files`
}

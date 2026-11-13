import * as React from 'react'
import { ICommitAllResult } from '../../lib/commit-all'
import { RepositoryResultsDialog } from '../fetch-and-pull-all/repository-results-dialog'

interface ICommitAllResultDialogProps {
  readonly results: ReadonlyArray<ICommitAllResult>
  readonly onDismissed: () => void
}

const sections = [
  { outcome: 'failed', title: 'Failed' },
  { outcome: 'skipped', title: 'Skipped' },
  { outcome: 'committed', title: 'Committed' },
  { outcome: 'nothing-to-commit', title: 'Nothing to commit' },
]

/** Summarize what "Commit all repositories" did to each repository. */
export class CommitAllResultDialog extends React.Component<ICommitAllResultDialogProps> {
  public render() {
    return (
      <RepositoryResultsDialog
        id="commit-all-result"
        title={
          __DARWIN__ ? 'Commit All Repositories' : 'Commit all repositories'
        }
        sections={sections}
        results={this.props.results}
        onDismissed={this.props.onDismissed}
      />
    )
  }
}

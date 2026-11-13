import * as React from 'react'
import { IFetchAndPullResult } from '../../lib/fetch-and-pull-all'
import { RepositoryResultsDialog } from './repository-results-dialog'

interface IFetchAndPullAllResultDialogProps {
  readonly results: ReadonlyArray<IFetchAndPullResult>
  readonly onDismissed: () => void
}

const sections = [
  { outcome: 'failed', title: 'Failed' },
  { outcome: 'skipped', title: 'Skipped' },
  { outcome: 'pulled', title: 'Pulled' },
  { outcome: 'up-to-date', title: 'Already up to date' },
]

/** Summarize what "Fetch and pull all repositories" did to each repository. */
export class FetchAndPullAllResultDialog extends React.Component<IFetchAndPullAllResultDialogProps> {
  public render() {
    return (
      <RepositoryResultsDialog
        id="fetch-and-pull-all-result"
        title={
          __DARWIN__
            ? 'Fetch and Pull All Repositories'
            : 'Fetch and pull all repositories'
        }
        sections={sections}
        results={this.props.results}
        onDismissed={this.props.onDismissed}
      />
    )
  }
}

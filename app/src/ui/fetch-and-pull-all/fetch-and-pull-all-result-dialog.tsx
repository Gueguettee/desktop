import * as React from 'react'
import { Dialog, DialogContent, DefaultDialogFooter } from '../dialog'
import {
  IFetchAndPullOutcome,
  IFetchAndPullResult,
} from '../../lib/fetch-and-pull-all'

interface IFetchAndPullAllResultDialogProps {
  readonly results: ReadonlyArray<IFetchAndPullResult>
  readonly onDismissed: () => void
}

interface ISection {
  readonly outcome: IFetchAndPullOutcome['outcome']
  readonly title: string
}

const sections: ReadonlyArray<ISection> = [
  { outcome: 'failed', title: 'Failed' },
  { outcome: 'skipped', title: 'Skipped' },
  { outcome: 'pulled', title: 'Pulled' },
  { outcome: 'up-to-date', title: 'Already up to date' },
]

/** Summarize what "Fetch and pull all repositories" did to each repository. */
export class FetchAndPullAllResultDialog extends React.Component<IFetchAndPullAllResultDialogProps> {
  public render() {
    return (
      <Dialog
        id="fetch-and-pull-all-result"
        title={
          __DARWIN__
            ? 'Fetch and Pull All Repositories'
            : 'Fetch and pull all repositories'
        }
        onDismissed={this.props.onDismissed}
        onSubmit={this.props.onDismissed}
      >
        <DialogContent>{sections.map(this.renderSection)}</DialogContent>
        <DefaultDialogFooter buttonText="Close" />
      </Dialog>
    )
  }

  private renderSection = (section: ISection) => {
    const results = this.props.results.filter(
      r => r.outcome === section.outcome
    )

    if (results.length === 0) {
      return null
    }

    return (
      <section key={section.outcome}>
        <h3>
          {section.title} ({results.length})
        </h3>
        <ul>
          {results.map((r, i) => (
            <li key={i}>
              <strong>{r.repositoryName}</strong>
              {r.detail !== undefined ? `: ${r.detail}` : null}
            </li>
          ))}
        </ul>
      </section>
    )
  }
}

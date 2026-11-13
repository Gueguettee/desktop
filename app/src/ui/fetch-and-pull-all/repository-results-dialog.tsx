import * as React from 'react'
import { Dialog, DialogContent, DefaultDialogFooter } from '../dialog'

interface IResult {
  readonly repositoryName: string
  readonly outcome: string
  readonly detail?: string
}

interface ISection {
  readonly outcome: string
  readonly title: string
}

interface IRepositoryResultsDialogProps {
  readonly id: string
  readonly title: string
  /** The outcomes to list, in order, each under its title. */
  readonly sections: ReadonlyArray<ISection>
  readonly results: ReadonlyArray<IResult>
  readonly onDismissed: () => void
}

/** List what an operation on many repositories did to each of them. */
export class RepositoryResultsDialog extends React.Component<IRepositoryResultsDialogProps> {
  public render() {
    return (
      <Dialog
        id={this.props.id}
        title={this.props.title}
        onDismissed={this.props.onDismissed}
        onSubmit={this.props.onDismissed}
      >
        <DialogContent>
          {this.props.sections.map(this.renderSection)}
        </DialogContent>
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

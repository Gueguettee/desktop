export enum ForkContributionTarget {
  Parent = 'parent',
  Self = 'self',
}

/**
 * Collection of configurable settings regarding how the user may work with a repository.
 */
export type WorkflowPreferences = {
  /**
   * What repo does the user want to contribute to with this fork?
   */
  readonly forkContributionTarget?: ForkContributionTarget

  /** Whether "Commit all repositories" commits this one. On when not set. */
  readonly includedInCommitAll?: boolean
}

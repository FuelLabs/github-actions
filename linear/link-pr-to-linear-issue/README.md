### Overview

This is a github action to link a GitHub PR to Linear issues, because Linear doesn't do that automatically. It supports all the GitHub magic words (closes, fixes, etc.) so that when a PR closes an issue via magic words, the action finds the Linear issues related to the closing issues and links them by adding a comment in the PR's body with Linear magic words that close that Linear issue:

```md
<!-- LINEAR: closes LIN-ID-1, LIN-ID-2 -->

- Closes #ISSUE1,
- Closes #ISSUE2
```

If one wants to relate a PR to an issue without setting it as closing for that issue, they can add a "relates to", "related to", or "part of".
This adds a markdown comment which relates the PR to linear issues without tagging the PR as closing in Linear:

```md
<!-- LINEAR: relates to LIN-ID-1, LIN-ID-2, LIN-ID-3 -->

- Relates to #ISSUE1
- Related to #ISSUE2
- Part of #ISSUE3
```

Besides linking issues, the action also unlinks issues from PRs for cases where somebody erroneously links the wrong issue in GitHub (e.g. wanted to close #ISSUE2 but wrote that it closes #ISSUE1 and then they edit it to the correct issue). This isn't automatically handled by Linear when the related Linear issue's identifier is removed from the body of the PR.

### How to use?

```yml
- uses: FuelLabs/github-actions/linear/link-pr-to-linear-issue@master
  with:
    repository: ${{ github.repository }} # You can omit it 
    pull_number: ${{ github.event.pull_request.number }} 
    linear_api_key: ${{ secrets.LINEAR_TOKEN }}
    github_token: ${{ secrets.REPO_TOKEN }}
```

### Inputs

| Name           | Description                                                | Default                    |
| -------------- | ---------------------------------------------------------- | -------------------------- |
| repository     | Github Repository                                          | `${{ github.repository }}` |
| pull_number    | The PR number who's body will be read and updated          |                            |
| linear_api_key | Linear API key to use                                      |                            |
| github_token   | A token with write permissions for updating the PR body    |                            |


## License

The primary license for this repo is `Apache 2.0`, see [`LICENSE`](../LICENSE.md).

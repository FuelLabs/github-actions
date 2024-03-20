### Overview

A github action to update the SDK packages.

### How to use?

```yml
- uses: FuelLabs/github-actions/update-sdk@master
  with:
    repository: ${{ github.repository }} # You can omit it 
    changeset: true # You can omit it if your repository doesn't use changesets
    branch: master # In case you want to use a different head branch (default: main)
    npm-tag: ${{ matrix.tag }} # You might use "latest" or anything else, like a matrix strategy
    # Remember they need to have the same tag name, otherwise it'll fail
    packages: |
      @fuels
      @fuels/react
      @fuels/connectors
      # Other way to use it
      # fuels,@fuels/react,@fuels/connectors
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Inputs

| Name         | Description                                                | Default                    |
| ------------ | ---------------------------------------------------------- | -------------------------- |
| repository   | Github Repository                                          | `${{ github.repository }}` |
| changeset    | If your repository uses changesets, set this to true       | `false`                    |
| branch       | The branch that will be used to create the PR              | `main`                     |
| packages     | Packages to update (multiline input or comma separated)    | ''                         |
| npm-tag      | NPM tag (e.g. latest or next)                              | `latest`                   |

### Outputs

No outputs defined

## License

The primary license for this repo is `Apache 2.0`, see [`LICENSE`](../LICENSE.md).

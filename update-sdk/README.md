### Overview

A github action to update the SDK packages.

### How to use?

```yml
- uses: FuelLabs/github-actions/update-sdk@master
  with:
    branch: master # In case you want to use a different head branch
    packages: |
      @fuels
      @fuels/react
      @fuels/connectors
    npm-tag: ${{ matrix.tag }} # You might use "latest" or anything else, like a matrix strategy
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Inputs

| Name         | Description                                                |
| ------------ | ---------------------------------------------------------- |
| npm-tag      | NPM tag (e.g. latest or next)                              |

### Outputs

No outputs defined

## License

The primary license for this repo is `Apache 2.0`, see [`LICENSE`](../LICENSE.md).

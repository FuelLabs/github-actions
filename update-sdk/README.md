### Overview

A github action to update the SDK packages.

### How to use?

```yml
- uses: FuelLabs/github-actions/update-sdk@master
  with:
    npm-tag: ${{ matrix.tag }} # Or anything else
  env:
    GH_TOKEN: ${{ secrets.REPO_TOKEN }}
```

### Inputs

| Name         | Description                                                |
| ------------ | ---------------------------------------------------------- |
| npm-tag      | NPM tag (e.g. latest or next)                              |

### Outputs

No outputs defined

## License

The primary license for this repo is `Apache 2.0`, see [`LICENSE`](../LICENSE.md).

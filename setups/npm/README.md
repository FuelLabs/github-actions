### Setup node

A github action to setup npm with credentials to publish packages to npm.

### How to use?

```yml
- uses: FuelLabs/github-actions/setups/npm
  with:
    npm-token: ${{ secrets.NPM_TOKEN }}
```

### Inputs

| Name      | Description              |
| --------- | ------------------------ |
| npm-token | NPM authentication token |

### Outputs

No outputs defined

## License

The primary license for this repo is `Apache 2.0`, see [`LICENSE`](../../LICENSE.md).

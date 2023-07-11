### Setup node

A github action to setup Node.js and PNPM

### How to use?

```yml
- uses: FuelLabs/github-actions/setups/node
  with:
    node-version: 18.14.1
    pnpm-version: latest
```

### Inputs

| Name         | Description  |
| ------------ | ------------ |
| node-version | Node version |
| pnpm-version | PNPM version |

### Outputs

No outputs defined

## License

The primary license for this repo is `Apache 2.0`, see [`LICENSE`](../../LICENSE.md).

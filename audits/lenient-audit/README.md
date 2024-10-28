### Audit

A github action that runs audit and does not fails if the reported vulnerabilities have not yet been fixed.

### How to use?

```yml
- uses: FuelLabs/github-actions/audits/lenient-audit
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
### Setup node

A github action to setup Node.js and PNPM

### How to use?

```yml
- uses: FuelLabs/github-actions/changeset
  with:
    build: "pnpm build"
    publish: "pnpm changeset:publish"
    release-type: "aggregate"
    version: "1.0.0"
    github-token: ${{ secrets.GITHUB_TOKEN }}
    github-actor: ${{ github.actor }}
    npm-token: ${{ secrets.NPM_TOKEN }}
```

### Inputs

| Name         | Description                                                |
| ------------ | ---------------------------------------------------------- |
| build        | build command for packages                                 |
| publish      | publish command for changeset                              |
| release-type | changeset release type                                     |
| version      | packages single version if use `release-type: "aggregate"` |
| github-token | github token to create changeset PR                        |
| github-actor | github user to create changeset PR                         |
| npm-token    | npm secret token to publish the packages                   |

### Outputs

No outputs defined

## License

The primary license for this repo is `Apache 2.0`, see [`LICENSE`](../LICENSE.md).

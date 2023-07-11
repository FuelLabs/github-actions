### Setup node

A github action to setup Docker

### How to use?

```yml
- uses: FuelLabs/github-actions/setups/docker
  with:
    username: ${{ github.repository_owner }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

### Inputs

| Name            | Description                  |
| --------------- | ---------------------------- |
| username        | Username for https://ghcr.io |
| password        | Password for https://ghcr.io |
| compose-version | Docker Dompose version       |

### Outputs

No outputs defined

## License

The primary license for this repo is `Apache 2.0`, see [`LICENSE`](../../LICENSE.md).

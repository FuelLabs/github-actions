# GitHub Actions

Repository for Fuel’s reusable **workflows** and **composite** actions (public).

## OCI, Docker, Helm, Slack (composites + `workflow_call`)

| Location | Description |
| -------- | ----------- |
| [`.github/README.md`](.github/README.md) | **Docker/Helm/Slack** — `docker-build-push`, `helm-publish-oci`, `slack-notify-failure`, and callable `docker-build-push` / `helm-publish-oci` workflows (ECR OIDC, Buildx/QEMU, Warp, OCI). |

**Legacy / separate:** [`.github/workflows/publish-docker-image.yml`](.github/workflows/publish-docker-image.yml) wraps the same path as `docker-build-push` (GHCR + legacy `GITHUB_CONTAINER_*` / `images` / `docker_file` inputs) and [`.github/workflows/notify-slack-action.yml`](.github/workflows/notify-slack-action.yml) (Slack reusable on failure). New work should use [`docker-build-push.yml`](.github/workflows/docker-build-push.yml) and the composites in [`.github/README.md`](.github/README.md) unless you must keep an old `uses:` pin.

## Other groups

| Group                             | Description                                                      |
| --------------------------------- | ---------------------------------------------------------------- |
| [audit](./audits/)                | Reusable workflows for auditing npm packages                     |
| [changeset](./changeset/)         | Reusable workflow for create changesets and release npm packages |
| [gh-projects](./gh-projects/)     | Automating interactions between GH Projects and repositories     |
| [setups/node](./setups/node/)     | Setup node and pnpm requirements on CI                           |
| [setups/docker](./setups/docker/) | Setup docker and docker compose on CI                            |
| [setups/npm](./setups/npm/)       | Setup npm deployment requirements on CI                          |
| [update-sdk](./update-sdk/)       | Reusable workflow for update the SDK packages                    |

## License

The primary license for this repo is `Apache 2.0`, see [`LICENSE`](./LICENSE.md).

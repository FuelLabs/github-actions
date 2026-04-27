# Reusable OCI & Docker composites (`FuelLabs/github-actions`)

**Public** repository. Anyone may **`uses:`** the composites and `workflow_call` workflows. Fuel teams typically pin a **semver ref**; internal policies are **your org’s** (approvals, private registries, etc.).

This file documents the **OCI / Docker / Helm** composites and their callable workflow wrappers. **[`publish-docker-image.yml`](.github/workflows/publish-docker-image.yml)** is a **legacy** contract (GHCR `GITHUB_CONTAINER_*` secrets, `images` / `docker_file` input names) that **forwards to** [`docker-build-push.yml`](.github/workflows/docker-build-push.yml) in this repo. Prefer **`docker-build-push`** for new ECR OIDC / multi-arch / Warp; keep **`publish-docker-image`** only for existing `uses:` pins. [notify-slack-action.yml](.github/workflows/notify-slack-action.yml) is a separate **reusable** workflow used on failure (including from **`publish-docker-image`**).

## Artifacts (this “Fuel OCI” set)

| Kind | Path | Purpose |
|------|------|---------|
| Composite | `.github/actions/docker-build-push` | ECR OIDC or registry login; **Buildx** + QEMU, or **Warp** |
| Composite | `.github/actions/helm-publish-oci` | Non-PR Helm **OCI** publish (lint, push) |
| Composite | `.github/actions/slack-notify-failure` | Small Slack failure step (`ravsamhq/notify-slack-action`) |
| Reusable workflow | `.github/workflows/docker-build-push.yml` | Forwards `runs-on`, `platforms`, `build-backend`, `permissions` |
| Reusable workflow | `.github/workflows/helm-publish-oci.yml` | Same for Helm |
| Reusable workflow (legacy) | `.github/workflows/publish-docker-image.yml` | Same implementation as `docker-build-push` (wraps the row above) + old secret/input names + Slack on failure |

**Not in scope for these composites:** PR-only Helm, `helm-cleanup-pr`, preview charts.

## How callable workflows resolve composites

Callers’ jobs check out the **consumer** repository. A reusable workflow in **this** repo must **not** use `./.github/actions/...` — that path would resolve in the **caller**, not here. The workflows set **`env.GITHUB_ACTIONS_REF`** and use:

`FuelLabs/github-actions/.github/actions/<name>@${{ env.GITHUB_ACTIONS_REF }}`

**Releases:** set `GITHUB_ACTIONS_REF` in **both** `docker-build-push.yml` and `helm-publish-oci.yml` to the **same** tag/SHA you publish (e.g. `v1.0.0`); pin consumer `uses: .../docker-build-push.yml@v1.0.0` to match. On the default branch it may be `master` for development.

## Secrets

| Mechanism | In composite? | How to pass |
|-----------|----------------|-------------|
| `secrets.*` in `action.yml` | **No** | `with:` from the caller (`password: ${{ secrets.x }}` — still masked) |
| Reusable workflow | **Yes** | `on.workflow_call.secrets`, caller `secrets: inherit` or explicit map |

`secrets: inherit` on **composite** actions is not supported; use a callable workflow if you want one secrets mapping.

## Examples

**Callable** — Docker (pin replaces `v1.0.0` when you release):

```yaml
jobs:
  image:
    uses: FuelLabs/github-actions/.github/workflows/docker-build-push.yml@v1.0.0
    secrets: inherit
    with:
      runs-on: ubuntu-latest
      auth-mode: registry-login
      dockerfile: Dockerfile
      image: ghcr.io/fuellabs/myapp
```

**Callable** — Helm to GHCR (needs `packages: write` in the **called** job — the workflow already sets it; token must be `GITHUB_TOKEN` or a PAT with package write):

```yaml
jobs:
  chart:
    uses: FuelLabs/github-actions/.github/workflows/helm-publish-oci.yml@v1.0.0
    secrets:
      REGISTRY_USERNAME: ${{ github.actor }}
      REGISTRY_ACCESS_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    with:
      chart-folder: helm/my-chart
      registry-url: oci://ghcr.io/${{ github.repository_owner }}/charts
```

**Composite** (consumer writes full `permissions`):

```yaml
- uses: FuelLabs/github-actions/.github/actions/docker-build-push@v1.0.0
  with:
    auth-mode: ecr-oidc
    aws-role-arn: ${{ secrets.AWS_ROLE_ARN }}
    image: 123.dkr.ecr.us-east-1.amazonaws.com/app
    dockerfile: Dockerfile
```

### `slack-notify-failure` vs `notify-slack-action.yml`

- **`.github/actions/slack-notify-failure`**: **composite** — add as a step, pass `github_token` + `slack_webhook` via `with:`.
- **`.github/workflows/notify-slack-action.yml`**: older **reusable workflow** (checkout, Rust toolchain) — use only if you already depend on it; new work should prefer the **composite** above.

## Pinning

Third-party `uses:` in composites are pinned. Bump in PRs. This repo is **not** the same as **Terraform** tags in `infrastructure-tools` — use **`github-actions`’ own** releases.

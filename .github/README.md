# Reusable OCI & Docker composites (`FuelLabs/github-actions`)

**Public** repository. Anyone may **`uses:`** the composites and `workflow_call` workflows. Fuel teams typically pin a **semver ref**; internal policies are **your org’s** (approvals, private registries, etc.).

This file documents the **OCI / Docker / Helm** composites and their callable workflow wrappers. **[`publish-docker-image.yml`](.github/workflows/publish-docker-image.yml)** is a **legacy** contract (GHCR `GITHUB_CONTAINER_*` secrets, `images` / `docker_file` input names) that **forwards to** [`docker-build-push.yml`](.github/workflows/docker-build-push.yml) in this repo. Prefer **`docker-build-push`** for new ECR OIDC / multi-arch / Warp; keep **`publish-docker-image`** only for existing `uses:` pins. [notify-slack-action.yml](.github/workflows/notify-slack-action.yml) is a separate **reusable** workflow used on failure (including from **`publish-docker-image`**).

## Artifacts (this “Fuel OCI” set)

| Kind | Path | Purpose |
|------|------|---------|
| Composite | `.github/actions/checkout-repo` | Caller checkout with optional private **recursive submodules** (GitHub App) |
| Composite | `.github/actions/docker-build-push` | ECR private/public OIDC or registry login; **Buildx** + QEMU, or **Warp** |
| Composite | `.github/actions/helm-publish-oci` | Non-PR Helm **OCI** publish (lint, push) via registry token or AWS OIDC (ECR) |
| Composite | `.github/actions/slack-notify-failure` | Small Slack failure step (`ravsamhq/notify-slack-action`) |
| Reusable workflow | `.github/workflows/docker-build-push.yml` | Native per-platform runner builds + digest merge (default), or Warp direct push |
| Reusable workflow | `.github/workflows/helm-publish-oci.yml` | Same for Helm |
| Reusable workflow (legacy) | `.github/workflows/publish-docker-image.yml` | Same implementation as `docker-build-push` (wraps the row above) + old secret/input names + Slack on failure |

**Not in scope for these composites:** PR-only Helm, `helm-cleanup-pr`, preview charts.

**Related (same repo, different path style):** [`setups/docker`](../setups/docker/) is a small composite for **GHCR login and compose**; use the table above for **build + push** or **Helm OCI**.

## How callable workflows resolve composites

Callers’ jobs check out the **consumer** repository. A reusable workflow in **this** repo must **not** use `./.github/actions/...` — that path would resolve in the **caller**, not here. Composite steps use a **fully qualified** `uses: FuelLabs/github-actions/.github/actions/<name>@<ref>`, where **`<ref>` is a string literal in the workflow file** (e.g. `@master`). GitHub does **not** allow the `env` context in a step’s `uses:` (runtime error: `Unrecognized named-value: 'env'`). Do not use `...@${{ env.… }}`.

**Releases:** in `docker-build-push.yml` and `helm-publish-oci.yml`, set the `...@<ref>` on the composite to the **same** tag/SHA you are about to publish (e.g. `...@v1.0.0` on the commit you tag). Default branch can keep `...@master` for development. Consumers who pin `uses: .../docker-build-push.yml@v1.0.0` get the workflow and composite at that ref together.

## Secrets

| Mechanism | In composite? | How to pass |
|-----------|----------------|-------------|
| `secrets.*` in `action.yml` | **No** | `with:` from the caller (`password: ${{ secrets.x }}` — still masked) |
| Reusable workflow | **Yes** | `on.workflow_call.secrets`, caller `secrets: inherit` or explicit map |
| `docker-build-push` + `build-backend: warp` | **Optional** | `WARPBUILD_API_KEY` when the job `runs-on` is **not** a WarpBuild runner ([Docker Builders](https://www.warpbuild.com/docs/ci/docker-builders)) |

`secrets: inherit` on **composite** actions is not supported; use a callable workflow if you want one secrets mapping.

## Examples

**Callable** — Docker (pin replaces `v1.0.0` when you release):

```yaml
jobs:
  image:
    uses: FuelLabs/github-actions/.github/workflows/docker-build-push.yml@v1.0.0
    secrets: inherit
    with:
      auth-mode: registry-login
      dockerfile: Dockerfile
      image: ghcr.io/fuellabs/myapp
      build-backend: native
      runs-on-amd64: ubuntu-latest
      runs-on-arm64: ubuntu-24.04-arm
```

**Callable** — Docker with private submodules (`vars.APP_ID` + `secrets.APP_KEY` on the **caller** repo):

```yaml
jobs:
  image:
    uses: FuelLabs/github-actions/.github/workflows/docker-build-push.yml@v1.0.0
    secrets: inherit
    with:
      auth-mode: ecr-oidc
      aws-role-arn: ${{ secrets.AWS_ROLE_ARN }}
      dockerfile: Dockerfile
      image: 123.dkr.ecr.us-east-1.amazonaws.com/myapp-service
      build-backend: native
      checkout-submodules: true
      checkout-app-repositories: |
        fuel-o2
        my-app
        my-submodule-repo
```

**Callable** — Docker to ECR Public (OIDC):

```yaml
jobs:
  image:
    uses: FuelLabs/github-actions/.github/workflows/docker-build-push.yml@v1.0.0
    with:
      auth-mode: ecr-public-oidc
      aws-role-arn: ${{ secrets.AWS_ROLE_ARN }}
      aws-region: us-east-1
      dockerfile: Dockerfile
      image: public.ecr.aws/your-alias/myapp
      build-backend: native
```

**Callable** — Docker via Warp ([Warpbuilds/build-push-action](https://github.com/WarpBuilds/build-push-action) + [Docker Builders](https://www.warpbuild.com/docs/ci/docker-builders); distinct from [cloud runner](https://www.warpbuild.com/docs/ci/cloud-runners) CPU — multi-arch uses per-arch builder VMs; enable both arches on the profile):

```yaml
jobs:
  image:
    uses: FuelLabs/github-actions/.github/workflows/docker-build-push.yml@v1.0.0
    secrets: inherit # add WARPBUILD_API_KEY at org/repo if runs-on is not a WarpBuild runner
    with:
      auth-mode: ecr-oidc
      aws-role-arn: ${{ secrets.AWS_ROLE_ARN }}
      dockerfile: Dockerfile
      image: 123.dkr.ecr.us-east-1.amazonaws.com/myapp
      build-backend: warp
      runs-on: warp-ubuntu-latest-x64-4x
      platforms: linux/amd64,linux/arm64
      profile-name: my-warp-profile
      # Optional: builder ready timeout ms (default 600000)
      # warp-builder-timeout-ms: "900000"
```
**Callable** — Helm to GHCR (`registry-login`; needs `packages: write` in the **called** job — workflow already sets it):

```yaml
jobs:
  chart:
    uses: FuelLabs/github-actions/.github/workflows/helm-publish-oci.yml@v1.0.0
    with:
      auth-mode: registry-login
      chart-folder: helm/my-chart
      registry-url: oci://ghcr.io/${{ github.repository_owner }}/charts
    secrets:
      REGISTRY_USERNAME: ${{ github.actor }}
      REGISTRY_ACCESS_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Callable** — Helm to AWS ECR (`ecr-oidc`):

```yaml
jobs:
  chart:
    uses: FuelLabs/github-actions/.github/workflows/helm-publish-oci.yml@v1.0.0
    with:
      auth-mode: ecr-oidc
      aws-role-arn: ${{ secrets.AWS_ROLE_ARN }}
      aws-region: us-east-1
      chart-folder: helm/my-chart
      registry-url: oci://123456789012.dkr.ecr.us-east-1.amazonaws.com/charts
      # Optional if registry-url includes host (recommended)
      # registry-host: 123456789012.dkr.ecr.us-east-1.amazonaws.com
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

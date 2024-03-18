import c from 'chalk';
import { $ } from 'execa';

export class Github {
  constructor(
    private repository: string
  ) {}

  async getUpdatedPackages() {
    const { stdout } = await $`git status --porcelain=v1`;
    return stdout;
  }

  async createBranch(branchName: string): Promise<boolean> {
    let branchExists = false;
  
    try {
      await $`git show-ref --heads | grep ${branchName}`;
      branchExists = true;
    } catch (e) {
      branchExists = false;
    }

    if (!branchExists) {
      await $`git checkout -b ${branchName}`;
    }

    return branchExists;
  }

  async pushingFromStage(branchName: string, commit: string) {
    await $`git add .`;
    await $`git commit -m ${commit} --no-verify`;
    await $`git push origin ${branchName} --force`;
  }

  async createPullRequest({
    base,
    head,
    title,
    body,
  }: {
    base: string;
    head: string;
    title: string;
    body: string;
  }) {
    console.log(c.white(`📤 Pushing branch ${head}`));
    await $`gh repo set-default ${this.repository}`;
    const { stdout } = await $`gh pr create --base ${base} --head ${head} --title ${title} --body ${body}`;
    console.log(c.green(`✅ PR created: ${stdout}`));
  }

  async setupGitAgent() {
    await $`git config --global user.email "github-actions[bot]@users.noreply.github.com"`;
    await $`git config --global user.name "github-actions[bot]"`;
    await $`git config --global push.autoSetupRemote true`;
  }
}

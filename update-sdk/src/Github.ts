import c from 'chalk';
import { $ } from 'execa';

export class Github {
  constructor(
    private repository: string
  ) {}

  async status() {
    const { stdout } = await $`git status --porcelain=v1`;
    return stdout;
  }

  async checkoutBranch(branchName: string) {
    await $`git fetch`;
    await $`git checkout ${branchName}`;
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

  async getPullRequest({
    base,
    head,
  }: {
    base: string;
    head: string;
  }): Promise<string> {
    console.log(c.white(`📥 Fetching PR from ${head}`));
    await $`gh repo set-default ${this.repository}`;
    const { stdout: list } = await $`gh pr list --state open --base ${base} --head ${head}`;

    const prNumberRegex = /#\d+/;
    const prMatch = list.match(prNumberRegex);
    if (!prMatch) {
      console.log(c.red(`❌ No PR found between ${head} and ${base}`));
      return '';
    }
    
    const prNumber = prMatch[0].substring(1); // Remove '#' from the match
    console.log(c.green(`✅ PR open found: #${prNumber}`));
      
    return `https://github.com/${this.repository}/pull/${prNumber}`;
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
  }): Promise<string> {
    console.log(c.white(`📤 Pushing branch ${head}`));
    await $`gh repo set-default ${this.repository}`;
    const { stdout: pr } = await $`gh pr create --base ${base} --head ${head} --title ${title} --body ${body}`;
    console.log(c.green(`✅ PR created: ${pr}`));

    return pr;
  }

  async setupGitAgent() {
    await $`git config --global user.email "github-actions[bot]@users.noreply.github.com"`;
    await $`git config --global user.name "github-actions[bot]"`;
    await $`git config --global push.autoSetupRemote true`;
  }
}

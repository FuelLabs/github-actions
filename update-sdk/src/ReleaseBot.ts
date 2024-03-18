import c from 'chalk';

import { Github } from './Github';
import { PackageJson } from './PackageJson';

export class ReleaseBot {
  private git!: Github;
  private base: string;
  private version: string;

  constructor(repository: string, base: string, version: string) {
    this.version = version;
    this.base = base;
    this.git = new Github(repository);
  }

  async release() {
    const version = this.version;

    try {
      const head = this._sdkBranchName(version);
      await this.git.setupGitAgent();
      const existingBranch = await this._newReleaseBranch(head);

      await PackageJson.updateDependencies(version);

      const updatedPackages = await this.git.getUpdatedPackages();
      if (!updatedPackages.length) {
        console.log(c.green('✅ No updated packages found'));
        return;
      }

      console.log(c.green('⌛️ List of updated:'));
      for (const updatedPackage of updatedPackages.split('\n')) {
        console.log(c.green(`📦 ${updatedPackage}`));
      }

      await this._commitUpdates(this.base, head, version, existingBranch);
    } catch (e) {
      console.log(c.red(`❌ Error releasing ${version}`));
      console.log(e);
    }
  }

  private async _newReleaseBranch(branchName: string): Promise<boolean> {
    console.log(c.white(`🔀 Creating branch ${branchName}\n`));
    return await this.git.createBranch(branchName);
  }

  private async _commitUpdates(
    base: string,
    head: string,
    version: string,
    existingBranch: boolean
  ) {
    console.log(c.white(`🔀 Committing changes to ${head}\n`));
    const commitMessage = `feat: updating packages to tag ${version}`;

    await this.git.pushingFromStage(head, commitMessage);

    if (!existingBranch) {
      // @TODO: Re-enable it again, it will start to open PRs to master
      // await this.git.createPullRequest({
      //   base,
      //   head,
      //   title: `feat: updating sdk to ${version}`,
      //   body: `✨ This PR updates the SDK to tag ${version}`,
      // });
    }
  }

  private _sdkBranchName(version: string) {
    return `ci/sdk-update/${version}`;
  }
}

import c from 'chalk';

import { Github } from './Github';
import { PackageJson } from './PackageJson';

export class ReleaseBot {
  private git!: Github;
  private baseBranch: string;
  private npmTag: string;
  private packages: string[];

  constructor(repository: string, baseBranch: string, npmTag: string, packages: string[]) {
    this.npmTag = npmTag;
    this.baseBranch = baseBranch;
    this.packages = packages;
    this.git = new Github(repository);
  }

  async release() {
    const npmTag = this.npmTag;

    try {
      await this.git.setupGitAgent();
      await this.git.checkoutBranch(this.baseBranch);
      
      const headBranch = this._sdkBranchName(npmTag);
      const existingBranch = await this._newReleaseBranch(headBranch);

      await PackageJson.updateDependencies(npmTag, this.packages);

      const updatedPackages = await this.git.getUpdatedPackages();
      if (!updatedPackages.length) {
        console.log(c.green('✅ No updated packages found'));
        return;
      }

      console.log(c.green('⌛️ List of updated:'));
      for (const updatedPackage of updatedPackages.split('\n')) {
        console.log(c.green(`📦 ${updatedPackage}`));
      }

      await this._commitUpdates(this.baseBranch, headBranch, npmTag, existingBranch);
    } catch (e) {
      console.log(c.red(`❌ Error releasing ${npmTag}`));
      console.log(e);
    }
  }

  private async _newReleaseBranch(branchName: string): Promise<boolean> {
    console.log(c.white(`🔀 Creating branch ${branchName}\n`));
    return await this.git.createBranch(branchName);
  }

  private async _commitUpdates(
    baseBranch: string,
    headBranch: string,
    npmTag: string,
    existingBranch: boolean
  ) {
    console.log(c.white(`🔀 Committing changes to ${headBranch}\n`));
    const commitMessage = `feat: updating packages to tag ${npmTag}`;

    await this.git.pushingFromStage(headBranch, commitMessage);

    if (!existingBranch) {
      await this.git.createPullRequest({
        base: baseBranch,
        head: headBranch,
        title: `feat: updating sdk to ${npmTag}`,
        body: `✨ This PR updates the SDK to tag ${npmTag}`,
      });
    }
  }

  private _sdkBranchName(npmTag: string) {
    return `ci/sdk-update/${npmTag}`;
  }
}

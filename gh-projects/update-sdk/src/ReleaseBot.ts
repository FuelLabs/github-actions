import c from 'chalk';

import { Github } from './Github';
import { PackageJson } from './PackageJson';

type Version = typeof process.env.NPM_TAG;
export class ReleaseBot {
  private git!: Github;
  private version: Version;

  constructor(owner: string, repo: string, version: Version) {
    this.version = version;
    this.git = new Github(owner, repo);
  }

  async release() {
    const version = this.version;

    try {
      const branchName = this._sdkBranchName(version);
      await this.git.setupGitAgent();
      const existingBranch = await this._newReleaseBranch(branchName);

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

      await this._commitUpdates(branchName, version, existingBranch);
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
    branchName: string,
    version: string,
    existingBranch: boolean
  ) {
    console.log(c.white(`🔀 Committing changes to ${branchName}\n`));
    const commitMessage = `feat: updating packages to tag ${version}`;

    await this.git.pushingFromStage(branchName, commitMessage);

    if (!existingBranch) {
      await this.git.createPullRequest({
        base: 'master',
        head: branchName,
        title: `feat: updating sdk to ${version}`,
        body: `✨ This PR updates the SDK to tag ${version}`,
      });
    }
  }

  private _sdkBranchName(version: string) {
    return `ci/sdk-update/${version}`;
  }
}

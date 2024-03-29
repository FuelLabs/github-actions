import c from 'chalk';

import { Changeset } from './Changeset';
import { Github } from './Github';
import { PackageJson } from './PackageJson';

export class ReleaseBot {
  private git!: Github;
  private npmTag: string;
  private changeset: boolean;
  private baseBranch: string;
  private packages: string[];

  constructor(repository: string, changeset: boolean, baseBranch: string, npmTag: string, packages: string[]) {
    this.npmTag = npmTag;
    this.changeset = changeset;
    this.baseBranch = baseBranch;
    this.packages = packages;
    this.git = new Github(repository);
  }

  async release() {
    const npmTag = this.npmTag;

    await this.git.setupGitAgent();
    await this.git.checkoutBranch(this.baseBranch);
    
    const headBranch = this._sdkBranchName(npmTag);
    await this._newReleaseBranch(headBranch);

    await PackageJson.updateDependencies(npmTag, this.packages);

    const gitStatus = await this.git.status();
    const updatedPackages = PackageJson.getUpdatedPackages(gitStatus);

    if (!updatedPackages.length) {
      console.log(c.green('✅ No updated packages found'));
      return {
        hasUpdates: false,
        branch: '',
        pr: '',
      };
    }

    console.log(c.green('⌛️ List of updated:'));
    for (const updatedPackage of updatedPackages) {
      console.log(c.green(`📦 ${updatedPackage}`));
    }

    if (this.changeset) {
      await Changeset.addChangeset(npmTag);
    }
    const pr = await this._commitUpdates(this.baseBranch, headBranch, npmTag);

    return {
      hasUpdates: true,
      branch: headBranch,
      pr,
    }
  }

  private async _newReleaseBranch(branchName: string) {
    console.log(c.white(`🔀 Creating branch ${branchName}\n`));
    await this.git.createBranch(branchName);
  }

  private async _commitUpdates(
    baseBranch: string,
    headBranch: string,
    npmTag: string
  ): Promise<string> {
    console.log(c.white(`🔀 Committing changes to ${headBranch}\n`));
    const commitMessage = `feat: updating packages to tag ${npmTag}`;
    await this.git.pushingFromStage(headBranch, commitMessage);
    
    const existingPr = await this.git.getPullRequest({
      base: baseBranch,
      head: headBranch,
    });
    
    if (existingPr) {
      console.log(c.white('⏩ Skipping PR creation\n')); 
      return existingPr;  
    }

    return await this.git.createPullRequest({
      base: baseBranch,
      head: headBranch,
      title: `feat: updating sdk to ${npmTag}`,
      body: `✨ This PR updates the SDK to tag ${npmTag}`,
    });
  }

  private _sdkBranchName(npmTag: string) {
    return `ci/sdk-update/${npmTag}`;
  }
}

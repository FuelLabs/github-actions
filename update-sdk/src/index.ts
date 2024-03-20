import { ReleaseBot } from './ReleaseBot';
import * as core from '@actions/core';

async function main() {
  const repository = core.getInput('repository');
  const changeset = core.getInput('changeset') === 'true';
  const branch = core.getInput('branch');
  const npmTag = core.getInput('npm-tag');

  const inlinePackages = core.getInput('packages');
  const isMultiline = inlinePackages.includes('\n');
  const packages = isMultiline ? core.getMultilineInput('packages') : inlinePackages.split(',');

  const bot = new ReleaseBot(repository, changeset, branch, npmTag, packages);

  try {
    const { hasUpdates, branch, pr } = await bot.release();
    core.setOutput('has-updates', hasUpdates);
    core.setOutput('branch', branch);
    core.setOutput('pr', pr);
  } catch (e) {
    core.setFailed((e as Error).message);
  }
}

main();

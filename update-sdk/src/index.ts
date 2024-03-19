import { ReleaseBot } from './ReleaseBot';
import * as core from '@actions/core';

async function main() {
  const repository = core.getInput('repository');
  const branch = core.getInput('branch');
  const npmTag = core.getInput('npm-tag');

  const inlinePackages = core.getInput('packages');
  const isMultiline = inlinePackages.includes('\n');
  const packages = isMultiline ? core.getMultilineInput('packages') : inlinePackages.split(',');

  const bot = new ReleaseBot(repository, branch, npmTag, packages);
  await bot.release();
}

main();

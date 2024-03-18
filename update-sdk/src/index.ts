import { ReleaseBot } from './ReleaseBot';
import * as core from '@actions/core';

async function main() {
  const repository = core.getInput('repository');
  const branch = core.getInput('branch');
  const npmTag = core.getInput('npm-tag');
  const packages = core.getMultilineInput('packages');

  const bot = new ReleaseBot(repository, branch, npmTag, packages);
  await bot.release();
}

main();

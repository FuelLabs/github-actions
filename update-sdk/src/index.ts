import { ReleaseBot } from './ReleaseBot';
import * as core from '@actions/core';

async function main() {
  const organization = core.getInput('organization');
  const repository = core.getInput('repository');
  const npmTag = core.getInput('npm-tag');

  const bot = new ReleaseBot(organization, repository, npmTag);
  await bot.release();
}

main();

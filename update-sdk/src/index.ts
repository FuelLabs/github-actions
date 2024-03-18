import { ReleaseBot } from './ReleaseBot';
import * as core from '@actions/core';

async function main() {
  const repository = core.getInput('repository');
  const npmTag = core.getInput('npm-tag');

  const bot = new ReleaseBot(repository, 'latest');
  await bot.release();
}

main();

import { ReleaseBot } from './ReleaseBot';

async function main() {
  const bot = new ReleaseBot(
    process.env.GITHUB_ORGANIZATION, 
    process.env.GITHUB_REPOSITORY, 
    process.env.NPM_TAG
  );
  await bot.release();
}

main();

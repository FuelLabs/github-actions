import c from 'chalk';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

export class PackageJson {
  static async updateDependencies(version: string,packages: string[]) {
    const list = packages.map((pkg) => `"${pkg}@${version}"`).join(' ');

    console.log(c.white(`📟 Running pnpm update for packages\n`));
    console.log(c.white(`📟 ${list}...\n\n`));

    await promisify(exec)(
      `pnpm update ${list} --recursive`
    );
  }
}

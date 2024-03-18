import c from 'chalk';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

export class PackageJson {
  static async updateDependencies(tag: string) {
    console.log(c.white(`📟 Running pnpm update with tag ${tag}...\n`));
    await promisify(exec)(
      `pnpm update "@fuels/react@${tag}" "@fuels/connectors@${tag}" "fuels@${tag}" --recursive`
    );
  }
}

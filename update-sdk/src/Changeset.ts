import c from 'chalk';
import { spawn } from 'child_process';

export class Changeset {
  static async addChangeset(npmTag: string) {
    console.log(c.white(`📝 Adding changeset for packages\n`));
    console.log(c.white(`📟 pnpm changeset add\n`));

    console.log('📝 Adding changeset for packages\n');
    console.log('📟 pnpm changeset add\n');

    // Manually fill the changeset interactive CLI
    return new Promise((resolve, reject) => {
      const childProcess = spawn('pnpm', ['changeset', 'add']);
      let hasSelectedPackages = false;
      let hasSkippedMajor = false;
      let hasSkippedMinor = false;
      let hasSkippedSummary = false;

      // Manually fill the changeset interactive CLI
      childProcess.stdout.on('data', (data) => {
        const text = data.toString();
        const changed = text.includes('changed packages');
        if (changed && !hasSelectedPackages) {
          childProcess.stdin.write(' ');
          childProcess.stdin.write('\n');
          hasSelectedPackages = true;
        }

        const major = text.includes('major bump');
        if (major && !hasSkippedMajor) {
          childProcess.stdin.write('\n');
          hasSkippedMajor = true;
        }

        const minor = text.includes('minor bump');
        if (minor && !hasSkippedMinor) {
          childProcess.stdin.write('\n');
          hasSkippedMinor = true;
        }

        const summary = text.includes('summary for this change');
        if (summary && !hasSkippedSummary) {
          childProcess.stdin.write(`ci: update to tag ${npmTag}\n`);
          childProcess.stdin.write('\n');
          hasSkippedSummary = true;
        }

        const finish = text.includes('desired changeset');
        if (finish) {
          childProcess.stdin.write('\n');
        }
      });

      childProcess.on('close', (code) => {
        if (code === 0) {
          resolve(true);
        } else {
          reject(new Error(`Child process exited with code ${code}`));
        }
      });
    });
  }
}

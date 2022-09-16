/* eslint-disable @typescript-eslint/no-floating-promises */
import * as core from '@actions/core';
import { assignProjectAction } from './actions/assignProject';

async function main(): Promise<void> {
  try {
    await assignProjectAction();
  } catch (error: any) {
    core.setFailed((error as Error).message);
  }
}

main();

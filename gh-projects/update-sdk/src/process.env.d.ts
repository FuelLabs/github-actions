declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_TOKEN: string;
      GITHUB_ORGANIZATION: string;
      GITHUB_REPOSITORY: string;
      NPM_TAG: 'next' | 'latest';
    }
  }
}

export {};

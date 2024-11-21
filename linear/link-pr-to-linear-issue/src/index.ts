import * as github from "@actions/github";
import * as core from '@actions/core';
import { LinearClient } from "@linear/sdk";

import { linkPrToLinear } from "./link-pr-to-linear-issue";

const repository = core.getInput('repository', { required: true });
const pull_number = core.getInput('pull_number', { required: true });
const linearApiKey = core.getInput('linear_api_key', { required: true });
const githubToken = core.getInput('github_token', { required: true });

const octokit = github.getOctokit(githubToken);
const linearClient = new LinearClient({ apiKey: linearApiKey });
const pullNumber = parseInt(pull_number!, 10);
const [owner, repo] = repository.split("/");

linkPrToLinear({ pullNumber, owner, repo, octokit, linearClient });
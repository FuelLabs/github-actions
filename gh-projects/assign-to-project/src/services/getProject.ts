import { graphql } from '@octokit/graphql';
import { ProjectV2 } from '@octokit/graphql-schema';
import { headers } from '~/utils';

export async function getProject(organization: string, projectNumber: string | number) {
  const {
    organization: { projectV2: project },
  } = await graphql<{
    organization: {
      projectV2: ProjectV2;
    };
  }>(
    `
      query ($organization: String!, $projectNumber: Int!) {
        organization(login: $organization) {
          projectV2(number: $projectNumber) {
            id
            fields(first: 20) {
              nodes {
                ... on ProjectV2Field {
                  id
                  name
                  dataType
                }
                ... on ProjectV2SingleSelectField {
                  id
                  name
                  dataType
                  options {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    `,
    {
      organization,
      projectNumber: Number(projectNumber),
      headers: headers(),
    }
  );
  return project;
}

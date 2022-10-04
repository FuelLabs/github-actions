import { graphql } from '@octokit/graphql';
import { AddProjectV2ItemByIdPayload } from '@octokit/graphql-schema';
import { headers } from '~/utils';

export async function assignProject(projectId: string, contentId: string) {
  const { addProjectV2ItemById } = await graphql<{
    addProjectV2ItemById: AddProjectV2ItemByIdPayload;
  }>(
    `
      mutation ($projectId: ID!, $contentId: ID!) {
        addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
          item {
            id
          }
        }
      }
    `,
    {
      projectId,
      contentId,
      headers: headers(),
    }
  );
  return addProjectV2ItemById.item!.id;
}

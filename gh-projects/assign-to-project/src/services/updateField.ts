import { graphql } from '@octokit/graphql';
import { ProjectV2 } from '@octokit/graphql-schema';
import { GHInput } from '~/utils';
import { transformQuery } from '~/utils/field';
import { headers } from '~/utils/headers';

export async function updateFields(project: ProjectV2, itemId: string, fields: GHInput) {
  const mountQueryLine = (key: string, index: number) => `
    arg_${index}: updateProjectV2ItemFieldValue(input: {
      projectId: $projectId
      itemId: $itemId
      ${transformQuery(project, key, fields[key])}
    }) {
      projectV2Item {
        id
      }
    }
  `;
  const queryFiels = Object.keys(fields).map(mountQueryLine).join('\n');
  await graphql(
    `
    mutation (
      $projectId: ID!
      $itemId: ID!
    ) {
      ${queryFiels}
    }
  `,
    {
      projectId: project.id,
      itemId,
      headers: headers(),
    }
  );
}

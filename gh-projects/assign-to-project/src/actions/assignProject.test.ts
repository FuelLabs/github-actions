import * as octokitGraphql from '@octokit/graphql';
import { RequestParameters } from '@octokit/graphql/dist-types/types';
import { removeSpaces } from '~/tests/removeSpaces';
import { assignProjectAction } from './assignProject';

const addProjectQuerySpec: [string, RequestParameters] = [
  `
      mutation ($projectId: ID!, $contentId: ID!) {
        addProjectV2ItemById(
          input: { projectId: $projectId, contentId: $contentId }
        ) {
          item {
            id
          }
        }
      }
    `,
  {
    projectId: 'PVT_0000',
    contentId: 'objectId',
    headers: { authorization: 'token my_token_secret' },
  },
];

const updateProjectQuerySpec: [string, RequestParameters] = [
  `
    mutation (
        $projectId: ID!
        $itemId: ID!
    ) {
        arg_0: updateProjectV2ItemFieldValue(input: {
            projectId: $projectId
            itemId: $itemId
            fieldId: "PVTSSF_OOOO"
            value: { singleSelectOptionId: "47fc9ee4" }
        }) {
            projectV2Item {
                id
            }
        }
        arg_1: updateProjectV2ItemFieldValue(input: {
            projectId: $projectId
            itemId: $itemId
            fieldId: "PVTSSF_OOOO"
            value: { number: 1 }
        }) {
            projectV2Item {
                id
            }
        }
        arg_2: updateProjectV2ItemFieldValue(input: {
            projectId: $projectId
            itemId: $itemId
            fieldId: "PVTSSF_OOOO"
            value: { text: "Test Text" }
        }) {
            projectV2Item {
                id
            }
        }
        arg_3: updateProjectV2ItemFieldValue(input: {
            projectId: $projectId
            itemId: $itemId
            fieldId: "PVTSSF_OOOO"
            value: { date: "2022-09-16T20:07:31.954Z" }
        }) {
            projectV2Item {
                id
            }
        }
    }
`,
  {
    projectId: 'PVT_0000',
    itemId: 'TEST_RETURN_ID',
    headers: { authorization: 'token my_token_secret' },
  },
];

describe('Assign project test', () => {
  it('test it', async () => {
    jest
      .spyOn(octokitGraphql, 'graphql')
      .mockImplementation((query: string, options?: RequestParameters) => {
        if (query.includes('addProjectV2ItemById')) {
          // Expect graphql params to be equal spec
          const querySpec = addProjectQuerySpec[0];
          expect([removeSpaces(query), options]).toEqual([
            removeSpaces(querySpec),
            addProjectQuerySpec[1],
          ]);

          // Return mock result
          return {
            addProjectV2ItemById: {
              item: {
                id: 'TEST_RETURN_ID',
              },
            },
          };
        }
        if (query.includes('updateProjectV2ItemFieldValue')) {
          // Expect graphql params to be equal spec
          const querySpec = updateProjectQuerySpec[0];
          expect([removeSpaces(query), options]).toEqual([
            removeSpaces(querySpec),
            updateProjectQuerySpec[1],
          ]);
        }
        return {} as any;
      });

    // Call action
    await assignProjectAction();
  });
});

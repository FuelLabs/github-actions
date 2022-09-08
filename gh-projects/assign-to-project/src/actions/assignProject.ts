import { assignProject, getProject, updateFields } from '../services';
import { fromGHInput } from "../utils";

const ORGANIZATION = process.env.ORGANIZATION!;
const PROJECT_NUMBER = process.env.PROJECT_NUMBER!;
const OBJECT_ID = process.env.OBJECT_ID!;
const PROJECT_FIELDS = process.env.PROJECT_FIELDS;
const PROJECT_VALUES = process.env.PROJECT_VALUES;

async function main () {
  console.log('Fetching project', PROJECT_NUMBER, 'from', ORGANIZATION);
  const project = await getProject(ORGANIZATION, PROJECT_NUMBER);

  console.log('Assign project', project.id, 'to object id', OBJECT_ID);
  const itemId = await assignProject(project.id, OBJECT_ID);

  console.log('Look for fields', itemId);
  const fields = fromGHInput(PROJECT_FIELDS || '',  PROJECT_VALUES || '');

  console.log('Updating fields from item', itemId);
  if (!Object.keys(fields).length) {
    console.log('No fields to update!');
    return;
  } else {
    await updateFields(project, itemId, fields);
  }

  console.log('Done!');
}

main();
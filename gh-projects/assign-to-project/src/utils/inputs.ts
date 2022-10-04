import * as core from '@actions/core';

export interface AssignProjectInput {
  token: string;
  organization: string;
  projectNumber: string;
  objectId: string;
  fields: {
    [key: string]: string;
  };
}

export type GHInput = {
  [key: string]: string;
};

export function fromGHInput(keys: string, values: string): GHInput {
  const fields = keys.split(',');
  const fieldValues = values.split(',');

  return fields.reduce(
    (ret, field, index) => ({
      ...ret,
      [field.trim()]: fieldValues[index].trim(),
    }),
    {}
  );
}

export function getAssignProjectsInput(): AssignProjectInput {
  const organization = core.getInput('organization');
  const projectNumber = core.getInput('project_number');
  const objectId = core.getInput('object_id');
  const fieldsString = core.getInput('fields');
  const valuesString = core.getInput('values');
  const token = core.getInput('token');
  const fields = fromGHInput(fieldsString, valuesString);

  return {
    organization,
    projectNumber,
    objectId,
    fields,
    token,
  };
}

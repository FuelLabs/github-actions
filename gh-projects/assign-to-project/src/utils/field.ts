import {
  ProjectV2,
  ProjectV2Field,
  ProjectV2IterationField,
  ProjectV2SingleSelectField,
} from '@octokit/graphql-schema';

const FieldTypeName: {
  [key: string]: string;
} = {
  SINGLE_SELECT: 'singleSelectOptionId',
  DATE: 'date',
  TEXT: 'text',
  NUMBER: 'number',
};

export function getFieldByName(name: string, project: ProjectV2) {
  const field = (project.fields.nodes || []).find(
    (node) => node?.name.toLowerCase() === name.toLowerCase()
  );

  if (!field) return null;

  return field;
}

export function getValue(
  field: ProjectV2Field | ProjectV2IterationField | ProjectV2SingleSelectField,
  value: string
) {
  switch (field.dataType) {
    case 'SINGLE_SELECT':
      return JSON.stringify(
        (field as ProjectV2SingleSelectField).options.find(
          (option) => option.name.toLowerCase() === value.toLowerCase()
        )?.id
      );
    case 'NUMBER':
      return Number(value);
    case 'TEXT':
      return JSON.stringify(value);
    case 'DATE':
      return JSON.stringify(new Date(value));
    default:
      return value;
  }
}

export function transformQuery(project: ProjectV2, key: string, value: string) {
  const field = getFieldByName(key, project);
  if (!field) return '';
  const fieldName = FieldTypeName[field.dataType];
  if (!fieldName) return '';

  return [`fieldId: "${field.id}"`, `value: { ${fieldName}: ${getValue(field, value)} }`].join(
    '\n'
  );
}

### Assign to Project

A github action to assign a project to one, issue, pull request or other events.

### Setup a GitHub App

This actions requires previous steps, for creating a `app_id` and `private_key`.

Follow the steps 1., 2., 3., 4., 5. from the following GitHub tutorial;
https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/automating-projects-using-actions

### How to use?

```yml
- uses: FuelLabs/github-actions/gh-projects/assign-to-project@master
  with: 
    app_id: ${{ secrets.COMPANY_GITHUB_APP_ID }}
    private_key: ${{ secrets.COMPANY_GITHUB_APP_PEM }}
    organization: FuelLabs
    project_number: 1
    object_id: ${{ github.event.issue.node_id }}
    fields: 'date, text, number, status'
    values: '2022-09-10T00:02:11.820Z, My custom text 2, 4, In Progress'
```

### Inputs

| Name | Description |
|-|-|
| app_id | GitHub App App Id |
| private_key | GitHub APP Private Key |
| default | Github Organization |
| project_number | Github Project number `.../projects/1` |
| object_id | Object id, correspond to the issue or pull request node id |
| fields | List of fields to set when assign |
| values | List of values matching the field order |

### Outputs

No outputs defined

## License

The primary license for this repo is `Apache 2.0`, see [`LICENSE`](../../LICENSE.md).

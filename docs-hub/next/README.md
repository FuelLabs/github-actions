### How to use?

```yml
uses: FuelLabs/github-actions/docs-hub/next
with:
    doc-folder-path: 'docs'
    src-folder-path: 'src'
```

### Inputs

| Name         | Description  |
| ------------ | ------------ |
| doc-folder-path | the folder path where the mdx files live |
| src-folder-path | the src folder where the nav.json and components.json files live |

### Outputs

No outputs defined

### What's included

This workflow:

1. Runs a link check on all links found in markdown files. You can add regex patterns to ignore certain types of links in the [mlc.next.json](../mlc.next.json) config file.
2. Checks for to make sure there are no nested subfolders.
3. Checks to make sure the there is a nav.json file in the src folder with a menu and submenu arays.
4. Checks for a components.json file in the src folder with folders and ignore arrays. The `folders` array should contain all of the paths where MDX components live. The `ignore` array should have all of the components that are handled explicity in the Docs Hub.
6. Checks to make sure the names of components used in MDX files match the file name.
7. Checks to make sure MDX components aren't nested more than twice. For example, `Examples.Events.Connect` & `Examples.Connect` are ok
`Examples.Events.Connect.First` is not ok.

### License

The primary license for this repo is `Apache 2.0`, see [`LICENSE`](../../LICENSE.md).
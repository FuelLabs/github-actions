# Docs Hub

Github workflows to test docs for compatibility with the docs-hub.

The types of doc architectures that are supported in the docs hub are:

1. [MDBooks](#mdbooks)
2. [Next.js & MDX](#next)
3. [Vitepress](#vitepress)

## MDBooks

### How to use?

```yml
uses: FuelLabs/github-actions/docs-hub/mdbook-docs.yml
with:
    docs-src-path: 'docs/book/src'
```

### Inputs

| Name         | Description  |
| ------------ | ------------ |
| docs-src-path | the folder where SUMMARY.md lives |

### Outputs

No outputs defined

### What's included

This workflow:

1. Runs a link check on all links found in markdown files. You can add regex patterns to ignore certain types of links in the [mlc.mdbook.json](mlc.mdbook.json) config file.
2. Runs a lint check on all markdown files except those listed in the [.markdownlintignore](.markdownlintignore) file. It uses the configuration in [.markdownlint.yaml](.markdownlint.yaml).
3. Checks for an index.md file in the docs src folder (and for the sway repo, in the generated forc docs folder). 
4. Checks for to make sure there are no nested subfolders (except for those already accounted for in the generated forc docs).
5. Checks to make sure the folder structure matches the SUMMARY navigation.
6. Checks for unused files missing from the SUMMARY.
7. Checks to see if a navigation order can be successfully generated from the SUMMARY. 

## Next

### How to use?

```yml
uses: FuelLabs/github-actions/docs-hub/next-docs.yml
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

1. Runs a link check on all links found in markdown files. You can add regex patterns to ignore certain types of links in the [mlc.next.json](mlc.next.json) config file.
2. Checks for to make sure there are no nested subfolders.
3. Checks to make sure the there is a nav.json file in the src folder with a menu and submenu arays.
4. Checks for a components.json file in the src folder with folders and ignore arrays. The `folders` array should contain all of the paths where MDX components live. The `ignore` array should have all of the components that are handled explicity in the Docs Hub.
6. Checks to make sure the names of components used in MDX files match the file name.
7. Checks to make sure MDX components aren't nested more than twice. For example, `Examples.Events.Connect` & `Examples.Connect` are ok
`Examples.Events.Connect.First` is not ok.

## Vitepress

Still in progress.

## License

The primary license for this repo is `Apache 2.0`, see [`LICENSE`](../LICENSE.md).
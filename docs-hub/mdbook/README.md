### How to use?

```yml
uses: FuelLabs/github-actions/docs-hub/mdbook
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

1. Runs a link check on all links found in markdown files. You can add regex patterns to ignore certain types of links in the [mlc.mdbook.json](../mlc.mdbook.json) config file.
2. Runs a lint check on all markdown files except those listed in the [.markdownlintignore](../.markdownlintignore) file. It uses the configuration in [.markdownlint.yaml](../.markdownlint.yaml).
3. Checks for an index.md file in the docs src folder (and for the sway repo, in the generated forc docs folder). 
4. Checks for to make sure there are no nested subfolders (except for those already accounted for in the generated forc docs).
5. Checks to make sure the folder structure matches the SUMMARY navigation.
6. Checks for unused files missing from the SUMMARY.
7. Checks to see if a navigation order can be successfully generated from the SUMMARY. 

### License

The primary license for this repo is `Apache 2.0`, see [`LICENSE`](../../LICENSE.md).
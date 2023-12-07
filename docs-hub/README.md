# Docs Hub

Github workflows to test docs for compatibility with the docs-hub.

The types of doc architectures that are supported in the docs hub are:

1. [MDBooks](#mdbooks)
2. [Next.js & MDX](#next)
3. [Vitepress](#vitepress)

## MDBooks

### How to use?

```yml
uses: FuelLabs/github-actions/.github/workflows/mdbook-docs.yml@master
with:
    docs-src-path: 'docs/book/src'
    spellcheck-config-path: 'docs/book/.spellcheck.yml'
    # OPTIONAL
    pre-command: 'cargo run --package versions-replacer'
```

### Inputs

| Name         | Description  |
| ------------ | ------------ |
| docs-src-path | the folder where SUMMARY.md lives |
| spellcheck-config-path | the path for the spellcheck config file |
| pre-command | optional: command to run before other checks |

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
8. Runs a spell check using the configuration file at `spellcheck-config-path`.

## Next

### How to use?

#### Docs

```yml
uses: FuelLabs/github-actions/.github/workflows/next-docs.yml@master
with:
    doc-folder-path: 'docs'
    src-folder-path: 'src'
    spellcheck-config-path: 'docs/.spellcheck.yml'
```

#### Links

```yml
name: Links

on:
    deployment_status

jobs:
    check-links:
        uses: FuelLabs/github-actions/.github/workflows/next-links.yml@master
        with:
          status: ${{ github.event.deployment_status.state }}
          preview-url: ${{ github.event.deployment_status.environment_url }}
    

```

### Inputs

#### Docs

| Name         | Description  |
| ------------ | ------------ |
| doc-folder-path | the folder path where the mdx files live |
| src-folder-path | the src folder where the nav.json and components.json files live |
| spellcheck-config-path | the path for the spellcheck config file |

#### Links

| Name         | Description  |
| ------------ | ------------ |
| status | deployment status, should be 'success' |
| preview-url | PR preview URL |
| folder-path | optional: only check mdx links in this folder |

### Outputs

No outputs defined

### What's included

#### Docs

This workflow:

1. Checks for to make sure there are no nested subfolders.
2. Checks to make sure the there is a nav.json file in the src folder with a menu and submenu arays.
3. Checks for a components.json file in the src folder with folders and ignore arrays. The `folders` array should contain all of the paths where MDX components live. The `ignore` array should have all of the components that are handled explicity in the Docs Hub.
4. Checks to make sure the names of components used in MDX files match the file name.
5. Checks to make sure MDX components aren't nested more than twice. For example, `Examples.Events.Connect` & `Examples.Connect` are ok
`Examples.Events.Connect.First` is not ok.
6. Runs a spell check using the configuration file at `spellcheck-config-path`.

#### Links

This workflow checks all links in mdx files.

## Vitepress

### How to use?

```yml
uses: FuelLabs/github-actions/.github/workflows/vp-docs.yml@master
with:
    doc-folder-path: 'apps/docs/src'
    spellcheck-config-path: 'apps/docs/book/.spellcheck.yml'
```

### Inputs

| Name         | Description  |
| ------------ | ------------ |
| doc-folder-path | the folder path where the markdown files live |
| spellcheck-config-path | the path for the spellcheck config file |

### Outputs

No outputs defined

### What's included

This workflow:

1. Checks for an index.md file in the docs src folder.
2. Checks for to make sure there are no nested subfolders (except for those already accounted for in `api` and `guide` folders).
3. Checks to make sure the file & folder names match what is in the config navigation.
4. Checks for unused files missing from the config.
5. Checks to see if a navigation order can be successfully generated from the config.
6. Runs a spell check using the configuration file at `spellcheck-config-path`.

## Handling Spell Check Errors

The files checked are configured in `.spellcheck.yml`.  This is also where you can configure what types of elements are ignored.

If the spell check test fails:

- look up the word in the question to verify it is a real word and is correctly spelled
- If it is a file name or is code, use backticks to ignore the word.
- If it is a real word that is spelled correctly, or an acronym that is either common or is defined already, add it to `spell-check-custom-words.txt`.
- If needed, rewrite the sentence. Ex: DON'T use  "`lock`ing" and add "ing" to the custom words list. Instead, rewrite the sentence as "locking with the `lock` method".
- If it otherwise should be ignored, you can configure the pipeline in `.spellcheck.yml`.

## License

The primary license for this repo is `Apache 2.0`, see [`LICENSE`](../LICENSE.md).

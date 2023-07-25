import path from "path";
import fs from "fs";
import assert from "assert";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

const DOCS_DIRECTORY = path.join(process.cwd(), `../../${process.argv[2]}`);
const SRC_PATH = path.join(process.cwd(), `../../${process.argv[3]}`);
const COMP_CONFIG_PATH = path.join(SRC_PATH, "components.json");
const NAV_PATH = path.join(SRC_PATH, "nav.json");
const files = fs.readdirSync(DOCS_DIRECTORY);
const subfolders = files.filter((item) =>
  fs.statSync(path.join(DOCS_DIRECTORY, item)).isDirectory()
);

function main(){
  checkForNestedFolders();
  checkNavConfig();
  checkComponentsConfig();
  checkComponentNames();
  checkComponentNesting();
}

main();

function checkForNestedFolders(){
  const nestedSubfolders = subfolders.filter((subfolder) =>
      fs
        .readdirSync(path.join(DOCS_DIRECTORY, subfolder))
        .some((item) =>
          fs.statSync(path.join(DOCS_DIRECTORY, subfolder, item)).isDirectory()
        )
    );
    assert.deepStrictEqual(nestedSubfolders.length, 0, "cannot have nested subfolders");
}

function checkNavConfig(){
  const navFile = fs.readFileSync(NAV_PATH, "utf8");
  const navJSON = JSON.parse(navFile);
  assert(Array.isArray(navJSON.menu), "missing nav menu");
  subfolders.forEach((folder) => {
    const folderName = folder.replaceAll("-", "_");
    assert(Array.isArray(navJSON[folderName]), `missing nav ${folderName} menu`);
  });
}

function checkComponentsConfig(){
  const compFile = fs.readFileSync(COMP_CONFIG_PATH, "utf8");
  const compJSON = JSON.parse(compFile);
  assert(Array.isArray(compJSON.folders), "missing folders array in components.json config");
  assert(Array.isArray(compJSON.ignore), "missing ignore array in components.json config");
}

function checkComponentNames(){
  files.forEach((filename) => {
    const filepath = path.join(DOCS_DIRECTORY, filename);
    if (fs.statSync(filepath).isDirectory()) {
      const subFiles = fs.readdirSync(filepath);
      subFiles.forEach((subFilename) => {
        const subFilepath = path.join(filepath, subFilename);
        checkFile(subFilepath);
      });
    } else {
      checkFile(filepath);
    }
  });
}

// Examples.Events.Connect && Examples.Connect is ok
// Examples.Events.Connect.First is not ok
function checkComponentNesting(){
  let allComponents = [];
  files.forEach((filename) => {
    const filepath = path.join(DOCS_DIRECTORY, filename);
    if (fs.statSync(filepath).isDirectory()) {
      const subFiles = fs.readdirSync(filepath);
      subFiles.forEach((subFilename) => {
        const subFilepath = path.join(filepath, subFilename);
        const file = fs.readFileSync(subFilepath, "utf8");
        const components = getComponents(file);
        allComponents = [...allComponents, ...components];
      });
    } else {
      const file = fs.readFileSync(filepath, "utf8");
      const components = getComponents(file);
      allComponents = [...allComponents, ...components];
    }
    const cleaned = Array.from(new Set(allComponents));
    cleaned.forEach((compName) => {
      const length = compName.split(".").length;
      assert(length < 4, `${compName} has too many nested components`);
    });
  });
}

function checkFile(filepath) {
  const file = fs.readFileSync(filepath, "utf8");
  const components = getComponents(file);
  const compFile = fs.readFileSync(COMP_CONFIG_PATH, "utf8");
  const compJSON = JSON.parse(compFile);
  components.forEach((comp) => {
    if (!compJSON.ignore.includes(comp)) {
      let actualCompPath = "";
      for (let i = 0; i < compJSON.folders.length; i++) {
        const path = `${compJSON.folders[i]}/${
          comp.includes(".") ? comp.split(".").pop() : comp
        }`;
        const actualPath = `${process.cwd()}${path}.tsx`;
        if (fs.existsSync(actualPath)) {
          actualCompPath = `..${path}`;
          break;
        }
      }
      assert.notDeepStrictEqual(actualCompPath, "", `${comp} not found`);
    }
  });
}

function getComponents(mdxContent) {
  const components = [];
  const tree = unified().use(remarkParse).use(remarkMdx).parse(mdxContent);

  visit(tree, "mdxJsxFlowElement", (node) => {
    if (node.name) components.push(node.name);
  });
  return Array.from(new Set(components));
}

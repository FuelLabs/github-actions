import path from "path";
import fs from "fs";
import { EOL } from "os";
import assert from "assert";

const srcFolderPath = path.join(process.cwd(), process.argv[0]);
const subfolders = fs
  .readdirSync(srcFolderPath)
  .filter((item) => fs.statSync(path.join(srcFolderPath, item)).isDirectory());
const summaryFilePath = path.join(srcFolderPath, "SUMMARY.md");
const summaryContent = fs.readFileSync(summaryFilePath, "utf-8");
const splitSummary = summaryContent.split(EOL);

function main() {
  checkForIndexFile();
  checkForNestedFolders();
  checkForNestedSummaryFolders();
  checkForUnusedFiles();
  checkSummaryFile();
}

main();

function checkForIndexFile() {
  const indexPath = path.join(srcFolderPath, "index.md");
  assert(fs.existsSync(indexPath), "missing index.md at root");
}

function checkForNestedFolders() {
  const nestedSubfolders = subfolders.filter((subfolder) =>
    fs
      .readdirSync(path.join(srcFolderPath, subfolder))
      .some((item) =>
        fs.statSync(path.join(srcFolderPath, subfolder, item)).isDirectory()
      )
  );
  assert.deepStrictEqual(nestedSubfolders.length, 0, "cannot have nested subfolders");
}
function checkForNestedSummaryFolders() {
  const nestedSubfolders = splitSummary.filter((line) =>
    line.startsWith("    -")
  );
  assert.deepStrictEqual(nestedSubfolders.length, 0, "cannot nest subfolders in SUMMARY.md");
}

function checkForUnusedFiles() {
  const fileNames = fs.readdirSync(srcFolderPath);
  fileNames.forEach((file) => {
    // check if each file can be found in the SUMMARY
    if (file !== "SUMMARY.md") {
      assert(summaryContent.includes(file), `${file} missing in SUMMARY.md`);
    }
  });
  subfolders.forEach((folder) => {
    const folderPath = path.join(srcFolderPath, folder);
    const subfolderNames = fs.readdirSync(folderPath);
    subfolderNames.forEach((subFile) => {
      assert(summaryContent.includes(subFile), `${subFile} missing in SUMMARY.md`);
    });
  });
}

function checkSummaryFile() {
  const order = processSummary(splitSummary);

  Object.keys(order).forEach((key) => {
    const menuOrder = order[key];
    if (key === "menu") {
      // check if each line in the menu corresponds to
      // an existing top-level file or the name of the folder
      menuOrder.forEach((item) => {
        let itemPath = path.join(srcFolderPath, item);
        if (fs.existsSync(itemPath)) {
          assert(fs.statSync(itemPath).isDirectory(), `${itemPath} folder is missing`);
        } else {
          itemPath = `${itemPath}.md`;
          assert(fs.existsSync(itemPath), `${itemPath} file is missing`);
        }
      });
    } else {
      // check if item exists in the right folder
      const possibleSeparators = ["-", "_"];
      menuOrder.forEach((item) => {
        let fileExists = false;
        for (const separator of possibleSeparators) {
          const newItem = item.replace(/[-_]/g, separator);
          let itemPath = path.join(srcFolderPath, `${key}/${newItem}.md`);
          if (fs.existsSync(itemPath)) {
            fileExists = true;
            break;
          }
        }
        assert(fileExists, `${itemPath} doesn't exist`);
      });
    }
  });
}

function processSummary(lines) {
  const order = { menu: [] };
  let currentCategory;
  lines.forEach((line) => {
    const paths = line.split("/");
    const newPaths = paths[0].split("(");
    const thisCat = currentCategory;
    if (line.includes(".md")) {
      if (line[0] === "-") {
        // handle top-level items
        if (paths.length > 2) {
          currentCategory = paths[paths.length - 2];
        } else if (
          paths[paths.length - 1].includes("index.md") ||
          newPaths[newPaths.length - 1].endsWith(".md)")
        ) {
          currentCategory = newPaths[newPaths.length - 1];
        } else {
          currentCategory = paths[paths.length - 1];
        }
        const final = currentCategory.replace(".md)", "");
        if (thisCat === final) {
          const fileName = paths[paths.length - 1].replace(".md)", "");
          if (!order[currentCategory]) order[currentCategory] = [];
          order[currentCategory].push(fileName);
        } else if (final !== "index") {
          order.menu.push(final);
        }
      } else if (currentCategory) {
        // handle sub-paths
        const fileName = paths[paths.length - 1].replace(".md)", "");
        if (!order[currentCategory]) order[currentCategory] = [];
        if (fileName !== "index") order[currentCategory].push(fileName);
      }
    }
  });
  return order;
}

import path from "path";
import fs from "fs";
import { EOL } from "os";
import assert from "assert";

const srcFolderPath = path.join(process.cwd(), process.argv[2]);
const subfolders = fs
  .readdirSync(srcFolderPath)
  .filter((item) => fs.statSync(path.join(srcFolderPath, item)).isDirectory());
const summaryFilePath = path.join(srcFolderPath, "SUMMARY.md");
const summaryContent = fs.readFileSync(summaryFilePath, "utf-8");
const splitSummary = summaryContent.split(EOL);

const subFolderExceptions = ["forc", "plugins"];
const forcLines = [];

function main() {
  checkForIndexFile(srcFolderPath);
  checkForNestedFolders(subfolders, srcFolderPath);
  checkForNestedSummaryFolders();
  checkForUnusedFiles(srcFolderPath, subfolders);
  const order = processSummary(splitSummary);
  checkOrder(order);

  if (forcLines.length > 0) {
    checkForcDocs();
  }
}

main();

function checkForcDocs() {
  const forcPath = path.join(srcFolderPath, "forc");
  checkForIndexFile(forcPath);

  const forcSubfolders = fs
    .readdirSync(forcPath)
    .filter((item) => fs.statSync(path.join(forcPath, item)).isDirectory());
  checkForNestedFolders(forcSubfolders, forcPath);

  checkForUnusedFiles(forcPath, forcSubfolders);

  const newForcLines = forcLines.map((line) =>
    line.startsWith("-") ? line : line.slice(2, line.length)
  );
  const forcOrder = processSummary(newForcLines, true);
  assert(forcOrder.menu.length > 0, "unable to generate forc menu");
  checkOrder(forcOrder, path.join(srcFolderPath, "forc"));
}

function checkForIndexFile(srcFolderPath) {
  const indexPath = path.join(srcFolderPath, "index.md");
  assert(fs.existsSync(indexPath), "missing index.md at root");
}

function checkForNestedFolders(subfolders, srcFolderPath) {
  const nestedSubfolders = subfolders.filter((subfolder) =>
    fs
      .readdirSync(path.join(srcFolderPath, subfolder))
      .some((item) =>
        fs.statSync(path.join(srcFolderPath, subfolder, item)).isDirectory()
      )
  );
  if (nestedSubfolders.length > 0) {
    assert(process.cwd().includes("/sway"));
    nestedSubfolders.forEach((folder) => {
      assert(
        subFolderExceptions.includes(folder),
        "cannot have nested subfolders"
      );
      if (folder === "plugins") {
        const pluginsPath = path.join(srcFolderPath, folder);
        const pluginSubFolders = fs
          .readdirSync(pluginsPath)
          .filter((item) =>
            fs.statSync(path.join(srcFolderPath, folder, item)).isDirectory()
          );
        assert.deepStrictEqual(pluginSubFolders.length, 1);
        assert.deepStrictEqual(pluginSubFolders[0], "forc_client");
      }
    });
  }
}
function checkForNestedSummaryFolders() {
  const nestedSubfolders = splitSummary.filter((line) =>
    line.startsWith("    -")
  );
  nestedSubfolders.forEach((folder) => {
    let isException = false;
    subFolderExceptions.forEach((exception) => {
      if(folder.includes(exception)){
        isException = true;
      }
    })
    assert(
      isException,
      "cannot nest subfolders in SUMMARY.md"
    );
  });
}

function checkForUnusedFiles(srcFolderPath, subfolders) {
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
    const parentFolder = folderPath.split("/").pop();
    subfolderNames.forEach((subFile) => {
      if(subFile === 'forc_client'){
        const forcClientPath = path.join(folderPath, subFile);
        const forcClientSubfolderNames = fs.readdirSync(forcClientPath);
        forcClientSubfolderNames.forEach((forcClientSubFile) => {
          const actualPath = `${subFile}/${forcClientSubFile}`;
          assert(
            summaryContent.includes(actualPath),
            `${actualPath} missing in SUMMARY.md`
          );
        })
      } else {
        const actualPath = `${parentFolder}/${subFile}`;
        assert(
          summaryContent.includes(actualPath),
          `${actualPath} missing in SUMMARY.md`
        );
      }
      
    });
  });
}

function checkOrder(order, altSrcFolderPath = null) {
  const srcPath = altSrcFolderPath ? altSrcFolderPath : srcFolderPath;
  Object.keys(order).forEach((key) => {
    const menuOrder = order[key];
    if (key === "menu") {
      // check if each line in the menu corresponds to
      // an existing top-level file or the name of the folder
      menuOrder.forEach((item) => {
        let itemPath = path.join(srcPath, item);
        if (fs.existsSync(itemPath)) {
          assert(
            fs.statSync(itemPath).isDirectory(),
            `${itemPath} folder is missing`
          );
        } else {
          if (item === "forc") itemPath = path.join(srcPath, "index");
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
          let newItem = item.replace(/[-_]/g, separator);
          let itemPath = path.join(
            srcPath,
            `${key !== "forc" ? `${key}/` : "/"}${newItem}.md`
          );

          if (fs.existsSync(itemPath)) {
            fileExists = true;
            break;
          } else {
            itemPath = path.join(
              srcPath,
              `${key !== "forc" ? `${key}/` : "/"}${item}.md`
            );
            if (fs.existsSync(itemPath)) {
              fileExists = true;
              break;
            } else {
              itemPath = path.join(
                srcPath,
                `${key !== "forc" ? `${key}/forc_client/` : "/"}${item}.md`
              );
              if (fs.existsSync(itemPath)) {
                fileExists = true;
                break;
              }
            }
          }
        }
        assert(fileExists, `${item} doesn't exist`);
      });
    }
  });
}

function processSummary(lines, isForc = false) {
  const order = { menu: [] };
  let currentCategory;
  lines.forEach((line) => {
    const paths = line.split("/");
    const newPaths = paths[0].split("(");
    const thisCat = currentCategory;
    if (line.includes(".md")) {
      if (!isForc && line.includes("/forc/")) {
        // handle forc docs separately
        forcLines.push(line);
      } else if (line[0] === "-") {
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

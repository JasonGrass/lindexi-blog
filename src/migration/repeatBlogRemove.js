/*
重复博客 markdown 文件删除
重复原因：有相同的 slug
场景：
源文章修改了创建时间，导致生成了一个新的 md 文件，如 2020-10-10-xxx.md，但之前生成了 2020-10-09-xxx.md，
两篇文章是一样的，此时需要删除之前的那个（根据文件的创建时间来判断）
*/

/*
以下代码全部由 AI(Claude-3-Opus) 生成
*/

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

/**
 * @param {string} dirPath - The directory path to scan for markdown files
 */
function uniqueMarkdownFiles(dirPath) {
  const files = getAllMarkdownFiles(dirPath);
  const slugMap = new Map();

  files.forEach(file => {
    const content = fs.readFileSync(file, "utf-8");
    const { data } = matter(content);
    if (data.slug) {
      if (!slugMap.has(data.slug)) {
        slugMap.set(data.slug, []);
      }
      const stats = fs.statSync(file);
      slugMap.get(data.slug).push({ file, ctime: stats.ctime });
    }
  });

  slugMap.forEach(files => {
    if (files.length > 1) {
      files.sort((a, b) => a.ctime - b.ctime);
      // Keep the newest one, remove the rest
      for (let i = 0; i < files.length - 1; i++) {
        fs.unlinkSync(files[i].file);
        console.log(`Deleted: ${files[i].file}`);
      }
    }
  });
}

/**
 * Recursively get all markdown files in a directory
 * @param {string} dirPath - The directory path
 * @returns {string[]} - Array of markdown file paths
 */
function getAllMarkdownFiles(dirPath) {
  let results = [];
  const list = fs.readdirSync(dirPath);
  list.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(filePath));
    } else if (filePath.endsWith(".md")) {
      results.push(filePath);
    }
  });
  return results;
}

module.exports = {
  uniqueMarkdownFiles,
};

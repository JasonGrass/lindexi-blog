const fs = require("fs");
const path = require("path");
const simpleGit = require("simple-git");

const currentDir = process.cwd();

console.log(`work dir: ${currentDir}`);

const sourceDir = path.resolve(
  currentDir,
  "../../lindexi-blog/lindexi.github.io/"
);
const git = simpleGit(sourceDir);

// 定义源目录和目标目录
// const sourceDir = "../../lindexi-blog/lindexi.github.io/";
const targetDir = "./migratedBlogs";
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

/*
TODO 
不发表
*/

async function getPostTitle(filename, content) {
  const titleMatch = content.match(/# (.+)/);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  return filename;
}

async function getCreateTime(filePath, content) {
  const createTimeMatch = content.match(/<!--\s*CreateTime:(.+)\s*-->/);

  if (createTimeMatch) {
    const createTime = new Date(createTimeMatch[1].trim());
    return createTime;
  }

  // 使用 simple-git 获取文件的最后修改时间
  const log = await git.log({ file: filePath, n: 1 });
  const modTime = new Date(log.latest.date);
  return modTime;
}

async function getModifyTime(filePath) {
  const log = await git.log({ file: filePath, n: 1 });
  const modTime = new Date(log.latest.date);
  return modTime;
}

async function getTags(content) {
  const tagsMatch = content.match(/<!--\s*标签[：:](.+)\s*-->/);

  if (!tagsMatch) {
    return null;
  }

  const tags = tagsMatch[1].split(/[,，]/).map(tag => tag.trim());
  if (tags.length < 1) {
    return null;
  }
  return tags;
}

async function getSlug(filename) {
  const slug = filename.replace(/#/g, "").replace(/\s+/g, "-");

  return slug.substring(0, slug.length - 3);
}

async function getIsDraft(content) {
  const match = content.match(/<!--\s*不发布\s*-->/);
  return Boolean(match);
}

async function parseOne(file) {
  if (path.extname(file).toLowerCase() !== ".md") {
    // 只处理 markdown 文件
    return;
  }

  const filePath = path.join(sourceDir, file);
  const content = await fs.readFileSync(filePath, "utf8");

  const title = await getPostTitle(file, content);
  const createTime = await getCreateTime(filePath, content);
  const modTime = await getModifyTime(filePath);
  const tags = await getTags(content);
  const slug = await getSlug(file);
  const isDraft = await getIsDraft(content);

  const year = createTime.getFullYear();
  const formattedCreateTime = createTime
    .toISOString()
    .replace("T", " ")
    .substring(0, 19);
  const formattedModTime = modTime
    .toISOString()
    .replace("T", " ")
    .substring(0, 19);

  const newFileName = `${(createTime.getMonth() + 1).toString().padStart(2, "0")}${createTime.getDate().toString().padStart(2, "0")}-${file}`;
  const newDir = path.join(targetDir, year.toString());
  const newFilePath = path.join(newDir, newFileName);

  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir);
  }

  const headerLines = [];
  headerLines.push("---\n");
  headerLines.push(`title: ${title}\n`);
  headerLines.push(`pubDatetime: ${formattedCreateTime}\n`);
  headerLines.push(`modDatetime: ${formattedModTime}\n`);
  headerLines.push(`slug: ${slug}\n`);
  headerLines.push(`description: ${title}\n`);
  if (tags) {
    headerLines.push(`tags:
${tags.map(tag => `  - ${tag}`).join("\n")}\n`);
  }
  if (isDraft) {
    headerLines.push(`draft: ${isDraft}\n`);
  }
  headerLines.push("---\n");

  let header = headerLines.join("");

  const newContent = `${header}

${content}`;

  fs.writeFileSync(newFilePath, newContent, "utf8");
}

(async () => {
  const files = await fs.readdirSync(sourceDir);

  const test = files[2];
  parseOne(test);

  //   files.forEach(async file => {
  //     parseOne(file);
  //   });
})();

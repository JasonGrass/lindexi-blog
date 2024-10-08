const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");
const simpleGit = require("simple-git");
const imageHandler = require("./imageHandler");
const siteHandler = require("./siteHandler");

const currentDir = process.cwd();

console.log(`work dir: ${currentDir}`);

const sourceDir = path.resolve(currentDir, "../lindexi");
const sourceDir2 = path.resolve(currentDir, "../lindexi.github.io");

const sourceBlogDir = path.resolve(sourceDir, "_posts");

if (!fs.existsSync(sourceBlogDir)) {
  console.error(`source folder not exist. ${sourceDir}`);
  return;
}

if (!fs.existsSync(sourceDir2)) {
  console.error(`source folder not exist. ${sourceDir2}`);
  return;
}

const git = simpleGit(sourceDir);

const targetDir = "./src/content/blog";
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

async function removeDirContents(dirPath) {
  const entries = await fsPromise.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await removeDirContents(fullPath); // 递归删除子目录
      await fsPromise.rmdir(fullPath); // 删除空目录
    } else {
      await fsPromise.unlink(fullPath); // 删除文件
    }
  }
}

async function getBlogHeaderContent(content) {
  const regex = /^---\s*\n\s*([\s\S]*?)\s*\n\s*---/;
  const match = content.match(regex);
  if (match && match[1]) {
    const header = match[1];
    const left = content.replace(regex, "");

    return [header, left];
  }
  return null;
}

async function getBlogTitle(filename, headerContent) {
  let title = "";
  const titleMatch = headerContent.match(/title:(.+)/);
  if (titleMatch) {
    title = titleMatch[1].trim();
  } else {
    title = filename;
  }
  title = title.replace(/\[/g, "【").replace(/\]/g, "]");
  return title;
}

function tryFixDateTime(datetimeStr) {
  // 处理一些意外情况
  // 2018/2/13 17:23:03 2018/2/13 17:23:03 -> 2018/2/13 17:23:03
  const strList = datetimeStr.split(/[\s]/).map(tag => tag.trim());
  return `${strList[0]} ${strList[1]}`;
}

async function getCreateTime(filePath, headerContent) {
  const createTimeMatch = headerContent.match(/CreateTime:(.+)/);

  if (createTimeMatch) {
    const createTime = new Date(tryFixDateTime(createTimeMatch[1].trim()));
    return createTime;
  }

  // 使用 simple-git 获取文件的最后修改时间
  const log = await git.log({ file: filePath, n: 1 });
  const modTime = new Date(log.latest.date);
  return modTime;
}

async function getModifyTime(filePath, headerContent) {
  const modifyTimeMath = headerContent.match(/date:(.+)/);

  if (modifyTimeMath) {
    const createTime = new Date(tryFixDateTime(modifyTimeMath[1].trim()));
    return createTime;
  }

  // 使用 simple-git 获取文件的最后修改时间
  const log = await git.log({ file: filePath, n: 1 });
  const modTime = new Date(log.latest.date);
  return modTime;
}

async function getTags(headerContent) {
  const tagsMatch = headerContent.match(/categories:(.+)/);

  if (!tagsMatch) {
    return null;
  }

  let tags = tagsMatch[1].split(/[,，\s]/).map(tag => tag.trim());
  tags = tags.filter(t => Boolean(t));
  if (tags.length < 1) {
    return null;
  }
  return tags;
}

async function getSlug(filename) {
  const slug = filename.replace(/[#＃]/g, "").replace(/\s+/g, "-");
  return slug.substring(11, slug.length - 3); // 去除前面的日期和后面的 `.md`
}

async function getIsDraft(content) {
  const match = content.match(/<!--\s*不发布\s*-->/);
  return Boolean(match);
}

async function getNewFilename(createTime, filename) {
  // const prefix = `${(createTime.getMonth() + 1).toString().padStart(2, "0")}${createTime.getDate().toString().padStart(2, "0")}`;
  const name = filename.replace(/[Cc][#＃]/g, "csharp").replace(/[#＃]/g, "");
  return name;
}

async function getContent(content) {
  // <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png" /></a><br />本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。欢迎转载、使用、重新发布，但务必保留文章署名[林德熙](http://blog.csdn.net/lindexi_gd)(包含链接:http://blog.csdn.net/lindexi_gd )，不得用于商业目的，基于本文修改后的作品务必以相同的许可发布。如有任何疑问，请与我[联系](mailto:lindexi_gd@163.com)。
  content = content.replace(
    /<a\s*rel="license"\s*.+lindexi_gd@163.com\s*[)）]\s*。\s*/g,
    ""
  );

  content = content.replace(/(!\[.*\]\(.*?)(\s+".*?")(\))/g, "$1$3");

  return content;
}

const slugSet = new Set();

async function parseOne(file) {
  if (path.extname(file).toLowerCase() !== ".md") {
    // 只处理 markdown 文件
    return;
  }

  const filePath = path.join(sourceBlogDir, file);
  let content = await fs.readFileSync(filePath, "utf8");
  const allContent = await getBlogHeaderContent(content);
  const headerContent = allContent[0];
  content = allContent[1];
  content = await getContent(content);

  const title = await getBlogTitle(file, headerContent);
  const createTime = await getCreateTime(filePath, headerContent);
  const modTime = await getModifyTime(filePath, headerContent);
  const tags = await getTags(headerContent);
  let slug = await getSlug(file);
  const isDraft = await getIsDraft(content);

  while (slugSet.has(slug)) {
    slug = `${slug}_`;
  }
  slugSet.add(slug);

  const year = createTime.getFullYear();
  const formattedCreateTime = createTime
    .toISOString()
    .replace("T", " ")
    .substring(0, 19);
  const formattedModTime = modTime
    .toISOString()
    .replace("T", " ")
    .substring(0, 19);

  const newFileName = await getNewFilename(createTime, file);
  const newDir = path.join(targetDir, year.toString());
  const newFilePath = path.join(newDir, newFileName);

  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir);
  }

  content = await imageHandler.processImage(newDir, content);

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
  // 删除全部的博客和图片
  // await removeDirContents(targetDir);

  const files = await fs.readdirSync(sourceBlogDir);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`migrate start ${file}`);
    await parseOne(file);
    console.log(`migrate finish ${file}`);
  }

  await siteHandler.modifyAboutPage(currentDir);

  console.log("=== MIGRATE FINISH ===");

  setTimeout(() => {
    console.log("=== MIGRATE EXIT ===");
    process.exit();
  }, 30000);
})();

const fs = require("fs");
const fsPromise = require("fs").promises;
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
const targetDir = "./src/content/blog";
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

/*
TODO 
图片下载
评论接入
*/

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

async function getPostTitle(filename, content) {
  let title = "";
  const titleMatch = content.match(/# (.+)/);
  if (titleMatch) {
    title = titleMatch[1].trim();
  } else {
    title = filename;
  }
  title = title.replace(/\[/g, "【").replace(/\]/g, "]");
  return title;
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

  let tags = tagsMatch[1].split(/[,，]/).map(tag => tag.trim());
  tags = tags.filter(t => Boolean(t));
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

async function getNewFilename(createTime, filename) {
  const prefix = `${(createTime.getMonth() + 1).toString().padStart(2, "0")}${createTime.getDate().toString().padStart(2, "0")}`;
  const name = filename.replace(/[Cc][#＃]/g, "csharp").replace(/[#＃]/g, "");
  return `${prefix}-${name}`;
}

async function getContent(content) {
  // <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png" /></a><br />本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。欢迎转载、使用、重新发布，但务必保留文章署名[林德熙](http://blog.csdn.net/lindexi_gd)(包含链接:http://blog.csdn.net/lindexi_gd )，不得用于商业目的，基于本文修改后的作品务必以相同的许可发布。如有任何疑问，请与我[联系](mailto:lindexi_gd@163.com)。
  return content.replace(
    /<a\s*rel="license"\s*.+lindexi_gd@163.com\s*[)）]\s*。\s*/g,
    ""
  );
}

const slugSet = new Set();

async function parseOne(file) {
  if (path.extname(file).toLowerCase() !== ".md") {
    // 只处理 markdown 文件
    return;
  }

  const filePath = path.join(sourceDir, file);
  let content = await fs.readFileSync(filePath, "utf8");

  content = await getContent(content);
  const title = await getPostTitle(file, content);
  const createTime = await getCreateTime(filePath, content);
  const modTime = await getModifyTime(filePath);
  const tags = await getTags(content);
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
  await removeDirContents(targetDir);

  const files = await fs.readdirSync(sourceDir);

  files.forEach(async file => {
    await parseOne(file);
    console.log(`migrate ${file}`);
  });
})();

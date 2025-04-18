const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cryptoJS = require("crypto-js");

async function processImage(folder, content) {
  // deleteFilesWithPercentSign(folder);
  return await processMarkdown(folder, content);
}

async function processMarkdown(imageParentFolder, markdown) {
  const imageDtoList = extractImageLinks(markdown);

  if (!imageDtoList) {
    return markdown;
  }

  for (let i = 0; i < imageDtoList.length; i++) {
    const imageDto = imageDtoList[i];

    const url = imageDto.link;
    let fileName = `img-${path.basename(url)}`;
    fileName = ensureImageExtension(fileName);
    fileName = sanitizeFilePath(fileName);
    fileName = truncateFileName(fileName);

    const imageFolder = path.join(imageParentFolder, "images");
    if (!fs.existsSync(imageFolder)) {
      fs.mkdirSync(imageFolder);
    }
    const dest = path.join(imageFolder, fileName);

    if (fs.existsSync(dest)) {
      // 图片已经存在，则不必再下载
      markdown = replaceImageLinks(markdown, url, `images/${fileName}`);
      continue;
    }

    // http https
    if (startsWithHttp(url)) {
      console.log(`downloading ${url}`);
      await downloadImage(url, dest);
      if (fs.existsSync(dest)) {
        markdown = replaceImageLinks(markdown, url, `images/${fileName}`);
      }
    }
    // 本地
    else {
      const found = await copyFromLocal(url, dest);
      if (found) {
        markdown = replaceImageLinks(markdown, url, `images/${fileName}`);
      }
    }
  }

  return markdown;
}

function extractImageLinks(markdown) {
  const regex = /!\[.*\]\((.*)\)/g;
  const regex2 = /!\[.*\]\((.*)\)/;

  let matches = markdown.match(regex);
  if (!matches) {
    return null;
  }

  const imageDtoList = [];
  for (let i = 0; i < matches.length; i++) {
    const matchStr = matches[i];
    const match = matchStr.match(regex2);
    imageDtoList.push({
      imageLine: matchStr,
      link: match[1],
    });
  }

  return imageDtoList;
}

async function downloadImage(url, outputPath) {
  try {
    const response = await axios({
      method: "get",
      url: url,
      responseType: "stream",
      maxRedirects: 5, // 设置最大重定向次数
    });

    // 检查 content-type 是否为图片类型
    const contentType = response.headers["content-type"];
    if (!contentType.startsWith("image/")) {
      throw new Error(`URL did not return an image: ${url}`);
    }

    // 创建写入流，并将响应数据写入文件
    const writer = fs.createWriteStream(outputPath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(`Error downloading image: ${error.message}; ${url}`);
  }
}

async function copyFromLocal(file, dest) {
  const guessFile = path.resolve(__dirname, "../../../lindexi.github.io", file);
  console.log(`find local ${guessFile}`);
  if (fs.existsSync(guessFile)) {
    copyFile(guessFile, dest);
    return true;
  }
}

function copyFile(source, destination) {
  // 确保目录存在
  const dir = path.dirname(destination);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 拷贝文件
  fs.copyFile(source, destination, err => {
    if (err) {
      console.error("Error copying file:", err, source);
    }
  });
}

function replaceImageLinks(markdown, originalUrl, newPath) {
  const regex = new RegExp(`(!\\[[^\\]]*\\]\\()${originalUrl}(\\))`, "g");
  const result = markdown.replace(regex, `$1${newPath}$2`);

  return result;
}

function startsWithHttp(url) {
  const regex = /^http/i;
  return regex.test(url);
}

function ensureImageExtension(fileName) {
  const regex = /\.(gif|png|jpg|jpeg|webp|bmp)$/i;

  if (!regex.test(fileName)) {
    return `${fileName}.png`;
  }

  return fileName;
}

function sanitizeFilePath(filePath) {
  // 定义非法字符的正则表达式
  const illegalCharacters = /[<>:"/\\|?*]/g;

  // 使用 '-' 代替非法字符
  return filePath.replace(illegalCharacters, "-");
}

function truncateFileName(fileName) {
  const maxLength = 60;
  const containsPercentSign = fileName.includes("%");

  if (fileName.length < maxLength && !containsPercentSign) {
    return fileName;
  }

  const md5 = cryptoJS.MD5(fileName).toString();
  const suffix = `modify-${md5}`;

  // 找到最后一个点的位置，用于分割文件名和后缀
  const lastDotIndex = fileName.lastIndexOf(".");

  // 如果没有后缀
  if (lastDotIndex === -1) {
    return fileName.substring(0, maxLength) + "-" + suffix;
  }

  // 分割文件名和后缀
  const name = fileName.substring(0, lastDotIndex);
  const extension = fileName.substring(lastDotIndex);

  if (containsPercentSign) {
    return `img-${suffix}${extension}`;
  }

  // 截断文件名，保留后缀
  const truncatedName = name.substring(0, maxLength);

  // 合并截断后的文件名、日期字符串和后缀
  return `${truncatedName}-${suffix}${extension}`;
}

// 删除文件名中有 % 的文件
function deleteFilesWithPercentSign(dirPath) {
  const imageFolder = path.join(dirPath, "images");

  // 读取目录内容
  fs.readdir(imageFolder, (err, files) => {
    if (err) {
      console.error(`读取目录时出错: ${err}`);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(imageFolder, file);
      let filePath2 = "";
      try {
        filePath2 = path.join(imageFolder, decodeURIComponent(file));
      } catch (decodeErr) {
        console.warn(file);
        console.error(decodeErr);
      }

      // 获取文件信息
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`无法获取文件信息: ${err}`);
          return;
        }

        if (stats.isFile() && file.includes("%")) {
          // 删除包含百分号的文件
          fs.unlink(filePath, err => {
            if (err) {
              console.error(`删除文件时出错: ${err}  ${filePath}`);
            } else {
              console.log(`已删除文件: ${filePath}`);
            }
          });

          // 删除包含百分号的文件
          fs.unlink(filePath2, err => {
            if (err) {
              console.error(`删除文件时出错: ${err}  ${filePath}`);
            } else {
              console.log(`已删除文件: ${filePath2}`);
            }
          });
        }
      });
    });
  });
}

module.exports = {
  processImage,
};

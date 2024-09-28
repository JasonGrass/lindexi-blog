const fs = require("fs");
const path = require("path");

async function modifyAboutPage(rootFolder) {
  console.log("=======================================");
  const aboutPageFile = path.resolve(rootFolder, "src/pages/about.mdx");
  console.log(`aboutPageFile: ${aboutPageFile}`);

  let content = await fs.readFileSync(aboutPageFile, "utf8");

  const timeStr = `站点内容更新时间: ${getCurrentFormattedTime()}`;

  content = content.replace(
    /站点内容更新时间.*\d\d\d\d\/\d\d\/\d\d\s*\d\d:\d\d:\d\d/g,
    timeStr
  );

  fs.writeFileSync(aboutPageFile, content, "utf8");
}

function getCurrentFormattedTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = {
  modifyAboutPage,
};

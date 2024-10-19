# 德熙博客迁移再部署

部署在 vercel 上

<https://lindexi-blog.jgrass.cc/>  
<https://lindexi-blog.vercel.app/>

## 迁移动作

从 <https://github.com/lindexi/lindexi.git>  和 <https://github.com/lindexi/lindexi.github.io.git> 获取博客的原始数据，
使用 js 脚本迁移到使用 astro 搭建的博客目录中，并将图片下载到仓库中进行本地保存（如果能够下载成功）

每天使用 github action 进行自动迁移并在 about.md 中更新最新迁移的执行时间。

迁移脚本见 `src/migration/` 文件夹

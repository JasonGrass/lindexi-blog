---
title: "dotnet 部署 github 的 Action 进行持续集成"
pubDatetime: 2019-12-08 07:07:37
modDatetime: 2024-08-06 12:43:31
slug: dotnet-部署-github-的-Action-进行持续集成
description: "dotnet 部署 github 的 Action 进行持续集成"
tags:
  - Github
  - GithubAction
---




被微软收购的 GitHub 现在十分土豪，提供了免费的服务器给咱构建。刚好微软对 dotnet 的支持是特别好的，毕竟还算半个自家的东西，大概只需要 3 分钟就可以在 github 上通过 Action 部署持续集成，本文以 SourceYard 作为例子告诉大家如何配置

<!--more-->


<!-- CreateTime:2019/12/8 15:07:37 -->



<!-- 标签：Github，GithubAction -->

其实配置非常简单，不需要了解任何语法就可以开始写

进入 github 对应的项目，可以看到 Action 选项

<!-- ![](images/img-dotnet 部署 github 的 Action 进行持续集成0.png) -->

![](images/img-modify-8298607850835a05f5411e15ba7f10cd.png)

这个项目是支持在项目文件夹使用 `dotnet build` 进行编译，因为将 sln 文件放在项目文件夹，同时项目使用 dotnet core 写的

<!-- ![](images/img-dotnet 部署 github 的 Action 进行持续集成1.png) -->

![](images/img-modify-91acb0e21fa3b90f3e28243060dfc817.png)

点击 Action 会自动判断这是一个 dotnet 程序，点击创建 Setup this workflow 就可以

点击之后进入这个页面，这里有个小知识是 github 将会读取 `.github/workflows/*.yml` 进行自动集成，所以只需要将文件放在这个文件夹就可以，文件名只需要后缀是 yml 文件名可以随意写

<!-- ![](images/img-dotnet 部署 github 的 Action 进行持续集成2.png) -->

![](images/img-modify-d3810072632b9d0ffaea190b2e3ff687.png)

此时需要关注的内容很少，甚至这个项目能在 ubuntu 编译的，点击右上角的 start commit 按钮就可以了

<!-- ![](images/img-dotnet 部署 github 的 Action 进行持续集成3.png) -->

![](images/img-modify-557d89a21e25d6b1787ac1193675d98b.png)

此时的持续集成将会在每次 push 触发，刚好现在提交了一个 dotnetcore.yml 文件，就可以在 Action 看到自动编译

<!-- ![](images/img-dotnet 部署 github 的 Action 进行持续集成4.png) -->

![](images/img-modify-4a11ef102a30133a5212badbec064882.png)

大概这样就完成了部署了

等等，就这么简单？没错，就这么简单

但是我想要在 Windows 下编译怎么办？没问题，下面就是更详细的配置了

详细的配置请看官方文档 [Automating your workflow](https://help.github.com/cn/actions/automating-your-workflow-with-github-actions/getting-started-with-github-actions )

利用 GitHub 的 Action 还能做什么？如自动构建推送 NuGet 包等，请看 [dotnet 配置 github 自动打包上传 nuget 文件](https://blog.lindexi.com/post/dotnet-%E9%85%8D%E7%BD%AE-github-%E8%87%AA%E5%8A%A8%E6%89%93%E5%8C%85%E4%B8%8A%E4%BC%A0-nuget-%E6%96%87%E4%BB%B6.html )

另外，构建成功或失败都应该在首页放个图标告诉小伙伴，如何放一个构建图标请看 [Github 添加 Action 编译图标](https://blog.lindexi.com/post/Github-%E6%B7%BB%E5%8A%A0-Action-%E7%BC%96%E8%AF%91%E5%9B%BE%E6%A0%87.html )

更多请看 [适合 .NET 开发者用的 GitHub Actions（时不时更新） - walterlv](https://blog.walterlv.com/post/github-actions-for-dotnet-developers.html )


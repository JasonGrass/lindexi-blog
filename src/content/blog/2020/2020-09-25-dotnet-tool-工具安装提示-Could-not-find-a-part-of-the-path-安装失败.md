---
title: "dotnet tool 工具安装提示 Could not find a part of the path 安装失败"
pubDatetime: 2020-09-25 07:53:30
modDatetime: 2024-05-20 08:22:04
slug: dotnet-tool-工具安装提示-Could-not-find-a-part-of-the-path-安装失败
description: "dotnet tool 工具安装提示 Could not find a part of the path 安装失败"
tags:
  - dotnet
---




我在安装 dotnet tool 工具时发现所有的工具都安装失败，全部都提示 Could not find a part of the path 安装失败。我重新安装了 dotnet SDK 也没有用，更新到了3.1.402 版本也没有修复

<!--more-->


<!-- CreateTime:2020/9/25 15:53:30 -->



我在 GitHub 开源了 dotnetcampus.DotNETBuildSDK 项目，请看 [https://github.com/dotnet-campus/dotnetcampus.DotNETBuildSDK](https://github.com/dotnet-campus/dotnetcampus.DotNETBuildSDK) 

这个开源项目包含了大量构建需要用到的工具

这个开源项目的工具通过 dotnet tool 分发，但是在我的一台服务器发现任何工具都无法安装，提示下面代码

```
工具“dotnetcampus.buildmd5task”因以下原因而未能更新:
未能安装工具包“dotnetcampus.buildmd5task”: Could not find a part of the path 'C:\Users\lindexi\.dotnet\tools\.store\.stage\4byk1d2b.5hi\dotnetcampus.buildmd5task'.
工具“dotnetcampus.buildmd5task”安装失败。此故障可能由以下原因导致:

* 你尝试安装预览版，但未使用 --version 选项来指定该版本。
* 已找到具有此名称的包，但是它不是 .NET Core 工具。
* 无法访问所需的 NuGet 源，这可能是由于 Internet 连接问题导致。
* 工具名称输入错误。

有关更多原因(包括强制包命名)，请访问 https://aka.ms/failure-installing-tool
```

我尝试给了 `C:\Users\lindexi\.dotnet\` 和里面的文件夹全部加了权限，也尝试删除文件夹重新创建，都无法解决此问题

最后发现可以通过在另一台设备上，在这台设备安装好需要的工具，然后将 `.dotnet\tools` 文件夹拷贝过去，这样就能解决问题


---
title: "Github 添加 Action 编译图标"
pubDatetime: 2019-12-27 01:58:36
modDatetime: 2024-05-20 08:22:03
slug: Github-添加-Action-编译图标
description: "Github 添加 Action 编译图标"
tags:
  - git
---




在我的仓库里面，可以在首页添加图标显示当前是否编译通过

<!--more-->


<!-- CreateTime:2019/12/27 9:58:36 -->



在 `README.md` 文件添加下面代码作为图标

```
![](https://github.com/组织或个人/仓库
/workflows/执行Action的Name注意转码/badge.svg)
```

如我在 dotnet-campus 的 dotnetcampus.DotNETBuildSDK 仓库里面的 `.NET Core` 编译任务，可以这样写

```
![](https://github.com/dotnet-campus/dotnetcampus.DotNETBuildSDK
/workflows/.NET%20Core/badge.svg)
```

注意这里的 `.NET Core` 是 Action 对应的 Name 同时需要转码才能用

下面是 Action 配置

```
name: .NET Core

on: [push]

jobs:
  build:

    runs-on: windows-latest

    steps:
    - uses: actions/checkout@v1
 
    - name: Build with dotnet
      run: dotnet build --configuration Release
```

注意 Action 的 Name 不是文件名


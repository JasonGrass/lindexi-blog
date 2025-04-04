---
title: "dotnet 通过 DockerfileContext 解决项目放在里层文件夹导致 VisualStudio 构建失败"
pubDatetime: 2021-12-09 12:26:04
modDatetime: 2024-05-20 08:22:04
slug: dotnet-通过-DockerfileContext-解决项目放在里层文件夹导致-VisualStudio-构建失败
description: "dotnet 通过 DockerfileContext 解决项目放在里层文件夹导致 VisualStudio 构建失败"
tags:
  - VisualStudio
  - dotnet
---




本文告诉大家，如何解决 csproj 项目文件放入到里层的文件夹，不放在 sln 所在文件夹的第一层子文件夹，导致 VisualStudio 2022 在构建 docker 映像提示找不到文件的问题

<!--more-->


<!-- CreateTime:2021/12/9 20:26:04 -->

<!-- 发布 -->

在 VisualStudio 里面，可以右击 docker 文件，进行生成映像。这是默认需要此 csproj 项目文件放入到 sln 所在文件夹的第一层子文件夹里面，而如果有一些定制化的需求，放入到其他的文件夹（依然在 sln 所在的文件夹的子文件夹里面）那就需要设置 DockerfileContext 属性，告诉 Visual Studio 生成时的 Docker 映像时使用的默认上下文

如下面文件结构

```csharp
|
|  Foo.sln
|-----A
      |-----B
            |-----B.csproj
```

此时就需要在 B.csproj 上放一个 DockerfileContext 属性，此属性的作用是生成 Docker 映像时使用的默认上下文，作为相对于 Dockerfile 的路径

```xml
  <PropertyGroup>
    <DockerfileContext>..\..</DockerfileContext>
  </PropertyGroup>
```

通过此属性，才能让生成的路径是从 sln 文件开始，也就是默认生成的值。一个推荐的做法是自己删除 Dockerfile 文件，重新在 VisualStudio 里面右击添加

更多 docker 相关属性，请看 [Visual Studio 容器工具生成属性 - Visual Studio (Windows) Microsoft Docs](https://docs.microsoft.com/zh-cn/visualstudio/containers/container-msbuild-properties?view=vs-2022&WT.mc_id=WD-MVP-5003260 )


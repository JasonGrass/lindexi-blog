---
title: "dotnet core 使用 CoreRT 将程序编译为 Native 程序"
pubDatetime: 2019-11-29 00:31:17
modDatetime: 2024-05-20 08:22:03
slug: dotnet-core-使用-CoreRT-将程序编译为-Native-程序
description: "dotnet core 使用 CoreRT 将程序编译为 Native 程序"
tags:
  - C#
  - dotnet
  - dotnetcore
---




现在微软有一个开源项目 CoreRT 能通过将托管的 .NET Core 编译为单个无依赖的 Native 程序
~~这个项目现在还没发布，但是能尝试使用，可以带来很多的性能提升~~ 现在已经正式发布，合入到 dotnet 主干里，可以简单方便的使用

<!--more-->


<!-- CreateTime:2019/11/29 8:31:17 -->

<!-- 标签：C#,dotnet,dotnetcore -->

本文开始写于 2019.11 当前更新时间是 2024.3.30 截止当前，发布 Native AOT 方式已经合入到 dotnet 主干，只需在 csproj 里面加上 PublishAot 属性，以及确保 Framework 版本在 .NET 7 及以上即可

```xml
<PropertyGroup>
    <PublishAot>true</PublishAot>
</PropertyGroup>
```

详细请参阅：<https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot>

以下为旧内容

---

使用 CoreRT 发布的优点：

1. 只有一个 exe 文件，是绿色没有依赖

1. 发布的文件的大小很小，对比 dotnet core 的独立发布 50M 的大小会小很多

1. 能在大多数的系统运行

1. 提高很多启动性能

不足是软件不是非常稳定，同时只能支持x64的程序


使用这个项目是比较难的，本文下面提供的包的版本，请大家按照我的安装的版本使用，因为新的版本可能有一些修改，同时没有更新文档，如果是第一次使用，可能会遇到很多坑。

首先打开 VisualStudio 2017 安装 C++ 依赖，虽然现在已经有了 VisualStudio 2019 了，但是 C++ 的依赖是需要和 VS 的版本关系，所以这里暂时不能使用 VisualStudio 2019 安装

点击 Nuget 源设置，在 VisualStudio 的工具->选项->nuget包管理器->nuget包源里面添加 myget 的使用，这个网站是微软的 CI 输出的，里面大量的库都是没有发布的，所以微软也无法保证这些库稳定

添加一个新的源，路径是 [https://dotnet.myget.org/F/dotnet-core/api/v3/index.json](https://dotnet.myget.org/F/dotnet-core/api/v3/index.json) 可以通过 `dotnet new nuget` 创建配置文件，在配置文件添加下面代码，这样就可以不在全局添加这个链接

```csharp
<?xml version="1.0" encoding="utf-8"?>
<configuration>
 <packageSources>
    <add key="dotnet-core" value="https://dotnet.myget.org/F/dotnet-core/api/v3/index.json" />
 </packageSources>
</configuration>
``` 

这个黑科技请看 [VisualStudio 给项目添加特殊的 Nuget 的链接](https://blog.lindexi.com/post/VisualStudio-%E7%BB%99%E9%A1%B9%E7%9B%AE%E6%B7%BB%E5%8A%A0%E7%89%B9%E6%AE%8A%E7%9A%84-Nuget-%E7%9A%84%E9%93%BE%E6%8E%A5.html )

通过 VisualStudio 2017 创建一个新的控制台项目，或者通过命令行使用 dotnet 命令行创建一个新的控制台项目



然后在项目里面添加 Microsoft.DotNet.ILCompiler 的引用，这里添加的版本是 `1.0.0-alpha-*` 版本

```csharp
    <ItemGroup>
        <PackageReference Include="Microsoft.DotNet.ILCompiler" Version="1.0.0-alpha-*" />
    </ItemGroup>
```

也就是在 1.0.0 的任意版本都会被添加，我实际使用的是 1.0.0-alpha-27401-01 版本

现在尝试写一个 Hellow 程序，使用命令行发布，注意创建的项目的 dotnet core sdk 版本暂时需要是 2.0 的版本

```csharp
dotnet publish -r win-x64 -c release
```

注意暂时只能发布 x64 的程序，对 x86 暂时没有支持

现在可以发现发布的文件夹里面有 native 文件夹，里面就只包含一个 exe 程序，同时这个文件也非常小

代码请看 <https://github.com/dotnet/corert/tree/master/samples/HelloWorld>

更详细的博客请看 [使用CoreRT将.NET Core发布为Native应用程序 - KAnts - 博客园](https://www.cnblogs.com/ants/p/8630332.html )

[简析 .NET Core 构成体系 - 帅虫哥 - 博客园](http://www.cnblogs.com/vipyoumay/p/5613373.html )


---
title: "dotnet 修复 C# 8.0 语法编译失败"
pubDatetime: 2020-02-01 08:59:41
modDatetime: 2024-05-20 08:22:04
slug: dotnet-修复-C-8.0-语法编译失败
description: "dotnet 修复 C# 8.0 语法编译失败"
tags:
  - dotnet
  - C#
---




在使用 using 等新语法时，在 VisualStudio 2019 会自动判断框架版本，如在 net 45 就不会自动使用最新版本的语法，需要修改项目文件

<!--more-->


<!-- CreateTime:2020/2/1 16:59:41 -->



在使用 C# 8.0 之前，请在[官网](https://visualstudio.microsoft.com/) 下载最新的 VisualStudio 2019 版本

如果在编译时提示

```
“Using 声明”在 C# 7.3 中不可用。请使用 8.0 或更高的语言版本
```

或

```
error CS8370: 功能“可为 null 的引用类型”在 C# 7.3 中不可用。请使用 8.0 或更高的语言版本。
```

解决方法是在 csproj 项目文件里面添加下面代码

```

  <PropertyGroup>
    <LangVersion>preview</LangVersion>
  </PropertyGroup>


```

如果不知道写在哪，请看 csproj 文件

```
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net45</TargetFramework>
    <LangVersion>preview</LangVersion>
  </PropertyGroup>

</Project>

```


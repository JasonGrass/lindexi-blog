---
title: "dotnet 新 sdk style 项目格式的一些命名空间和引用"
pubDatetime: 2020-01-03 07:12:56
modDatetime: 2024-05-20 08:22:04
slug: dotnet-新-sdk-style-项目格式的一些命名空间和引用
description: "dotnet 新 sdk style 项目格式的一些命名空间和引用"
tags:
  - dotnet
---




在使用 sdk style 的 csproj 项目格式，会发现右击引用找不到程序集，此时有一些命名空间没有找到。本文收集一些命名空间所在的引用

<!--more-->


<!-- CreateTime:2020/1/3 15:12:56 -->

<!-- cdsn -->

## System.Net.Http

引用方法

```xml
  <ItemGroup Condition="$(TargetFramework)=='net45'">
    <Reference Include="System.Net.Http"></Reference>
  </ItemGroup>
```

可以修复在新 sdk style 的 csproj 项目格式找不到 `System.Net.Http` 命名空间

包含类有

- System.Net.Http.HttpClient
- System.Net.Http.HttpMethod

## System.Web

引用方法

```xml
  <ItemGroup Condition="$(TargetFramework)=='net45'">
    <Reference Include="System.Web"></Reference>
  </ItemGroup>
```

包含以下命名空间

- System.Web.HttpUtility



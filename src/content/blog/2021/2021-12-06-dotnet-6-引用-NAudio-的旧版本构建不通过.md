---
title: "dotnet 6 引用 NAudio 的旧版本构建不通过"
pubDatetime: 2021-12-06 11:43:07
modDatetime: 2024-05-20 08:22:03
slug: dotnet-6-引用-NAudio-的旧版本构建不通过
description: "dotnet 6 引用 NAudio 的旧版本构建不通过"
tags:
  - dotnet
---




本文告诉大家在使用 NAudio 的旧版本导致构建不通过问题，解决方法是升级到 1.10 或以上版本

<!--more-->


<!-- CreateTime:2021/12/6 19:43:07 -->

<!-- 发布 -->

在更新 dotnet 6 项目时，使用了 NAudio 的旧版本，构建失败，提示 MC1000 如下

```
未知的生成错误“Could not find assembly 'System.Private.CoreLib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e'. Either explicitly load this assembly using a method such as LoadFromAssemblyPath() or use a MetadataAssemblyResolver that returns a valid assembly.”
```

提示的文件如下

```
C:\Program Files\dotnet\sdk\6.0.100\Sdks\Microsoft.NET.Sdk.WindowsDesktop\targets\Microsoft.WinFX.targets
```

解决方法是升级到 1.10 或以上版本


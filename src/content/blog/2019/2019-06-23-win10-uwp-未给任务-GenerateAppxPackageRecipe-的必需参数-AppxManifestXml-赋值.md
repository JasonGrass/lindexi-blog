---
title: "win10 uwp 未给任务 GenerateAppxPackageRecipe 的必需参数 AppxManifestXml 赋值"
pubDatetime: 2019-06-23 02:57:03
modDatetime: 2024-05-20 08:22:05
slug: win10-uwp-未给任务-GenerateAppxPackageRecipe-的必需参数-AppxManifestXml-赋值
description: "win10 uwp 未给任务 GenerateAppxPackageRecipe 的必需参数 AppxManifestXml 赋值"
tags:
  - Win10
  - UWP
---




本文告诉大家如何修复使用Release正常，debug编译正常，手机正常，就是 上传应用商店关联后，release就出现错误 未给任务“GenerateAppxPackageRecipe”的必需参数“AppxManifestXml”赋值

<!--more-->


<!-- CreateTime:2019/6/23 10:57:03 -->

<!-- csdn -->

在点击编译的时候也提示

```csharp
error MSB4131: “CreatePriFilesForPortableLibraries”任务不支持“UnprocessedReswFiles”
```

修复方法是创建一个应用，把原有的所有东西导入


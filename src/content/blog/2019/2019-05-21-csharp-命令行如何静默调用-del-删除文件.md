---
title: "C# 命令行如何静默调用 del 删除文件"
pubDatetime: 2019-05-21 03:32:28
modDatetime: 2024-05-20 08:22:03
slug: C-命令行如何静默调用-del-删除文件
description: "C# 命令行如何静默调用 del 删除文件"
tags:
  - C#
  - 命令行
---




如果在 C# 命令行调用 del 删除文件，很多时候会提示是否需要删除，本文告诉大家如何调用命令行的时候静默删除

<!--more-->


<!-- CreateTime:2019/5/21 11:32:28 -->


<!-- 标签：C#，命令行 -->

在[C# 命令行](https://gist.github.com/lindexi/f2868a0d02f2197fbb62368514ed6f99) 调用 del 删除文件的时候，会提示是否删除，通过在命令行加上 `\Q` 可以静默删除

```csharp
del /F /Q 文件
```

这里的 `/F` 是删除只读文件

[How to skip "are you sure Y/N" when deleting files in batch files - Stack Overflow](https://stackoverflow.com/questions/7160342/how-to-skip-are-you-sure-y-n-when-deleting-files-in-batch-files )


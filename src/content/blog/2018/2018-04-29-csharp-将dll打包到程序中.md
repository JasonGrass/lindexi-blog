---
title: "C＃ 将dll打包到程序中"
pubDatetime: 2018-04-29 01:43:22
modDatetime: 2024-05-20 08:22:03
slug: C-将dll打包到程序中
description: "C＃ 将dll打包到程序中"
tags:
  - C#
---




本文告诉大家如何把 dll 打包到程序中。很多时候的 软件 在运行的时候需要包括很多 dll 或其他的文件，这样的软件在给其他小伙伴，就需要做一个压缩包，或者用安装软件。这样感觉不太好，所以本文告诉大家一个方法，把所有的 dll 放在一个文件，于是把自己的软件给小伙伴就只需要给他一个程序。

<!--more-->


<!-- CreateTime:2018/4/29 9:43:22 -->

<div id="toc"></div>

## ILMerge

首先下载[ ILMerge ](https://www.microsoft.com/en-us/download/details.aspx?id=17630 )

然后安装，感觉安装很简单

假如有 1.exe 和 1.dll 准备把 1.dll 合并到 2.exe 那么可以使用下面代码

```csharp
ilmerge  /target:exe /out:E:\2.exe /log E:\1.exe /log E:\1.dll /targetplatform:v4
```

这里的 target 为目标平台

out 就是输出的文件

log 就是准备合并的dll

执行代码就可以拿到 2.exe 直接把这个文件给小伙伴，他就不需要使用压缩包，直接打开 2.exe 就不会说找不到库。

参见：http://www.cnblogs.com/blqw/p/LoadResourceDll.html

[ILMerge将源DLL合并到目标EXE - HackerVirus - 博客园](http://www.cnblogs.com/Leo_wl/p/7792151.html )


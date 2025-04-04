---
title: "dotnet 读 WPF 源代码笔记 WIC 多媒体图片处理通过 WindowsCodecs.dll 实现功能"
pubDatetime: 2020-12-21 01:04:51
modDatetime: 2024-05-20 08:22:04
slug: dotnet-读-WPF-源代码笔记-WIC-多媒体图片处理通过-WindowsCodecs.dll-实现功能
description: "dotnet 读 WPF 源代码笔记 WIC 多媒体图片处理通过 WindowsCodecs.dll 实现功能"
tags:
  - WPF
  - WPF源代码
---




本文是我在读 WPF 源代码做的笔记

<!--more-->


<!-- CreateTime:2020/12/21 9:04:51 -->


<!-- 标签：WPF，WPF源代码 -->
<!-- 发布 -->

在 WPF 中，作为一个现代化的 UI 框架，自然有很多多媒体相关的事情需要处理，在 WPF 中有特别的一层是 WIC 层，这一层将包揽了大部分的多媒体图片的处理。如咱熟悉的 BitmapEncoder 类，里面就有大量调用到 WIC 的逻辑

那么在 WPF 中说的 WIC 层是什么？通过 [官方文档](https://docs.microsoft.com/en-us/windows/win32/wic/-wic-lh) 可以了解到 WIC 就是 Windows Imaging Component 的缩写，专门用来处理图片相关的逻辑

在用户端的代码逻辑放在 WindowsCodecs.dll 文件里面，这个文件是跟随系统的，由系统带出去的。听到这句话，是不是有很多小伙计觉得这又是坑呢？被系统带出去的，意味着依然还会有一些有趣的系统瞎改这个文件。这也就是在即使使用 dotnet core 版本的 WPF 也许会遇到有多媒体图片渲染失败的一个原因了，当然了我这么久也没有听到有小伙伴和我反馈遇到此问题

在 WPF 里面使用到 WIC 的底层调用的逻辑，可以通过在 `src\Microsoft.DotNet.Wpf\src\Shared\RefAssemblyAttrs.cs` 的 DllImport 代码里面，使用 Resharper 找到 WindowsCodecs 的所有引用，来了解这部分的调用

```csharp
    internal static class DllImport
    {
        internal const string PresentationNative = "PresentationNative" + BuildInfo.WCP_VERSION_SUFFIX + ".dll";
        internal const string PresentationCFFRasterizerNative = "PresentationCFFRasterizerNative" + BuildInfo.WCP_VERSION_SUFFIX + ".dll";
        internal const string MilCore = "wpfgfx" + BuildInfo.WCP_VERSION_SUFFIX + ".dll";

        // DLL's w/o version suffix
        internal const string UIAutomationCore = "UIAutomationCore.dll";
        internal const string Wininet = "Wininet.dll";
        internal const string WindowsCodecs = "WindowsCodecs.dll";
        internal const string WindowsCodecsExt = "WindowsCodecsExt.dll";
        internal const string Mscms = "mscms.dll";
        internal const string PrntvPt = "prntvpt.dll";
        internal const string Ole32 = "ole32.dll";
        internal const string User32 = "user32.dll";
        internal const string NInput = "ninput.dll";
        internal const string ApiSetWinRT = "api-ms-win-core-winrt-l1-1-0.dll";
        internal const string ApiSetWinRTString = "api-ms-win-core-winrt-string-l1-1-0.dll";
    }
```

按照这个逻辑来说，即使 WPF 层啥都不做，随着系统版本的更新，在 WIC 层的性能提升也会让整个 WPF 的多媒体图片渲染和解码的性能有所提升，但是我考古了一会没有发现权威的文档，还请大法们帮忙找找

当前的 WPF 在 [https://github.com/dotnet/wpf](https://github.com/dotnet/wpf) 完全开源，使用友好的 MIT 协议，意味着允许任何人任何组织和企业任意处置，包括使用，复制，修改，合并，发表，分发，再授权，或者销售。在仓库里面包含了完全的构建逻辑，只需要本地的网络足够好（因为需要下载一堆构建工具），即可进行本地构建


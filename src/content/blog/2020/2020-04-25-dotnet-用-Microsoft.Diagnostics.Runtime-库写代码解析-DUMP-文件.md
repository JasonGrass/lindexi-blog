---
title: "dotnet 用 Microsoft.Diagnostics.Runtime 库写代码解析 DUMP 文件"
pubDatetime: 2020-04-25 01:05:05
modDatetime: 2024-05-20 08:22:04
slug: dotnet-用-Microsoft.Diagnostics.Runtime-库写代码解析-DUMP-文件
description: "dotnet 用 Microsoft.Diagnostics.Runtime 库写代码解析 DUMP 文件"
tags:
  - dotnet
  - 调试
  - Diagnostics
  - DUMP
  - C#
---




在分析 DUMP 进行自动化调试的时候，很多时候只能通过 WinDbg 和命令行调用的方式，这样的方式很难做到灵活。同时编写各个命令行的难度也特别高，这在需要对命令行的输出进行不同的分支的判断时候，难度会更大。于是找到了 Microsoft.Diagnostics.Runtime 库，这个库提供了简单的方式，可以在 C# 里面用代码写分析 DUMP 的代码

<!--more-->


<!-- CreateTime:4/25/2020 9:05:05 AM -->
<!-- 标签：dotnet,调试,Diagnostics,DUMP,C# -->




需要先在 NuGet 上添加一个私有的源才能使用这个库，添加私有源的方式请看 [VisualStudio 给项目添加特殊的 Nuget 的链接](https://blog.lindexi.com/post/VisualStudio-%E7%BB%99%E9%A1%B9%E7%9B%AE%E6%B7%BB%E5%8A%A0%E7%89%B9%E6%AE%8A%E7%9A%84-Nuget-%E7%9A%84%E9%93%BE%E6%8E%A5.html )

本文这里就添加了[NuGet.config](https://github.com/lindexi/lindexi_gd/tree/a8dd96d05dd9641fa68e1aa3ed7ab9a4141feea6/BerjearnearheliCallrachurjallhelur/NuGet.config)文件，详细内容请看[github](https://github.com/lindexi/lindexi_gd/tree/a8dd96d05dd9641fa68e1aa3ed7ab9a4141feea6/BerjearnearheliCallrachurjallhelur)代码

```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- This file should be kept in sync across https://www.github.com/dotnet/wpf and dotnet-wpf-int repos. -->
<configuration>
  <packageSources>
    <clear />
    <add key="dotnet-eng" value="https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet-eng/nuget/v3/index.json" />
    <add key="dotnet5" value="https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet5/nuget/v3/index.json" />
    <add key="dotnet5-transport" value="https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet5-transport/nuget/v3/index.json" />
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
    <add key="dotnet-tools" value="https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet-tools/nuget/v3/index.json" />
  </packageSources>
</configuration>
```

右击项目管理 NuGet 然后输入 Microsoft.Diagnostics.Runtime 然后切换到 dotnet-tools 源

找到一个有趣的项目，让他跑起来，然后炸掉他，这样就能拿到一个 DUMP 文件了。当然不炸掉他也可以，在任务管理器右击创建转储文件

假设放在 `f:\lindexi\test\dotnet.exe.52348.dmp` 文件，可以使用下面代码进行分析

```csharp
 using (DataTarget dataTarget = DataTarget.LoadCrashDump(@"f:\lindexi\test\dotnet.exe.52348.dmp"))
```

此时就可以拿到 dataTarget 的 Clr 版本，请看代码

```csharp
               foreach (ClrInfo version in dataTarget.ClrVersions)
                {
                    Console.WriteLine("Found CLR Version: " + version.Version);

                    // This is the data needed to request the dac from the symbol server:
                    ModuleInfo moduleInfo = version.ModuleInfo;

                    Console.WriteLine("Filesize:  {0:X}", moduleInfo.IndexFileSize);
                    Console.WriteLine("Timestamp: {0:X}", moduleInfo.IndexTimeStamp);
                    Console.WriteLine("Dac File:  {0}", moduleInfo.FileName);

                    // If we just happen to have the correct dac file installed on the machine,
                    // the "LocalMatchingDac" property will return its location on disk:
                    string dacLocation = version.LocalMatchingDac;
                    if (!string.IsNullOrEmpty(dacLocation))
                        Console.WriteLine("Local dac location: " + dacLocation);

                    // You may also download the dac from the symbol server, which is covered
                    // in a later section of this tutorial.
                }
```

更多的方法就请小伙伴自己去找找 API 了

本文只是一个简单的入门的博客，告诉大家有这个技术，因为这方向的调试技术需要涉及的技术特别多，也不是本渣能一篇博客能说明白的



本文代码放在[github](https://github.com/lindexi/lindexi_gd/tree/a8dd96d05dd9641fa68e1aa3ed7ab9a4141feea6/BerjearnearheliCallrachurjallhelur)欢迎小伙伴访问


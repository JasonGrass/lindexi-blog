---
title: "dotnet 使用 Crossgen2 对 DLL 进行 ReadyToRun 提升启动性能"
pubDatetime: 2022-05-30 00:42:06
modDatetime: 2024-08-06 12:43:29
slug: dotnet-使用-Crossgen2-对-DLL-进行-ReadyToRun-提升启动性能
description: "dotnet 使用 Crossgen2 对 DLL 进行 ReadyToRun 提升启动性能"
tags:
  - dotnet
---




我对几个应用进行严格的启动性能评估，对比了在 .NET Framework 和 dotnet 6 下的应用启动性能，非常符合预期的可以看到，在用户的设备上，经过了 NGen 之后的 .NET Framework 可以提供非常优越的启动性能，再加上 .NET Framework 本身就是属于系统组件的部分，很少存在冷启动的时候，大部分的 DLL 都在系统里预热。启动性能方面，依然是 .NET Framework 比 dotnet 6 快非常多。而在破坏了 .NET Framework 的运行时框架层的 NGen 之后，可以发现 .NET Framework 的启动性能就比不过 dotnet 6 的启动性能。为了在 dotnet 6 下追平和 .NET Framework 的启动性能差异，引入与 NGen 的同等级的 ReadyToRun 用来提升整体的性能。本文将告诉大家如何在 dotnet 6 的应用里面，使用 Crossgen2 工具，给 DLL 生成 AOT 数据，提升应用启动性能

<!--more-->


<!-- CreateTime:2022/5/30 8:42:06 -->

<!-- 发布 -->

我预计本文是具有时效的，各个概念都在变更，本文是在 2022.05 编写的。如果你阅读本文的时间距离本文编写时间过长，那请小心本文过期的知识误导

开始之前，还请理清一下概念

在 dotnet 里面，这些概念都在变来变去，还没有完全定下来。在聊 dotnet 里面的 AOT 之前，是必须先来做一个辟谣的。第一个谣言是 AOT 意味着性能更高？ 其实不然，采用 AOT 能减少应用启动过程中，从 IL 转换为本机代码的损耗，但通过分层编译(TieredCompilation)技术，这部分的差异不会特别特别大，再加上 dotnet 6 引入 的 QuickJit 技术，还能进一步缩小差距。但即使这么说，启动性能方面，采用 AOT 还是很有优势的，因为启动过程是性能敏感的，再加上大型项目在启动过程中将需要执行大量的代码逻辑，即使 JIT 再快和加上动态 PGO 的辅助下，依然由于需要工作的量太多而在性能上不如采用 AOT 的方式。由于 AOT 是生产静态逻辑，只取平台最小集，而无法和 JIT 一样，根据所运行设备进行动态优化，这就是为什么运行过程中的性能，在 JIT 进入 Tier 2 优化之后的性能要远远超过 AOT 的方式。换句话说，全程都使用 AOT 而不加入任何 JIT 只是提升启动性能，但是降低了运行过程的性能

那如果我启动性能也要，运行过程的性能也要呢？这个就是 ReadyToRun 技术的概念了，在 DLL 的进入调用时，先采用 AOT 技术，将部分逻辑预先跑了 JIT 且将跑了之后的二进制逻辑也记录到 DLL 里面。如此可以实现在首次调用方法时，减少 JIT 的戏份，尽可能使用之前 AOT 的内容，从而提升应用启动性能。而在应用跑起来之后，依然跑的是 JIT 的优化，如此即可兼顾启动性能和运行过程的性能

如何实现 ReadyToRun 这个概念？就需要用到几项技术和工具，其中 Crossgen2 就是进行 ReadyToRun 的工具。通过 Crossgen2 工具，可以对 DLL 进行静态 AOT 编入 DLL 内

但是如此做法也不是没有缺点的，那就是额外编入 DLL 的 AOT 的内容，将会增大 DLL 的体积。而 DLL 体积的增大将会降低启动过程中读取文件的性能，再加上 AOT 和 JIT 过程的切换也是需要判断逻辑，加上了这部分损耗之后，再对比一下 QuickJit 技术，实际上采用 Crossgen2 进行 ReadyToRun 不是对所有的 DLL 都能提升启动性能

为了解决以上问题，在 dotnet 里再引入了 PGO 的概念。启动过程里面调用的方法是有限的，如果可以了解到应用启动过程将会调用哪些方法，只是将这部分方法进行 AOT 那么对 DLL 体积的影响将会小非常多。这就是 PGO 需要解决的问题，通过引入 PGO 这个概念，在应用运行过程里面，了解应用启动过程将会碰到哪些 IL 逻辑，将这部分逻辑记录下来，用于指导 ReadyToRun 过程进行 AOT 哪些方法。从而让 AOT 过程不需要针对所有的 IL 逻辑，而是仅对应用启动过程需要用到的才进行 AOT 过程。如此即可更大的提升应用的启动性能。不过 PGO 可以做的事情可不只是 ReadyToRun 的指导，还可以作为 JIT 过程中，让 JIT 了解可以预先在后台线程里面跑哪些 IL 转换从而达到更高的启动性能。必须说明的是，我询问了几位大佬了解到，当前的 PGO 还是一个玩具，虽然性能评测上可以达到很好的效果，然而还没有具备发布环境使用的能力

对于 AOT 不可反编译的辟谣。如上文可以看到 ReadyToRun 技术上，依然是保留 IL 逻辑，只是在 DLL 里面再加入 AOT 生成的二进制数据，从而减少启动过程的 JIT 的损耗。也就是说如果采用 ReadyToRun 的技术，可以让应用有更快（不一定是更快）的启动性能，同时也拥有原本的运行过程的性能。但是否可以做到不可反编译，自然是做不到的，原本的 IL 代码依然还在，也就是说采用 ReadyToRun 技术，没有任何额外的保护能力。那第二个问题，如果采用纯 AOT 技术，能否达到代码保护能力？嗯，能加一点点。如果配合上混淆的话，感觉上是差不多了。如果要说防破解能力的话，两个的打分，一个是 60 分，一个是 70 分，满分是 100 分。真要别人看不懂，代码写垃圾些就好了，我全力发挥的时候，保证连自己都看不懂

回到主题，如何在 dotnet 里面通过 Crossgen2 工具进行 ReadyToRun 提升应用性能？ 千万别被官方骗了，如果只是在 csproj 上或者是在发布的时候加上 ReadyToRun 的命令参数，恭喜你，是真的用了 Corssgen2 工具。但优化呢？只是优化了入口程序集而已

真的想要有比较大的优化，是需要将除了入口程序集之外的其他程序集也通过 Crossgen2 工具进行 ReadyToRun 才可以有比较大的提升的。例如我的一个大型应用，在启动过程里面将 WPF 框架里面大概十分之一的模块都碰了一次，使用 [JitInfo.GetCompiledMethodCount](https://docs.microsoft.com/en-us/dotnet/api/system.runtime.jitinfo.getcompiledmethodcount?view=net-6.0) 了解到，在第一个窗口 Show 出来之前就有 5 万个方法调用。这个应用的入口程序集占比太小了，如果使用官方的方法，只是对入口程序集进行 ReadyToRun 那么性能上还真被 .NET Framework 完虐

为了让 dotnet 6 应用的启动性能能媲美 .NET Framework 应用的启动性能，可以采用 ReadyToRun 对标 .NET Framework 的 NGen 技术。以下将告诉大家如何使用 Crossgen2 工具对 DLL 进行 ReadyToRun 提升启动性能

默认的 Crossgen2 工具是采用 NuGet 分发的 DotnetPlatform 类型的 NuGet 包，里面包含了独立发布的 Crossgen2 工具。换句话说，可以在 `%localappdata%\..\..\.nuget\packages\microsoft.netcore.app.crossgen2.win-x64` 找到此工具。如果没有找到的话，那试试用一句 `dotnet publish -c Release -r win-x64 -p:PublishReadyToRun=true` 命令让 dotnet 为了构建 ReadyToRun 而帮你将 Crossgen2 下载

以上的 Crossgen2 工具放在 `microsoft.netcore.app.crossgen2.win-x64` 文件夹里面，这里的 `win-x64` 指的不是 Crossgen2 工具的能力，不是说这个文件夹的工具只能构建出 win-x64 的。而是说这个工具本身是 win-x64 的。这个工具是能构建出其他的平台的 AOT 的。换句话说是在 Windows 的 32 位系统里面，将会拉的工具是 `microsoft.netcore.app.crossgen2.win-x86` 的包

进入版本号文件夹，再进入 Tools 文件夹即可找到 `Crossgen2.exe` 可执行文件，这就是工具本文。例如在我的设备上的工具路径是

```
C:\Users\lindexi\.nuget\packages\microsoft.netcore.app.crossgen2.win-x64\6.0.5\tools\Crossgen2.exe
```

接下来将告诉大家如何使用这个工具

这个工具的使用需要传入的参数推荐是一个 rsp 文件，大概的命令行调用如下

```
C:\Users\lindexi\.nuget\packages\microsoft.netcore.app.crossgen2.win-x64\6.0.5\tools\Crossgen2.exe "@C:\lindexi\Fxx\F1.rsp"
```

具体的参数都放在 rsp 文件里面，大概内容如下

```
--targetos:windows
--targetarch:x86
--pdb
-O
-r:"C:\Program Files (x86)\dotnet\shared\Microsoft.NETCore.App\6.0.5\api-ms-win-core-console-l1-1-0.dll"
-r:"C:\Program Files (x86)\dotnet\shared\Microsoft.NETCore.App\6.0.5\api-ms-win-core-console-l1-2-0.dll"
-r:"C:\Program Files (x86)\dotnet\shared\Microsoft.NETCore.App\6.0.5\api-ms-win-core-datetime-l1-1-0.dll"
-r:"C:\Program Files (x86)\dotnet\shared\Microsoft.NETCore.App\6.0.5\api-ms-win-core-debug-l1-1-0.dll"
-r:"C:\Program Files (x86)\dotnet\shared\Microsoft.NETCore.App\6.0.5\api-ms-win-core-errorhandling-l1-1-0.dll"
-r:"C:\Program Files (x86)\dotnet\shared\Microsoft.NETCore.App\6.0.5\api-ms-win-core-fibers-l1-1-0.dll"
-r:"C:\Program Files (x86)\dotnet\shared\Microsoft.NETCore.App\6.0.5\api-ms-win-core-file-l1-1-0.dll"
-r:"C:\Program Files (x86)\dotnet\shared\Microsoft.NETCore.App\6.0.5\api-ms-win-core-file-l1-2-0.dll"
--out:"C:\Users\linde\AppData\Local\Temp\Crossgen2\Crossgen2\KokicakawheeyeeWhemhedawfelawnemhel.dll"
C:\lindexi\Code\empty\KokicakawheeyeeWhemhedawfelawnemhel\KokicakawheeyeeWhemhedawfelawnemhel\bin\release\net6.0-windows\win-x86\publish\KokicakawheeyeeWhemhedawfelawnemhel.dll
```

大概由以下几个部分组成。每一行都是一个独立的参数，分别内容如下

- `--targetos:windows`: 准备执行的系统平台。进行 ReadyToRun 将生成 AOT 代码，这是平台强相关的，必须说明是哪个平台
- `--targetarch:x86`： 准备生成的对应平台，是 x86 还是 x64 等
- `--pdb`: 这是可选的，表示要生成 PDB 符号文件。如不加上这一句将不生成 PDB 文件。生成的 PDB 文件是 `ni.pdb` 文件，配合原本的 DLL 的 PDB 文件即可方便进行调试
- `-O`: 这是可选的，表示需要进行优化。相当于 Release 版本。推荐默认都加上，否则将几乎没有优化效果，或者说只有反向优化效果
- `-r:"xxx.dll"`: 这里将会重复很多行，一行一个程序集文件的本地路径。让工具了解到有哪些引用可以去找到。工具在准备 AOT 过程，需要找到所引用的程序集。这些参数就是告诉工具对应的程序集放在哪。可以多加入很多程序集，因为只是给工具使用的参考引用，工具会根据自己的需求，去找到对应的程序集文件。如果工具发现传入的有多余的，那将会自动忽略多余的。推荐将整个 dotnet runtime 都加入，但是要注意加入的版本必须是和发布的版本是一致的，否则启动过程如果炸了，那就凉凉。如果应用是独立发布的，那就列出应用独立发布文件夹里面的所有 DLL 文件，不需要加上额外的运行时文件夹
- `--out:"xx.dll"`: 处理之后的输出文件路径
- `xxxxx.dll` 输入程序集的路径

构建出 rsp 文件，作为参数，调用 Crossgen2 工具，即可完成对程序集的 ReadyToRun 过程。多个程序集就多次重复以上过程即可

必须画重点的是，调用 Crossgen2 工具进行 ReadyToRun 是不一定能提升启动性能的，这是一个需要测量的过程。每个 DLL 在调用了 Crossgen2 工具进行 ReadyToRun 是会修改文件体积的，整个变更也是会影响启动性能的。推荐在优化应用启动性能，进行足够的测量，方法如下

使用 Crossgen2 工具对每个 DLL 来一次，包括框架层的 DLL 也来一次。然后逐个 DLL 替换，测量应用启动性能。如果发现某些 DLL 进行了 ReadyToRun 反而降低启动性能，或者某些 DLL 加大的文件体积对比启动性能的优化来说不划算，那就不对这些 DLL 进行优化

以下是测试的对 dotnet runtime 底层和 WPF 框架的 DLL 进行 ReadyToRun 优化之后，对 walterlv 大佬的某个应用的启动性能的影响，值得一提的是对于不同的应用，测试的数据将会存在很大的出入，核心原因在于不同的应用启动过程将访问的模块有所不同

![](images/img-modify-e425d52b08326b33f243e00c87c052d3.jpg)

这个数据是没有多少参考价值的，因为对于不同的应用来说，以上的结果将会有变化。如果你想要采用 ReadyToRun 技术提升应用启动性能，还请必须测量每个 DLL 在经过 ReadyToRun 对启动性能的影响。如果你的时间充裕的话，还可以测量对多个 DLL 优化的组合对启动性能的影响

我所在团队的某个大型应用，在经过了 ReadyToRun 技术的优化，启动性能提升百分之三十

但也必须说明的是，不是所有的应用使用 ReadyToRun 都能有优化启动性能，例如我的一个小应用，只要采用了 ReadyToRun 技术，启动性能基本上都是降低了。总的来说，采用 ReadyToRun 技术是需要进行性能测量的

参考文档

[WPF dotnet 使用本机映像 native 优化 dotnet framework 二进制文件](https://blog.lindexi.com/post/WPF-dotnet-%E4%BD%BF%E7%94%A8%E6%9C%AC%E6%9C%BA%E6%98%A0%E5%83%8F-native-%E4%BC%98%E5%8C%96-dotnet-framework-%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%96%87%E4%BB%B6.html )

[WPF 通过 ReadyToRun 提升性能](https://blog.lindexi.com/post/WPF-%E9%80%9A%E8%BF%87-ReadyToRun-%E6%8F%90%E5%8D%87%E6%80%A7%E8%83%BD.html )

[Conversation about crossgen2 - .NET Blog](https://devblogs.microsoft.com/dotnet/conversation-about-crossgen2/)

[runtime/crossgen2-compilation-structure-enhancements.md at main · dotnet/runtime](https://github.com/dotnet/runtime/blob/main/docs/design/features/crossgen2-compilation-structure-enhancements.md)

[runtime/Program.cs at main · dotnet/runtime](https://github.com/dotnet/runtime/blob/main/src/coreclr/tools/aot/crossgen2/Program.cs)

[编译配置设置 - .NET Microsoft Docs](https://docs.microsoft.com/zh-cn/dotnet/core/runtime-config/compilation)

[ReadyToRun deployment overview - .NET Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/core/deploying/ready-to-run#:~:text=There%20are%20two%20ways%20to%20publish%20your%20app,project.%20Publish%20the%20application%20without%20any%20special%20parameters.)

[利用 PGO 提升 .NET 程序性能 - hez2010 - 博客园](https://www.cnblogs.com/hez2010/p/optimize-using-pgo.html)

[JitInfo.GetCompiledMethodCount(Boolean) Method (System.Runtime) Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/api/system.runtime.jitinfo.getcompiledmethodcount?view=net-6.0)


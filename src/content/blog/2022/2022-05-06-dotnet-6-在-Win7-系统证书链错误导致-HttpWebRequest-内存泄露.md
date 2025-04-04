---
title: "dotnet 6 在 Win7 系统证书链错误导致 HttpWebRequest 内存泄露"
pubDatetime: 2022-05-06 12:18:55
modDatetime: 2024-05-20 08:22:03
slug: dotnet-6-在-Win7-系统证书链错误导致-HttpWebRequest-内存泄露
description: "dotnet 6 在 Win7 系统证书链错误导致 HttpWebRequest 内存泄露"
tags:
  - dotnet
---




本文记录我将应用迁移到 dotnet 6 之后，在 Win7 系统上，因为使用 HttpWebRequest 访问一个本地服务，此本地服务开启 https 且证书链在此 Win7 系统上错误，导致应用内存泄露问题。本文记录此问题的原因以及调查过程

<!--more-->


<!-- CreateTime:2022/5/6 20:18:55 -->

<!-- 发布 -->

## 核心原因

核心原因是在 CRYPT32.dll 上的 CertGetCertificateChain 方法存在内存泄露，更底层的原因未知

在 .NET 6 里，更新了 https 访问方法逻辑，详细请看 [Announcing .NET 6 - The Fastest .NET Yet - .NET Blog](https://devblogs.microsoft.com/dotnet/announcing-net-6/ ) 和 [What's new in .NET 6 Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/core/whats-new/dotnet-6 )

核心问题是调用进入 [ChainPal.BuildChain](https://github.com/dotnet/runtime/blob/c12bea880a2f1290d16adf97ec1000aa63631da2/src/libraries/System.Security.Cryptography/src/System/Security/Cryptography/X509Certificates/ChainPal.Windows.BuildChain.cs#L66) 时，将会调用 `Crypt32.CertGetCertificateChain` 方法的调用逻辑有所变更，此进入逻辑和 .NET Framework 4.5 有所不同。准确来说，此差异不是 .NET 6 与 .NET Framework 4.5 的差异，而是 .NET Framework 4.6 以及更高版本与 .NET Framework 4.5 的差异

在 .NET Framework 4.6 时引入 `Switch.System.Net.DontEnableSchUseStrongCrypto` 变更是导致此问题的关键，在 .NET Framework 4.5 下，默认是 true 的值，但是在 .NET Framework 4.6 和更高版本下都是 false 的值。这就导致了整体逻辑的行为差异。此逻辑差异只和 SDK 相关，而和用户端所安装的运行时无关

但是此差异是否一定导致内存泄露，这是未知的。但内存泄露必定走了此调用逻辑

## 解决方法

如 SDK 提示，使用 WebRequest.Create 等方法创建 HttpWebRequest 用来进行网络请求逻辑是一个过时的方法，应该换用 HttpClient 等代替。经过实际的测试，换用 HttpClient 即可完美解决内存泄露问题，顺带提升了不少的性能

也就是说此内存泄露从业务上说是使用了一个过时的 API 导致的问题

## 调查过程

在开始记录调查过程之前，还请看一下背景

如上一篇博客 [记将一个大型客户端应用项目迁移到 dotnet 6 的经验和决策 - lindexi - 博客园](https://www.cnblogs.com/lindexi/p/16226168.html ) 我在完成了迁移了此大型应用到 dotnet 6 发布到内测用户端，有内测小白鼠反馈说第二天过来就看到应用挂掉了

一开始没有认为这是一个问题。等到第二个用户反馈时才开始认为这是一个坑，开始进行调查

以下调试过程非新手友好，请新手一定不要阅读下文，如果阅读了也一定不要在调试内存泄露使用下面的方法

通过分析应用本身的日志，了解到应用是被闪退的。询问内测的用户了解到，应用闪退的时候，都是在晚上挂机的时候，这时候没有任何的用户动作。为了尽可能干掉环境问题带来的干扰，我搭建了虚拟机，使用 `cn_windows_7_ultimate_with_sp1_x64_dvd_u_677408.iso` 安装了纯净的系统，再加上 KB2533623 补丁让 dotnet 6 应用跑起来，最后部署上应用，进行挂机

十分符合预期的，第二天应用挂掉了，而且系统提示 Xx 应用停止工作。通过 系统日志 可以看到存在应用错误异常，异常信息是 CLR Exception E0434352 也就是在 CLR 层面出现异常

我错误认为这是升级到 dotnet 6 时，由于 dotnet 6 和 Win7 的兼容性导致的问题，开始着手根据 [CLR Exception E0434352 Microsoft Docs](https://docs.microsoft.com/en-us/shows/Inside/E0434352?WT.mc_id=WD-MVP-5003260 ) 官方文档的方法开始调查，然而却没有找到任何有用的信息

继续挂机到第三天，我这次采用任务管理器在 Xx 应用停止工作时，对应用抓一个 DUMP 传到我开发设备上，使用 VisualStudio 的混合调试进行调试，此时发现错误信息和第二天的不相同了，这次显示的是 OutOfMemory 相关异常。但是我在 Win7 虚拟机上，使用任务管理器看到的 Xx 应用占用的内存实际上才 250 MB 而已，这一定是在讽刺我

好在我反应过来，任务管理器上面看到的应用占用 250MB 内存，完全不等于应用使用的内存是 250MB 的空间。为什么呢？这是一个复杂的问题，我不想在本文这里聊 Windows 下的应用内存知识，也许后续会另外开一篇很长的博客来说明。需要了解的是，如果一个应用 OOM 了，那除了系统本身给不到应用足够的内存之外，还有另一个问题就是应用本身用到了平台限制的最大内存数量。别忘了 x86 和 x64 的差异

刚好，此 Xx 应用是一个 x86 应用。在通过系统日志了解到此 Win7 虚拟机上没有存在一刻是内存不足的情况，而且此纯净的虚拟机也就跑了 Xx 一个应用，要是内存不足，也是 Xx 应用的锅。回忆一下，使用 x86 应用，默认的进程空间是 4G 大小，其中有 1 到 2G 需要给系统交税，也就是应用在开启大内存感知时，最大能用到 3G 的内存。如果应用在到达 3G 内存占用附近时，依然向系统申请内存，那此时就 OOM 了

任务管理器说应用占用了多少内存，实际上如果是以上的申请内存超过 x86 平台限制的导致的问题，那完全必须无视任务管理器说的话。特别是在用户端，别忘了还有 [EmptyWorkingSet](https://docs.microsoft.com/en-us/windows/win32/api/psapi/nf-psapi-emptyworkingset?WT.mc_id=WD-MVP-5003260 ) 这样安慰人的方法

我通过拿到 DUMP 文件的大小，看到 DUMP 文件是接近 4G 的大小，猜测是 Xx 应用申请内存超过 x86 平台限制。调查此问题需要用到微软极品工具箱的 [VMMap](https://docs.microsoft.com/zh-cn/sysinternals/downloads/vmmap) 工具

通过 vmmap 可以看到此时的应用的 Private Data 占用达到接近 3G 的大小，因此可以定位到 Xx 应用闪退的原因是因为申请内存超过 x86 平台限制

也就是说有两个分支导致 Private Data 占用过多，第一个原因就是业务需要申请大量的内存空间，第一个原因不算是内存泄露问题，只能算是性能优化问题，某个业务逻辑空间复杂度过高。第二个原因就是应用内存泄露，应用不断运行过程中，不断泄露内存，运行的时间长了，自然多少内存都不够用

换句话说，不是所有的 OOM 问题，都是内存泄露问题，可能还是业务需要申请大量的内存空间问题。但显然，本次遇到的问题，应该就是内存泄露问题了。毕竟只是挂机就让应用挂掉了，那大概确定是内存泄露了。但是这只能说大概，万一有一个定时任务是从后台拉取某个数据，刚好这个数据导致了某个处理业务需要申请大量的内存，从而让应用挂掉。为了确定是哪个方式导致的 OOM 了，可以先使用排除的方式，如果是某个业务申请大量的内存导致内存泄露，这是非常好也非常方便调试出来的，只需要使用 dotMemory 工具分析一下即可

在开始使用 dotMemory 之前，还遇到一个小问题，那就是 dotMemory 不能在我的 Win7 虚拟机上运行，而我又不想去污染此虚拟机环境。好在 dotMemory 可以分析 DUMP 文件，于是我就拿来刚才使用 任务管理器 抓的 DUMP 文件进行分析。可惜，由于 Win7 虚拟机采用的是 X64 系统，而应用是 X86 应用，导致任务管理器抓的 DUMP 文件无法被 dotMemory 识别，只能再次换用专业 [ProcDump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/procdump?WT.mc_id=WD-MVP-5003260 ) 工具去抓进程的 DUMP 文件

换用 [ProcDump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/procdump?WT.mc_id=WD-MVP-5003260 ) 工具去抓应用的 DUMP 文件用起来比任务管理器更加方便，我也推荐使用 ProcDump 去抓 DUMP 文件，这个工具是十分强大的，本文用到的只是很少的功能。由于这个工具太强大了，要介绍的话，也是另一篇博客了，本文也不会包含此工具的更多使用方法

在虚拟机上面使用 `procdump -ma <PID>` 命令，这里的 `<PID>` 就是要抓取的进程的 Id 号，将 Xx 应用抓取 DUMP 文件，然后再用 7z 压缩一下，传回到我的开发设备上，用 dotMemory 打开分析。使用 7z 是因为可以很大的压缩 DUMP 文件。通过 dotMemory 分析没有看到有哪个业务使用了大量的内存，总的 .NET 内存占用实际上才不到 100MB 大小。因此大概可以确定不是因为某个业务申请大量的内存导致内存泄露，至少不是申请托管内存

继续回到确定 OOM 导致的原因上，我重新运行 Xx 应用，通过 VMMap 工具不断按 F5 刷新，经过三个小时间断追踪，可以看到 Private Data 缓慢上涨。通过此，可以判断是内存泄露问题

内存泄露通用处理方法就是先抓取泄露点，通过泄露点了解泄露模块。抓取泄露点的通用方法就是对比几段时间点，有哪些对象被创建且不被回收。依然是使用 [ProcDump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/procdump?WT.mc_id=WD-MVP-5003260 ) 工具抓取 DUMP 文件，然后通过 dotMemory 的导入 DUMP 功能，以及对比内存功能，进行分析

如果要是 dotMemory 可以符合预期的让我看到业务模块上有哪些对象没有被释放，那自然就不会有本文的记录，毕竟如此简单就能解决的问题，要是还水一篇博客就太水了。通过 dotMemory 抓取可以看到不同的时间点上，没有任何业务代码的对象泄露。唯一新建的几个对象都是 System.Net 命名空间下的，而且占用的托管内存也特别小，这几个对象的根引用都是 Ssl 相关的底层模块，看起来似乎没有问题

也如一开始的调查，泄露的部分似乎不在 .NET 托管上，而是非托管的泄露。对一个纯 .NET 应用来说，可以认定所有的非托管泄露都是由托管导致的。但是可惜 Xx 应用是一个复杂的应用里面包含了其他团队写的一点库逻辑。于是先尝试定位一下是否迁移过程，修改了部分的 `C++\CLI` 逻辑导致的内存泄露。定位的方法是采用二分法，也就是干掉这些引入的库的逻辑。我重新写了代码，用 Fake 的方式重新实现了假逻辑，将所有的其他团队写的非 .NET 的库的文件都删掉

可惜删除了其他团队写的非 .NET 的库之后，依然存在内存泄露。也就是说可以确定是在托管层存在内存泄露的，此时我特别怕是迁移到 dotnet 6 导致的，和 Win7 的适配问题。而用 dotMemory 也无法给我带来更多的帮助，用 dotMemory 最预期的能拿到的信息就是业务端有某些对象被泄露，可惜没有找到任何业务端的对象泄露。那此时用 VisualStudio 是否有更多信息？不会有的，放心吧，在调试内存泄露方面，使用 VisualStudio 和 dotMemory 的能力是完全相同的，只是 VisualStudio 的交互做的太过垃圾，完全不如 dotMemory 的交互形式。因此用 dotMemory 没有带来更多帮助，同理使用 VisualStudio 也不会有更多帮助

为了确定是否 dotnet 6 底层带来的问题，我先在 dotnet 开源仓库 [https://github.com/dotnet/runtime/](https://github.com/dotnet/runtime/) 里翻 dotnet 6 的内存相关的帖子，好在没有找到任何有关联的有帮助的，那就侧面证明了，应该是没有其他人遇到了此问题，这是一个好消息。但也许不是，那就是我是第一个遇到的人。其次，由于我采用的是 dotnet 6.0.1 版本，分发给用户端的不敢那么头铁用刚发布的版本，官方最新的是 dotnet 6.0.4 版本，也许在某个安全更新修复了此问题，安全更新有一些是保密的，也就是说我没有能找到，如果强行去找，可以用 MVP 权限去寻找，但这个响应速度就没有那么快

接下来可以调查的方向如下

- 是否 dotnet 6 底层带来的问题
- 是否 dotnet 6.0.1 带来的问题，但在 dotnet 6.0.4 修复了

确认是否 dotnet 6 底层带来的问题刚好在我这个项目上，没有那么麻烦。我对比测试了在 Win10 的设备上，发现没有内存泄露。刚好 Xx 应用是从 .NET Framework 迁移过来的，现在改改代码还能跑 .NET Framework 的版本，于是也就同步在出现问题的 Win7 上跑 .NET Framework 的版本，结果发现在 Win7 上使用 .NET Framework 版本没有任何问题。于是大概可以确定，这和 dotnet 6 底层是有所关联，但不能说这是 dotnet 6 底层的锅

接下来确定是否 dotnet 6.0.1 带来的问题，但在 dotnet 6.0.4 修复了的问题。我在此出现问题的 Win7 上，使用 dotnet 6.0.4 版本代替原先的 6.0.1 版本，好在 dotnet 6 是不需要安装的，替换文件即可。结果依然存在内存泄露，这是一个坏消息。也就是说也许我是第一个遇到此问题的人，或者说这是一个官方也不知道的问题。我就尝试去面向群编程，询问了几位大佬是否遇到过此问题，然而所有的回答都和本次遇到的不是相同的问题，且没有一位大佬遇到 dotnet 6 底层的内存泄露问题，这也算是好消息

回到测试 dotnet 6 底层带来的问题上，既然对比了 .NET Framework 和 dotnet 6 两个框架，发现只有在 dotnet 6 框架才出现问题。那可能的原因实际上可以分为三个：

- 迁移 dotnet 6 过程中，与 .NET Framework 的变更导致的问题
- 由于 dotnet 6 的机制变更，与 .NET Framework 的不相同，导致的内存回收策略变更的内存泄露问题，例如之前遇到的委托问题
- 这就是 dotnet 6 底层与 Win7 适配的问题

由于 Xx 应用是一个足够复杂的大型应用，不好定位以上的三个原因。于是采用对比测试法，先创建一个空白的 dotnet 6 的 WPF 应用，在此 Win7 上运行。十分符合预期的，没有内存泄露问题。这能证明，不是那么简单的 dotnet 6 的底层的问题。假如使用空的 dotnet 6 的 WPF 应用也能存在内存泄露，那就能快速定位是 dotnet 6 底层的问题，接下来的步骤就是看是否 WPF 的问题还是 dotnet 更底层的问题，毕竟这个 WPF 是我定制的版本，改了不少的内容

再定位是否迁移 dotnet 6 过程中，与 .NET Framework 的变更导致的问题，我寻找了所有的变更逻辑，逐个还原，或者使用 Fake 逻辑，干掉对应的功能。这个过程相当于一个二分，也就是说如果在干掉了某些功能之后，没有出现内存泄露，那就能定位内存泄露和被干掉的功能相关。完成之后，同时构建出 dotnet 6 和 .NET Framework 两个版本，在此 Win7 上运行。结果依然是 dotnet 6 版本存在内存泄露，而 .NET Framework 版本没有内存泄露

这就证明了原因可能就是 由于 dotnet 6 的机制变更，与 .NET Framework 的不相同，导致的内存泄露。但经过以上的测试，不能说明一定是 内存回收策略变更的内存泄露问题

到这里，其实基本没有了通用套路可以定位的方法了。除了使用二分法，使用二分法逐个模块干掉，看干掉到哪个模块就不存在内存泄露问题。但在此 Xx 应用上使用二分法是一个大工程，再加上内存泄露的判断是需要等待一段时间的。而不是快速就能定位出来，需要通过 VMMap 经过一段时间，按照小时为单位，看 Private Data 的占用，才能了解到是否内存泄露。以上的测试都是可以并行多个同时开始的，尽管每个测试都需要占用半天的时间，好在多个测试并行，以上的测试都在一天内完成。但如果采用二分，那就意味着需要进行串行测试，在上次没有测试完成之前，是无法进行下一个二分的。我就将二分作为最后的方法，继续找找其他的方法

回顾一下，使用 .NET Framework 没有问题，只有 dotnet 6 版本存在内存泄露。通过 dotMemory 和 DUMP 没有找到业务对象的内存泄露，只有某几个 System.Net 命名空间下的对象存在，这些对象不确定是否泄露。更新了 dotnet 6.0.4 也没有解决，也没有搜到帖子，问了大佬们也没有遇到相同的问题，也就是说不是 dotnet 的官方已知问题

既然看到了存在 System.Net 命名空间下的对象存在，那可以猜测是和网络相关的问题，刚才的 dotnet 6 的空 WPF 测试应用只能证明和基础的 dotnet 6 无关，但没有证明和网络模块无关。继续写一个访问网络的 demo 项目，运行发现没有内存泄露问题，看起来此内存泄露问题也不是那么简单能复现，一半是好消息，一半是坏消息。刚好 [waterlv](https://blog.walterlv.com/) 大佬有空回复我了，他告诉我，内存不会无缘无故上涨的，一定是有某些业务逻辑在跑。于是另一个方向是放弃内存的方向，而是调查空闲的时候运行了哪些逻辑

调查某个应用在某段时间运行了哪些逻辑，这是一个 CPU 性能调试问题，相当于调查一段时间内，有哪些逻辑占用了 CPU 资源。调查这个问题最好用的工具就是 dotTrace 工具了。我准备在此 Win7 使用 dotTrace 工具抓 Xx 应用的信息，可惜 dotTrace 工具无法在此 Win7 运行，原因有两个，一个是需要 .NET Framework 4.7 的环境，另一个就是 ETW 准备失败。其中 ETW 准备失败也就无法抓取信息，于是我放弃了 dotTrace 工具

刚好 dotnet 系里面有 dotnet trace 工具，此工具可以完美在 Win7 运行。于是我换用 dotnet trace 工具去抓取，虽然是抓取到了信息，但是 dotnet trace 工具比 dotTrace 工具还是差太远了，差距大概是一个是记事本，一个是 SublimeText 的差距，我没有成功分析出来什么，反而又过去了一天

那换一个方式，通过 DUMP 抓取瞬时的线程调用堆栈，可以看到有很多线程存在，但是基本上都是不在运行的线程。唯一一个看起来稍微相关的堆栈如下

```
> ntdll.dll!_ZwWaitForMultipleObjects@20() Unknown
  KERNELBASE.dll!_WaitForMultipleObjectsEx@20()  Unknown
  kernel32.dll!_WaitForMultipleObjectsExImplementation@20()  Unknown
  kernel32.dll!_WaitForMultipleObjects@16()  Unknown
  winhttp.dll!HANDLE_OBJECT::IsInvalidated(void)  Unknown
  winhttp.dll!OutProcGetProxyForUrl(class INTERNET_SESSION_HANDLE_OBJECT *,unsigned short const *,struct WINHTTP_AUTOPROXY_OPTIONS const *,struct WINHTTP_PROXY_INFO *) Unknown
  winhttp.dll!_WinHttpGetProxyForUrl@16()  Unknown
  cryptnet.dll!InetGetProxy(void *,void *,unsigned short const *,unsigned long,struct WINHTTP_PROXY_INFO * *) Unknown
  cryptnet.dll!InetSendAuthenticatedRequestAndReceiveResponse(void *,void *,unsigned short const *,unsigned short const *,unsigned char const *,unsigned long,unsigned long,struct WINHTTP_PROXY_INFO *,struct _CRYPT_CREDENTIALS *,struct _CRYPT_RETRIEVE_AUX_INFO *)  Unknown
  cryptnet.dll!_InetSendReceiveUrlRequest@32() Unknown
  cryptnet.dll!CInetSynchronousRetriever::RetrieveObjectByUrl(unsigned short const *,char const *,unsigned long,unsigned long,struct _CRYPT_BLOB_ARRAY *,void (**)(char const *,struct _CRYPT_BLOB_ARRAY *,void *),void * *,void *,struct _CRYPT_CREDENTIALS *,struct _CRYPT_RETRIEVE_AUX_INFO *) Unknown
  cryptnet.dll!_InetRetrieveEncodedObject@40() Unknown
  cryptnet.dll!CObjectRetrievalManager::RetrieveObjectByUrl(unsigned short const *,char const *,unsigned long,unsigned long,void * *,void *,struct _CRYPT_CREDENTIALS *,void *,struct _CRYPT_RETRIEVE_AUX_INFO *) Unknown
  cryptnet.dll!CryptRetrieveObjectByUrlWithTimeoutThreadProc(void *)  Unknown
  kernel32.dll!@BaseThreadInitThunk@12() Unknown
```

看起来和系统的 cryptnet.dll 有几毛钱关系，也许这是 Win7 一个已知的问题，也许更新了某个补丁能解决。到这里想要继续就只能通过 WinDbg 了，玩 WinDbg 工具需要花太多的时间，于是我先挂着 WinDbg 在 Win7 系统上，拉符号文件，将我本机的符号文件夹共享给他。拉取符号和共享符号文件夹需要半天的时间，我也不能摸鱼。似乎走 CPU 分析这个路是不可行的。继续回到分析内存的方法

继续猜测是网络相关问题，好在使用的是虚拟机，我听了 [waterlv](https://blog.walterlv.com/) 大佬的方法，禁用了网卡，跑了一个晚上，没有内存泄露。那基本可以定位和网络问题是强相关了。于是开启 Fiddler 准备抓数据，默认的 Fiddler 是没有抓 Https 的请求的，我分为两个阶段，先抓 http 的请求，结果发现 Xx 应用没有任何 http 请求。开启 Fiddler 的抓取 https 请求，结果发现有某些请求发出，但是此时诡异的是 Xx 应用不再有内存泄露了

我根据 Fiddler 抓 Https 请求的原理猜测是因为 Fiddler 为了抓取 Https 安装的证书导致 Xx 应用的行为和之前不同，从而没有内存泄露问题。于是做对比测试，关掉 Fiddler 的抓 https 功能，重启 Xx 应用，跑了半天，内存泄露

大概可以定位到和证书相关，继续定位是和请求哪个链接相关，从代码里面进行二分逻辑，从 Fiddler 里面抓到的各个请求的代码，逐个干掉，终于被我定位到核心的问题所在。我的另一个本机的服务应用，这是一个在本机开启的进程服务，通过 Https 进行 IPC 本机跨进程通讯。业务模块和这个本地服务应用有心跳通讯，每次通讯都是内存泄露。那为什么这个本地服务应用的通讯会让 Xx 应用内存泄露，根据 Fidder 的证书问题我猜测和证书相关。重新阅读这个服务应用的代码，以及请教了 [lsj](https://blog.sdlsj.net) 证书相关知识点之后，了解到这个服务应用，采用的证书有点问题，这个服务应用的证书链是不完整的，刚好在此 Win7 系统上，证书也都没有更新

解决的方法有几个：

- 换用 http 通讯，都是本机了，还用什么 https 通讯
- 换用 HttpClient 通讯，默认明确抛出 `System.Security.Authentication.AuthenticationException: The remote certificate is invalid because of errors in the certificate chain: PartialChain` 异常

换用 HttpClient 通讯时，可以使用如下代码忽略证书错误问题，但是此方式是不受推荐的

```csharp
var handler = new HttpClientHandler()
{
   ServerCertificateCustomValidationCallback = delegate { return true; }
};
var httpClient = new HttpClient(handler);
```

于是我将 Https 换成 Http 的方式，再次测试，跑了一段时间，没有内存泄露。看起来就是证书导致的问题

逻辑上也是对的，一次对本机的服务应用访问，不需要创建任何业务端的对象，全部使用的都是 System.Net 的对象，这就是使用 dotMemory 工具失败的原因，而且请求的速度也足够快，无法让 DUMP 抓到信息，再加上异步是没有 DUMP 的线程堆栈，这就让上面使用 DUMP 调试的方法挂掉。其实要是 dotTrace 能跑起来，是可以快速定位到此模块的，可惜 dotnet trace 还是比较渣。在了解到是这个模块的时候，我换用 PerfView 去调试 dotnet trace 抓的文件，其实依然能看到这个模块的逻辑，可惜如果没有了解到是这个模块的问题时，应该是无法通过 PerfView 定位的。也就是说，实际上 dotnet trace 是具备此定位的能力的，能收集到足够的信息，但上层的分析工具却是渣的很，无论是 VisualStudio 还是 PerfView 工具，在界面和交互上都渣

不过说 VisualStudio 还是 PerfView 工具渣，我还是需要和 dotTrace 对比一下。和这个本地服务应用的通讯模块，在我的开发设备上也是相同运行的，和在 Win7 系统上一样，差别只是我的开发设备上没有内存泄露。但是如上文，其实只是调查某段时间的 CPU 占用，和内存泄露没有关系。我在开发设备上开启 dotTrace 工具，抓了 Xx 应用，果然迅速就看到了和这个本地服务应用的通讯模块的执行逻辑。也就是说如果有 dotTrace 工具一开始就能跑起来，应该可以半天内搞定

喷完了 VisualStudio 工具渣，刚好此时 WinDbg 的符号也下载完成了，可以继续调查更底层的逻辑，依然从内存的角度调查。在 VMMap 工具上，通过 Private Data 的数据可以看到堆上有很多大小相同的数据，根据 Win32 内存调试的套路，基本上可以确定这就是某个相同的模块申请的，而且也没有释放

为了确定是哪个模块申请了某个非托管内存，我使用了 gflags 工具的辅助，这个工具就放在 WinDbg 所在的文件夹里面，在命令行执行下面命令，执行的时候将会提示管理员权限，执行完成之后是不会有任何界面的

```
gflags.exe /i Xx.exe +ust
```

使用以上命令，即可让 gflags 辅助抓取 Xx 应用的内存申请的调用堆栈。以上命令的 `Xx.exe` 是不需要也不能使用绝对路径的，只是一个进程的文件名即可，因为实际上的抓取逻辑还是在 WinDbg 下执行。详细请看 [官方文档](https://docs.microsoft.com/zh-cn/windows-hardware/drivers/debugger/gflags?WT.mc_id=WD-MVP-5003260 )

接下来是将 Xx 应用跑起来，由于 Xx 应用是在空闲的时候，没有用户交互，就出现内存泄露，为了减少 WinDbg 的复杂调试，我在应用跑起来，启动完成，才使用 WinDbg 附加调试

尽管知道是某个大小的数据占用了 Private Data 内存，但我对 VMMap 工具不够熟悉，不敢作为结果使用，但是可以作为方向。我重新通过 WinDbg 定位是否某个模块申请了内存没有释放，步骤就是先找到哪个内存在变更，对应的堆里面的内容，是否某个大小的数据是在不断泄露的，这些大小的数据的申请的调用堆栈是什么

先通过 `!heap -s` 命令多次执行，了解是那个内存在变更

按照惯例是执行至少两次进行对比，对于大型应用，基本上都推荐是三次以上。不过我通过 VMMap 工具大概了解到方向了，于是就只使用三次。首次执行的命令和输出如下

```
0:024> !heap -s
LFH Key                   : 0x5327c840
Termination on corruption : ENABLED
  Heap     Flags   Reserv  Commit  Virt   Free  List   UCR  Virt  Lock  Fast 
                    (k)     (k)    (k)     (k) length      blocks cont. heap 
-----------------------------------------------------------------------------
00420000 00000002   48768  43096  48768   1929   715    16    0      3   LFH
006b0000 00001002    1088    680   1088      8    21     2    0      0   LFH
00e30000 00001002     256    204    256      2    21     1    0      0   LFH
00df0000 00041002     256      4    256      2     1     1    0      0      
01170000 00001002    1088    196   1088     16     8     2    0      0   LFH
05970000 00041002     256      4    256      2     1     1    0      0      
05920000 00001002     256    160    256      3     7     1    0      0   LFH
083a0000 00001002     256    172    256    118     3     1    0      0      
0b240000 00001002     256    168    256      5    10     1    0      0   LFH
0a3f0000 00041002     256     16    256      5     1     1    0      0      
0e510000 00011002     256     12    256      9     6     1    0      0      
0ec10000 00001002     256    148    256      6     5     1    0      0   LFH
0ee20000 00001002     256    256    256    111    11     1    0      0   LFH
0ed10000 00001002      64     52     64      7     3     1    0      0      
0f990000 00001002     256      4    256      1     2     1    0      0      
0fdb0000 00001002   12096   4048  12096   2601    32     8    0      0   LFH
    External fragmentation  64 % (32 free blocks)
08700000 00001002      64      4     64      2     1     1    0      0      
-----------------------------------------------------------------------------
```

在 WinDbg 按下 g 命令让应用继续运行一段时间

```
0:024> g
(7c0.1874): CLR exception - code e0434352 (first chance)
(7c0.1874): CLR exception - code e0434352 (first chance)
(7c0.e64): Break instruction exception - code 80000003 (first chance)
eax=fff9c000 ebx=00000000 ecx=00000000 edx=7743f7ea esi=00000000 edi=00000000
eip=773b000c esp=0a5efe4c ebp=0a5efe78 iopl=0         nv up ei pl zr na pe nc
cs=0023  ss=002b  ds=002b  es=002b  fs=0053  gs=002b             efl=00000246
ntdll!DbgBreakPoint:
773b000c cc              int     3
```

可以看到存在一些 CLR 异常，这就是本文开头所抓到的 CLR 异常的部分，但不是相同的异常信息。这些是可以忽略的，而且我也大概定位到方向，加上前几天也尝试定位了 CLR 异常没有收获，就没有继续定位

让 Xx 应用跑了一段时间，在 WinDbg 工具按下暂停，继续执行 `!heap -s` 命令

```
0:007> !heap -s
LFH Key                   : 0x5327c840
Termination on corruption : ENABLED
  Heap     Flags   Reserv  Commit  Virt   Free  List   UCR  Virt  Lock  Fast 
                    (k)     (k)    (k)     (k) length      blocks cont. heap 
-----------------------------------------------------------------------------
00420000 00000002   81152  67244  81152   1992   723    18    0      3   LFH
006b0000 00001002    1088    680   1088      8    22     2    0      0   LFH
00e30000 00001002     256    204    256      2    21     1    0      0   LFH
00df0000 00041002     256      4    256      2     1     1    0      0      
01170000 00001002    1088    196   1088     16     9     2    0      0   LFH
05970000 00041002     256      4    256      2     1     1    0      0      
05920000 00001002     256    160    256      3     7     1    0      0   LFH
083a0000 00001002     256    172    256    118     3     1    0      0      
0b240000 00001002     256    168    256      5    10     1    0      0   LFH
0a3f0000 00041002     256     16    256      5     1     1    0      0      
0e510000 00011002     256     12    256      9     6     1    0      0      
0ec10000 00001002     256    148    256      6     5     1    0      0   LFH
0ee20000 00001002     256    256    256    111    11     1    0      0   LFH
0ed10000 00001002      64     52     64      7     3     1    0      0      
0f990000 00001002     256      4    256      1     2     1    0      0      
0fdb0000 00001002   12096   4048  12096   2601    32     8    0      0   LFH
    External fragmentation  64 % (32 free blocks)
08700000 00001002      64      4     64      2     1     1    0      0      
-----------------------------------------------------------------------------
```

大概可以看到 `00420000` 的大小从 `48768` 到 `81152` 的大小

使用 `!heap -stat -h 00420000` 了解这个内存里面的数据分布情况

```
0:007> !heap -stat -h 00420000
 heap @ 00420000
group-by: TOTSIZE max-display: 20
    size     #blocks     total     ( %) (percent of total busy bytes)
    27994 71 - 117aa54  (37.88)
    269f8 6f - 10bf288  (36.29)
    fdcc 67 - 661d14  (13.83)
    10 7560 - 75600  (0.99)
    1c 2fec - 53dd0  (0.71)
    49a9c 1 - 49a9c  (0.62)
    390 e3 - 328b0  (0.43)
    711 68 - 2dee8  (0.39)
    284 108 - 29820  (0.35)
    618 64 - 26160  (0.32)
    40 934 - 24d00  (0.31)
    20 11f8 - 23f00  (0.30)
    70 49e - 20520  (0.27)
    50 639 - 1f1d0  (0.26)
    60 4b2 - 1c2c0  (0.24)
    dce0 2 - 1b9c0  (0.23)
    84 2d7 - 176dc  (0.20)
    15f13 1 - 15f13  (0.19)
    15eee 1 - 15eee  (0.19)
    30 6c5 - 144f0  (0.17)
```

可以看到大小为 `27994` 的数据有 0x71 个，而大小为 `269f8` 的数据有 0x6f 个。其实这两个不能说明问题，继续让 Xx 应用执行一段时间，再输入 `!heap -s` 命令

```
0:019> !heap -s
LFH Key                   : 0x5327c840
Termination on corruption : ENABLED
  Heap     Flags   Reserv  Commit  Virt   Free  List   UCR  Virt  Lock  Fast 
                    (k)     (k)    (k)     (k) length      blocks cont. heap 
-----------------------------------------------------------------------------
00420000 00000002   97344  91356  97344   2082   730    19    0      3   LFH
006b0000 00001002    1088    680   1088      9    22     2    0      0   LFH
00e30000 00001002     256    204    256      2    21     1    0      0   LFH
00df0000 00041002     256      4    256      2     1     1    0      0      
01170000 00001002    1088    196   1088     17     9     2    0      0   LFH
05970000 00041002     256      4    256      2     1     1    0      0      
05920000 00001002     256    160    256      3     7     1    0      0   LFH
083a0000 00001002     256    172    256    118     3     1    0      0      
0b240000 00001002     256    172    256      5    11     1    0      0   LFH
0a3f0000 00041002     256     16    256      5     1     1    0      0      
0e510000 00011002     256     12    256      9     6     1    0      0      
0ec10000 00001002     256    148    256      6     5     1    0      0   LFH
0ee20000 00001002     256    256    256    111    11     1    0      0   LFH
0ed10000 00001002      64     52     64      7     3     1    0      0      
0f990000 00001002     256      4    256      1     2     1    0      0      
0fdb0000 00001002   12096   4048  12096   2601    32     8    0      0   LFH
    External fragmentation  64 % (32 free blocks)
08700000 00001002      64      4     64      2     1     1    0      0      
-----------------------------------------------------------------------------
```

可以看到 00420000 占用的内存更加多了，使用 `!heap -stat -h 00420000` 查看

```
0:019> !heap -stat -h 00420000
 heap @ 00420000
group-by: TOTSIZE max-display: 20
    size     #blocks     total     ( %) (percent of total busy bytes)
    27994 b1 - 1b60f54  (39.25)
    269f8 af - 1a67088  (37.85)
    fdcc a6 - a49248  (14.75)
    10 757a - 757a0  (0.66)
    1c 2ff4 - 53eb0  (0.47)
    49a9c 1 - 49a9c  (0.41)
    711 97 - 42b07  (0.37)
    618 86 - 33090  (0.29)
    390 e3 - 328b0  (0.28)
    284 108 - 29820  (0.23)
    40 935 - 24d40  (0.21)
    20 1236 - 246c0  (0.20)
    70 4a2 - 206e0  (0.18)
    50 63a - 1f220  (0.17)
    60 4b2 - 1c2c0  (0.16)
    dce0 2 - 1b9c0  (0.15)
    84 2d7 - 176dc  (0.13)
    15f13 1 - 15f13  (0.12)
    15eee 1 - 15eee  (0.12)
    30 6c5 - 144f0  (0.11)
```

可以看到前面两个变更了，也就是大小为  `27994` 的数据和大小为 `269f8` 的数据的数量变更了

```
原先：
    27994 71 - 117aa54  (37.88)
    269f8 6f - 10bf288  (36.29)
当前：
    27994 b1 - 1b60f54  (39.25)
    269f8 af - 1a67088  (37.85)

也就是说大小 Size 为 27994 的存在很多重复项
```

接下来就是获取到这些被分配内存的地址，使用命令 `!heap -flt s 27994` 过滤其它的内存块，只显示大小为 27994 的内存块信息

```
0:019> !heap -flt s 27994
    _HEAP @ 420000
      HEAP_ENTRY Size Prev Flags    UserPtr UserSize - state
        05fd2880 4f34 0000  [00]   05fd2888    27994 - (busy)
        06020c20 4f34 4f34  [00]   06020c28    27994 - (busy)
        0614cc18 4f34 4f34  [00]   0614cc20    27994 - (busy)
        08a719d0 4f34 4f34  [00]   08a719d8    27994 - (busy)
        08b05028 4f34 4f34  [00]   08b05030    27994 - (busy)
        08b9e4f0 4f34 4f34  [00]   08b9e4f8    27994 - (busy)
      .....  
        0b493108 4f34 4f34  [00]   0b493110    27994 - (busy)
      .....  
        0b366408 4f34 4f34  [00]   106b9378    27994 - (busy)
      .....  
        1e2abff8 4f34 4f34  [00]   1e2ac000    27994 - (busy)
        1e31a178 4f34 4f34  [00]   1fa93750    27994 - (busy)
        1e3782f0 4f34 4f34  [00]   1e3782f8    27994 - (busy)
        1e3d6468 4f34 4f34  [00]   2004dc80    27994 - (busy)
    _HEAP @ 6b0000
    _HEAP @ e30000
    _HEAP @ df0000
    _HEAP @ 1170000
    _HEAP @ 5970000
    _HEAP @ 5920000
    _HEAP @ 83a0000
    _HEAP @ b240000
    _HEAP @ a3f0000
    _HEAP @ e510000
    _HEAP @ ec10000
    _HEAP @ ee20000
    _HEAP @ ed10000
    _HEAP @ f990000
    _HEAP @ fdb0000
    _HEAP @ 8700000
```

输出的内容太多了，我忽略了一些信息

刚才开启了 GFlags 工具，可以通过 `!heap -p -a <UserPtr>` 了解内存块的申请调用堆栈，也就是哪个模块申请的内存。此命令的 `<UserPtr>` 请替换为 UserPtr 这一列的内存地址。需要抓几个内存块地址来进行统计才能了解是哪个模块申请而且泄露的

我先抓取了 2004dc80 地址的信息

```
!heap -p -a 2004dc80
    address 2004dc80 found in
    _HEAP @ 490000
      HEAP_ENTRY Size Prev Flags    UserPtr UserSize - state
        2004dc68 4f36 0000  [00]   2004dc80    27994 - (busy)
        7741df42 ntdll!RtlAllocateHeap+0x00000274
        76874ec3 KERNELBASE!LocalAlloc+0x0000005f
        76424b84 CRYPT32!PkiAlloc+0x00000032
        764516b3 CRYPT32!ChainCreateCyclicPathObject+0x000000b8
        764515c7 CRYPT32!ExtractEncodedCtlFromCab+0x000001b0
        7645142c CRYPT32!ExtractAuthRootAutoUpdateCtlFromCab+0x00000041
        764504d3 CRYPT32!CCertChainEngine::GetAuthRootAutoUpdateCtl+0x000001f8
        764c047c CRYPT32!CChainPathObject::GetAuthRootAutoUpdateUrlStore+0x00000082
        76469850 CRYPT32!CChainPathObject::CChainPathObject+0x000003d0
        76437934 CRYPT32!ChainCreatePathObject+0x0000005e
        76437da9 CRYPT32!CCertIssuerList::AddIssuer+0x0000006c
        764387ac CRYPT32!CChainPathObject::FindAndAddIssuersFromStoreByMatchType+0x0000018b
        764386bd CRYPT32!CChainPathObject::FindAndAddIssuersByMatchType+0x00000096
        7643bbc6 CRYPT32!CChainPathObject::FindAndAddIssuers+0x00000063
        764697e0 CRYPT32!CChainPathObject::CChainPathObject+0x0000035b
        76437934 CRYPT32!ChainCreatePathObject+0x0000005e
        76438c8d CRYPT32!CCertChainEngine::CreateChainContextFromPathGraph+0x000001ae
        76438a6e CRYPT32!CCertChainEngine::GetChainContext+0x00000046
        76436d42 CRYPT32!CertGetCertificateChain+0x00000072
```

然后再选中间的 1fa93750 地址

```
0:042> !heap -p -a 1fa93750
    address 1fa93750 found in
    _HEAP @ 490000
      HEAP_ENTRY Size Prev Flags    UserPtr UserSize - state
        1fa93738 4f36 0000  [00]   1fa93750    27994 - (busy)
        7741df42 ntdll!RtlAllocateHeap+0x00000274
        76874ec3 KERNELBASE!LocalAlloc+0x0000005f
        76424b84 CRYPT32!PkiAlloc+0x00000032
        764516b3 CRYPT32!ChainCreateCyclicPathObject+0x000000b8
        764515c7 CRYPT32!ExtractEncodedCtlFromCab+0x000001b0
        7645142c CRYPT32!ExtractAuthRootAutoUpdateCtlFromCab+0x00000041
        764504d3 CRYPT32!CCertChainEngine::GetAuthRootAutoUpdateCtl+0x000001f8
        764c047c CRYPT32!CChainPathObject::GetAuthRootAutoUpdateUrlStore+0x00000082
        76469850 CRYPT32!CChainPathObject::CChainPathObject+0x000003d0
        76437934 CRYPT32!ChainCreatePathObject+0x0000005e
        76437da9 CRYPT32!CCertIssuerList::AddIssuer+0x0000006c
        764387ac CRYPT32!CChainPathObject::FindAndAddIssuersFromStoreByMatchType+0x0000018b
        764386bd CRYPT32!CChainPathObject::FindAndAddIssuersByMatchType+0x00000096
        7643bbc6 CRYPT32!CChainPathObject::FindAndAddIssuers+0x00000063
        764697e0 CRYPT32!CChainPathObject::CChainPathObject+0x0000035b
        76437934 CRYPT32!ChainCreatePathObject+0x0000005e
        76438c8d CRYPT32!CCertChainEngine::CreateChainContextFromPathGraph+0x000001ae
        76438a6e CRYPT32!CCertChainEngine::GetChainContext+0x00000046
        76436d42 CRYPT32!CertGetCertificateChain+0x00000072
```

最后选了比较前面的地址

```
0:042> !heap -p -a 106b9378
    address 106b9378 found in
    _HEAP @ 490000
      HEAP_ENTRY Size Prev Flags    UserPtr UserSize - state
        106b9360 4f36 0000  [00]   106b9378    27994 - (busy)
        7741df42 ntdll!RtlAllocateHeap+0x00000274
        76874ec3 KERNELBASE!LocalAlloc+0x0000005f
        76424b84 CRYPT32!PkiAlloc+0x00000032
        764516b3 CRYPT32!ChainCreateCyclicPathObject+0x000000b8
        764515c7 CRYPT32!ExtractEncodedCtlFromCab+0x000001b0
        7645142c CRYPT32!ExtractAuthRootAutoUpdateCtlFromCab+0x00000041
        764504d3 CRYPT32!CCertChainEngine::GetAuthRootAutoUpdateCtl+0x000001f8
        764c047c CRYPT32!CChainPathObject::GetAuthRootAutoUpdateUrlStore+0x00000082
        76469850 CRYPT32!CChainPathObject::CChainPathObject+0x000003d0
        76437934 CRYPT32!ChainCreatePathObject+0x0000005e
        76438c8d CRYPT32!CCertChainEngine::CreateChainContextFromPathGraph+0x000001ae
        76438a6e CRYPT32!CCertChainEngine::GetChainContext+0x00000046
        76436d42 CRYPT32!CertGetCertificateChain+0x00000072
```

可以看到都是 CRYPT32.dll 的 CertGetCertificateChain 函数申请的，对比刚才的 DUMP 抓到的线程调用堆栈，似乎 CRYPT32.dll 这个系统组件就是有锅的。而且 CRYPT32.dll 就是处理证书相关的逻辑。 通过[官方文档](https://docs.microsoft.com/en-us/windows/win32/api/wincrypt/nf-wincrypt-certgetcertificatechain?WT.mc_id=WD-MVP-5003260 )了解到 CertGetCertificateChain 就是证书链相关逻辑

根据上文使用二分调试到的，和本地服务应用的通讯模块的证书链在 Win7 系统上损坏导致的内存泄露。现在根据 WinDbg 可以看到是 CertGetCertificateChain 处理证书链申请的内存没有释放，那就证明一定是证书链的问题

刚才通过 WinDbg 抓到的内存变更的内存块大小有两个，接下来再看 269f8 大小的内存块的地址


```
0:042> !heap -flt s 269f8
    _HEAP @ 490000
      HEAP_ENTRY Size Prev Flags    UserPtr UserSize - state
        084e4400 4d42 0000  [00]   084e4418    269f8 - (busy)
        0b810470 4d42 4d42  [00]   0b810488    269f8 - (busy)
        0b8cb7e8 4d42 4d42  [00]   0b8cb800    269f8 - (busy)
        0b90b900 4d42 4d42  [00]   0b90b918    269f8 - (busy)
        0b96b990 4d42 4d42  [00]   0b96b9a8    269f8 - (busy)
        0b9cba20 4d42 4d42  [00]   0b9cba38    269f8 - (busy)
        0ba3f108 4d42 4d42  [00]   0ba3f120    269f8 - (busy)
        105650b8 4d42 4d42  [00]   105650d0    269f8 - (busy)
        10692950 4d42 4d42  [00]   10692968    269f8 - (busy)
        10754ec0 4d42 4d42  [00]   10754ed8    269f8 - (busy)
        107f2630 4d42 4d42  [00]   107f2648    269f8 - (busy)
        10c28f90 4d42 4d42  [00]   10c28fa8    269f8 - (busy)
        10c8d038 4d42 4d42  [00]   10c8d050    269f8 - (busy)
        10cc4670 4d42 4d42  [00]   10cc4688    269f8 - (busy)
        10e0dbd0 4d42 4d42  [00]   10e0dbe8    269f8 - (busy)
        10e5bf90 4d42 4d42  [00]   10e5bfa8    269f8 - (busy)
      .....  
        201783a8 4d42 4d42  [00]   201783c0    269f8 - (busy)
        201ff188 4d42 4d42  [00]   201ff1a0    269f8 - (busy)
        2025d330 4d42 4d42  [00]   2025d348    269f8 - (busy)
        20329698 4d42 4d42  [00]   203296b0    269f8 - (busy)
    _HEAP @ 760000
    _HEAP @ a20000
    _HEAP @ ec0000
    _HEAP @ 1060000
    _HEAP @ 4e50000
    _HEAP @ 1010000
    _HEAP @ bd10000
    _HEAP @ e5c0000
    _HEAP @ e7f0000
    _HEAP @ 11900000
    _HEAP @ 11c10000
    _HEAP @ 12030000
    _HEAP @ 12750000
    _HEAP @ 12880000
    _HEAP @ 13410000
    _HEAP @ 1a2b0000
```

先随意选择 201ff1a0 内存地址，通过 `!heap -p -a 201ff1a0` 了解是哪个模块申请

```
0:042> !heap -p -a 201ff1a0
    address 201ff1a0 found in
    _HEAP @ 490000
      HEAP_ENTRY Size Prev Flags    UserPtr UserSize - state
        201ff188 4d42 0000  [00]   201ff1a0    269f8 - (busy)
        7741df42 ntdll!RtlAllocateHeap+0x00000274
        76874ec3 KERNELBASE!LocalAlloc+0x0000005f
        76424b84 CRYPT32!PkiAlloc+0x00000032
        76447489 CRYPT32!ICM_GetListSignedData+0x000000fa
        76447299 CRYPT32!ICM_UpdateDecodingSignedData+0x0000006d
        764475cc CRYPT32!CryptMsgUpdate+0x000001e0
        764464c4 CRYPT32!FastCreateCtlElement+0x00000221
        76446252 CRYPT32!CertCreateContext+0x000000f1
        76451464 CRYPT32!ExtractAuthRootAutoUpdateCtlFromCab+0x000000b0
        764504d3 CRYPT32!CCertChainEngine::GetAuthRootAutoUpdateCtl+0x000001f8
        764c047c CRYPT32!CChainPathObject::GetAuthRootAutoUpdateUrlStore+0x00000082
        76469850 CRYPT32!CChainPathObject::CChainPathObject+0x000003d0
        76437934 CRYPT32!ChainCreatePathObject+0x0000005e
        76437da9 CRYPT32!CCertIssuerList::AddIssuer+0x0000006c
        764387ac CRYPT32!CChainPathObject::FindAndAddIssuersFromStoreByMatchType+0x0000018b
        764386bd CRYPT32!CChainPathObject::FindAndAddIssuersByMatchType+0x00000096
        7643bbc6 CRYPT32!CChainPathObject::FindAndAddIssuers+0x00000063
        764697e0 CRYPT32!CChainPathObject::CChainPathObject+0x0000035b
        76437934 CRYPT32!ChainCreatePathObject+0x0000005e
        76438c8d CRYPT32!CCertChainEngine::CreateChainContextFromPathGraph+0x000001ae
        76438a6e CRYPT32!CCertChainEngine::GetChainContext+0x00000046
        76436d42 CRYPT32!CertGetCertificateChain+0x00000072
```

依然是 CertGetCertificateChain 申请的，这是一个利好消息。继续再随意找了 10e0dbe8 地址，通过 `!heap -p -a 10e0dbe8` 了解是哪个模块申请

```
0:042> !heap -p -a 10e0dbe8
    address 10e0dbe8 found in
    _HEAP @ 490000
      HEAP_ENTRY Size Prev Flags    UserPtr UserSize - state
        10e0dbd0 4d42 0000  [00]   10e0dbe8    269f8 - (busy)
        7741df42 ntdll!RtlAllocateHeap+0x00000274
        76874ec3 KERNELBASE!LocalAlloc+0x0000005f
        76424b84 CRYPT32!PkiAlloc+0x00000032
        76447489 CRYPT32!ICM_GetListSignedData+0x000000fa
        76447299 CRYPT32!ICM_UpdateDecodingSignedData+0x0000006d
        764475cc CRYPT32!CryptMsgUpdate+0x000001e0
        764464c4 CRYPT32!FastCreateCtlElement+0x00000221
        76446252 CRYPT32!CertCreateContext+0x000000f1
        76451464 CRYPT32!ExtractAuthRootAutoUpdateCtlFromCab+0x000000b0
        764504d3 CRYPT32!CCertChainEngine::GetAuthRootAutoUpdateCtl+0x000001f8
        764c047c CRYPT32!CChainPathObject::GetAuthRootAutoUpdateUrlStore+0x00000082
        76469850 CRYPT32!CChainPathObject::CChainPathObject+0x000003d0
        76437934 CRYPT32!ChainCreatePathObject+0x0000005e
        76438c8d CRYPT32!CCertChainEngine::CreateChainContextFromPathGraph+0x000001ae
        76438a6e CRYPT32!CCertChainEngine::GetChainContext+0x00000046
        76436d42 CRYPT32!CertGetCertificateChain+0x00000072
```

可以看到依然是 CertGetCertificateChain 申请的

现在可以完全证明内存泄露问题是证书链损坏导致 CertGetCertificateChain 内存泄露

但是无法确定 CertGetCertificateChain 内存泄露的更底层原因，也无法确定这是否是 Win7 这个版本存在的问题，是否安装了补丁可以修复，还是因为 dotnet 6 调用的问题。我尝试去搜以上的堆栈，找到了 2013 的帖子 [IE crashes due to SSL certificate check - Problem with MSVCR80.dll, - Microsoft Community](https://answers.microsoft.com/en-us/ie/forum/all/ie-crashes-due-to-ssl-certificate-check-problem/fc3365bb-3583-4813-9e59-dc3cc8f92d46 )

看起来和上面说的是相同的一个问题，我预计是有补丁可以解决。而且让 Win7 修复证书预计也能解决此问题

继续调查是否因为 dotnet 6 调用的问题，从 WinDbg 上看到的堆栈只是到 CertGetCertificateChain 函数，这是因为我没有加载 dotnet 6 的 sos 因此无法拿到 .NET 层的调用信息。如何加载 dotnet 6 的 sos 请看 [WinDbg 加载 dotnet core 的 sos.dll 辅助调试方法](https://blog.lindexi.com/post/WinDbg-%E5%8A%A0%E8%BD%BD-dotnet-core-%E7%9A%84-sos.dll-%E8%BE%85%E5%8A%A9%E8%B0%83%E8%AF%95%E6%96%B9%E6%B3%95.html )

在调试到 CertGetCertificateChain 申请的内存没有泄露，后续的调试我也不用 WinDbg 了，也不需要去加载 dotnet 6 的 sos 了。我通过静态代码分析，阅读 dotnet 6 的底层代码，看到了下面代码

```csharp
internal sealed partial class ChainPal
{
   internal static partial IChainPal? BuildChain()
   {
       // 忽略代码
                            if (!Interop.Crypt32.CertGetCertificateChain(storeHandle.DangerousGetHandle(), certificatePal.CertContext, &ft, extraStoreHandle, ref chainPara, flags, IntPtr.Zero, out chain))
                            {
                                return null;
                            }
   }
}
```

根据官方文档，需要使用 [CertFreeCertificateChain](https://docs.microsoft.com/en-us/windows/win32/api/wincrypt/nf-wincrypt-certfreecertificatechain?WT.mc_id=WD-MVP-5003260 ) 释放上面代码的 `chain` 变量。然而如上面代码，在 CertGetCertificateChain 方法返回 false 值，就返回了，没有对 chain 调用释放

我不了解是否在 CertGetCertificateChain 方法返回 false 值，就不需要调用 [CertFreeCertificateChain](https://docs.microsoft.com/en-us/windows/win32/api/wincrypt/nf-wincrypt-certfreecertificatechain?WT.mc_id=WD-MVP-5003260 ) 的问题，我反馈给了 dotnet 官方，详细请看 [CertGetCertificateChain memory leak in pure Windows 7 system · Issue #68892 · dotnet/runtime](https://github.com/dotnet/runtime/issues/68892 )

通过阅读 mozilla 的代码，看到了 mozilla 在 CertGetCertificateChain 方法返回 false 值，也是立刻返回，没有调用 CertFreeCertificateChain 方法，详细请看 https://hg.mozilla.org/releases/mozilla-release/rev/d9659c22b3c5#l3.347

但是 Xx 应用的内存泄露问题已解决，后续就交给 dotnet 官方

那为什么 .NET Framework 就不存在问题？我继续阅读 dotent 代码和考古 .NET Framework 的代码，看到了这个逻辑是在 .NET Framework 4.6 变更的，也就是本文开始说的内容。刚好 Xx 应用是从 .NET Framework 4.5 升级到 dotnet 6 的，刚好就踩到这个坑

我回顾了本次的调试，用了五天，实际上方向错了。如果开始听 [waterlv](https://blog.walterlv.com/) 大佬，内存不会无缘无故上涨的，一定是有某些业务逻辑在跑，通过调试 CPU 占用的方法，是能在一天内完成。而如上文的调试过程，我调试的方向都是去调试内存，这是不对的。通过 Fiddler 定位是证书问题和定位是 IPC 使用 Https 通讯且证书链损坏，也是定位有哪些业务模块在执行，也就是调试 CPU 占用。通过任务管理器可以看到，大概每间隔 3 秒就有 CPU 占用，也就是说可以认为在 Xx 应用，所有定时任务小于 10 秒的，都是可能导致本次内存泄露的逻辑，我再次阅读 Xx 应用的代码，看到了定时任务小于 10 秒的任务，才只有 5 个。通过二分的方法，逐个定时任务干掉，让这些定时任务一个个都不跑，看哪个定时任务不跑就没有内存泄露，就可以定位到具体的模块。了解到是哪个模块就可以快速了解到具体原因。如果开始使用这个方法，可以在一天内完成，而不是花了两周时间

这就是本次我用 dotnet 6 在 Win7 系统上运行，由于用到了诡异的方式实现的逻辑，导致了触发了一个系统组件或者是 dotnet 底层的坑，让应用内存泄露了，我记录了调试的过程，以及调试使用的工具，让大家看的更加无聊

更多请看

[ServicePointManager Class (System.Net) Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/api/system.net.servicepointmanager?view=net-6.0&WT.mc_id=WD-MVP-5003260 )

[无法连接到一台服务器升级到.NET Framework 4.6 后使用 ServicePointManager 或 SslStream Api](https://support.microsoft.com/zh-cn/topic/%E6%97%A0%E6%B3%95%E8%BF%9E%E6%8E%A5%E5%88%B0%E4%B8%80%E5%8F%B0%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%8D%87%E7%BA%A7%E5%88%B0-net-framework-4-6-%E5%90%8E%E4%BD%BF%E7%94%A8-servicepointmanager-%E6%88%96-sslstream-api-1e3a9788-ab0d-7794-204b-6c4678bc5ed5?WT.mc_id=WD-MVP-5003260 )

[CLR Exception E0434352 Microsoft Docs](https://docs.microsoft.com/en-us/shows/Inside/E0434352?WT.mc_id=WD-MVP-5003260 )

[EmptyWorkingSet function (psapi.h) - Win32 apps Microsoft Docs](https://docs.microsoft.com/en-us/windows/win32/api/psapi/nf-psapi-emptyworkingset?WT.mc_id=WD-MVP-5003260 )

[使用 ProcDump 解决 VMM 服务问题 - Virtual Machine Manager Microsoft Docs](https://docs.microsoft.com/zh-cn/troubleshoot/system-center/vmm/troubleshoot-vmm-service-issues-with-procdump?WT.mc_id=WD-MVP-5003260 )

[ProcDump - Windows Sysinternals Microsoft Docs](https://docs.microsoft.com/zh-cn/sysinternals/downloads/procdump?WT.mc_id=WD-MVP-5003260 )

[GFlags - Windows drivers Microsoft Docs](https://docs.microsoft.com/zh-cn/windows-hardware/drivers/debugger/gflags?WT.mc_id=WD-MVP-5003260 )

[CertGetCertificateChain function (wincrypt.h) - Win32 apps Microsoft Docs](https://docs.microsoft.com/en-us/windows/win32/api/wincrypt/nf-wincrypt-certgetcertificatechain?WT.mc_id=WD-MVP-5003260 )


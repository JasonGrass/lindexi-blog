---
title: "dotnet 为什么开源的运行时仓库代码减少使用 Linq 语句"
pubDatetime: 2020-08-24 06:21:49
modDatetime: 2024-05-20 08:22:04
slug: dotnet-为什么开源的运行时仓库代码减少使用-Linq-语句
description: "dotnet 为什么开源的运行时仓库代码减少使用 Linq 语句"
tags:
  - dotnet
---




在 dotnet 开源的 runtime 运行时仓库里面，有微软的大佬说运行时仓库的代码应该减少使用 Linq 语句，那这又是为什么呢

<!--more-->


<!-- CreateTime:2020/8/24 14:21:49 -->



微软的 [Jan Kotas](https://github.com/jkotas) 大佬说了下面这段话，大概意思就是减少在运行时库里减少对 Linq 的使用

```
Linq maybe saves some allocations, but it comes with other overheads and much larger static footprint so it is not a clear winner. We tend to avoid Linq in the runtime libraries implementation.
```

而 [Günther Foidl](https://github.com/gfoidl ) 小伙伴就帮我问了一句为什么，难道是将会让单文件的体积，也就是输出的二进制文件体积比较大？

其实本质原因是启动时间，因此 Linq 将会需要创建很多泛形的类型

```
Startup time too. Linq tends to create a lot of generic type instantiations.
```

详细还请看 GitHub 的对话 [https://github.com/dotnet/runtime/pull/41137#discussion_r474742180](https://github.com/dotnet/runtime/pull/41137#discussion_r474742180)

因此在业务层依然可以使用 Linq 的，放心，没有性能问题

只是运行时库想要减少 JIT 创建泛形的类型的时间，因此减少使用而已

当然，本文只是裁几段话，没有很具体上下文含义。因此还请小伙伴阅读原文 [Reduce memory allocations for Process.GetProcessesByName by Serg046 · Pull Request #41137 · dotnet/runtime](https://github.com/dotnet/runtime/pull/41137 )

上面这个 PR 其实是我提出的一个问题，在调用 GetProcessesByName 的时候，是否可以减少一些内存的分配。尽管在获取进程的时候，性能是在获取的本机代码，但是多申请的内存是影响未来。这个意思是在调用这个方法的代码了解到这里的性能比较渣，因此将会有预期。而申请的内存，需要后续进行内存释放，这不是预期的，因此多申请内存影响的是之后。详细请看 [Can the GetProcessesByName method reduce the number of arrays and Process objects created? · Issue #40768 · dotnet/runtime](https://github.com/dotnet/runtime/issues/40768 )


---
title: "dotnet C# 反射扫描程序集所有类型会不会触发类型静态构造函数"
pubDatetime: 2021-10-15 00:55:16
modDatetime: 2024-05-20 08:22:03
slug: dotnet-C-反射扫描程序集所有类型会不会触发类型静态构造函数
description: "dotnet C# 反射扫描程序集所有类型会不会触发类型静态构造函数"
tags:
  - dotnet
  - C#
---




在 dotnet 里面，有很多框架都喜欢扫描程序集进行初始化逻辑，在扫描程序集的所有类型的时候，相当于碰到所有类型。而某个类型的静态构造函数将会在某个类型被使用之前被 CLR 调用，那么扫描类型是否会触发此类型的静态构造函数的调用？答案是不会的

<!--more-->


<!-- CreateTime:2021/10/15 8:55:16 -->

<!-- 发布 -->

如下面的简单的例子，创建一个 Foo 的类型，此类型包含静态构造函数。在此静态构造函数加上输出，通过控制台输出可以了解是否有触发静态构造函数

```csharp
    class Foo
    {
        static Foo()
        {
            Console.WriteLine("Foo");
        }
    }
```

接下来方式获取此 Foo 类型看是否会触发静态构造函数

```csharp
var type = typeof(Foo);
```

执行代码，可以发现 Foo 是没有被触发的

接下来尝试扫描整个程序集，获取所有类型，如下面代码

```csharp
            foreach (var t in typeof(Program).Assembly.GetTypes())
            {
                Console.WriteLine(t.FullName);
            }
```

也可以发现没有触发静态构造函数

本文所有代码放在 [github](https://github.com/lindexi/lindexi_gd/tree/ea40ad3aa116f7ad598943eff59b7b0e9d661e18/BerharniheHurlahereho) 和 [gitee](https://gitee.com/lindexi/lindexi_gd/tree/ea40ad3aa116f7ad598943eff59b7b0e9d661e18/BerharniheHurlahereho) 欢迎访问

可以通过如下方式获取本文代码

先创建一个空文件夹，接着使用命令行 cd 命令进入此空文件夹，在命令行里面输入以下代码，即可获取到本文的代码

```
git init
git remote add origin https://gitee.com/lindexi/lindexi_gd.git
git pull origin ea40ad3aa116f7ad598943eff59b7b0e9d661e18
```

以上使用的是 gitee 的源，如果 gitee 不能访问，请替换为 github 的源

```
git remote remove origin
git remote add origin https://github.com/lindexi/lindexi_gd.git
```

获取代码之后，进入 BerharniheHurlahereho 文件夹


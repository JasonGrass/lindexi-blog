---
title: "dotnet C# 如果在构造函数抛出异常 析构函数是否会执行"
pubDatetime: 2021-06-17 12:10:18
modDatetime: 2024-05-20 08:22:03
slug: dotnet-C-如果在构造函数抛出异常-析构函数是否会执行
description: "dotnet C# 如果在构造函数抛出异常 析构函数是否会执行"
tags:
  - dotnet
  - C#
---




假设在某个类型的构造函数里面抛出了异常，那么这个对象的析构函数是否会执行

<!--more-->


<!-- CreateTime:2021/6/17 20:10:18 -->

<!-- 发布 -->

如下面代码

```csharp
        private void F1()
        {
            try
            {
                _ = new Foo();
            }
            catch
            {
               // 忽略
            }
        }

    class Foo
    {
        public Foo()
        {
            throw new Exception("lindexi is doubi");
        }

        ~Foo()
        {
        }
    }
```

请问以上代码的 `~Foo` 是否可以在垃圾回收执行，或者说在构造函数里面抛出异常，是否这个对象可以被垃圾回收

试试以下代码，然后在 `~Foo` 添加断点

```csharp
        static void Main(string[] args)
        {
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;

            var program = new Program();
            program.F1();

            GC.Collect();
            GC.WaitForFullGCComplete();
            GC.Collect();

            Task.Delay(1000).Wait();

            Console.WriteLine("Hello World!");
        }
```

其实可以看到，可以进入 `~Foo` 的代码。原因是在 .NET 运行时，是先创建出对象，然后再调用对象的构造函数。而在创建出对象时，此对象就需要被加入垃圾回收，加入垃圾回收，自然就会调用到析构函数

那为什么即使在构造函数里面抛出异常，没有构造成功，也需要在垃圾回收调用析构函数。是因为构造函数也不一定是一句话都没有跑的，例如在构造函数里面已分配了一些非托管的内存，然后再抛出异常，自然就期望在析构函数可以释放分配的内存，也就是期望调用析构函数

本文代码还请到 [github](https://github.com/lindexi/lindexi_gd/tree/3f16a1492f1d655ad5356e65d476c3c91b129844/HojeneceabuHallwhallhebo) 或 [gitee](https://gitee.com/lindexi/lindexi_gd/tree/3f16a1492f1d655ad5356e65d476c3c91b129844/HojeneceabuHallwhallhebo) 上阅读代码

可以通过如下方式获取本文的源代码，先创建一个空文件夹，接着使用命令行 cd 命令进入此空文件夹，在命令行里面输入以下代码，即可获取到本文的代码

```
git init
git remote add origin https://gitee.com/lindexi/lindexi_gd.git
git pull origin 3f16a1492f1d655ad5356e65d476c3c91b129844
```

以上使用的是 gitee 的源，如果 gitee 不能访问，请替换为 github 的源

```
git remote remove origin
git remote add origin https://github.com/lindexi/lindexi_gd.git
```

获取代码之后，进入 HojeneceabuHallwhallhebo 文件夹


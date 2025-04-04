---
title: "dotnet 测试 Mutex 的 WaitOne 是否保持进入等待的顺序先进先出"
pubDatetime: 2024-01-31 11:36:13
modDatetime: 2024-05-20 08:22:04
slug: dotnet-测试-Mutex-的-WaitOne-是否保持进入等待的顺序先进先出
description: "dotnet 测试 Mutex 的 WaitOne 是否保持进入等待的顺序先进先出"
tags:
  - dotnet
---




本文记录我测试 dotnet 里面的 Mutex 锁，在多线程进入 WaitOne 等待时，进行释放锁时，获取锁执行权限的顺序是否与进入 WaitOne 等待的顺序相同。测试的结果是 Mutex 的 WaitOne 是乱序的，不应该依赖 Mutex 的 WaitOne 做排队顺序

<!--more-->


<!-- CreateTime:2024/1/31 19:36:13 -->

<!-- 发布 -->
<!-- 博客 -->

以下是测试程序代码

```csharp
var taskList = new List<Task>();
var mutex = new Mutex(false);
var locker = new object();
mutex.WaitOne();

var autoResetEvent = new AutoResetEvent(false);

for (int i = 0; i < 100; i++)
{
    var n = i;
    taskList.Add(Task.Run(() =>
    {
        autoResetEvent.Set();

        mutex.WaitOne();

        lock (locker)
        {
            Console.WriteLine(n);
        }

        mutex.ReleaseMutex();
    }));

    autoResetEvent.WaitOne();
}

mutex.ReleaseMutex();
Task.WaitAll(taskList.ToArray());
```

运行之后输出是乱序。证明 Mutex 的 WaitOne 没有保证获取锁出来的顺序是按照进入的顺序的，没有保证先进先出

本文以上代码放在[github](https://github.com/lindexi/lindexi_gd/tree/c255d512b09862d291b1a5a3fb921689b0b04a58/RijallcijiDuqewerbu) 和 [gitee](https://gitee.com/lindexi/lindexi_gd/tree/c255d512b09862d291b1a5a3fb921689b0b04a58/RijallcijiDuqewerbu) 欢迎访问

可以通过如下方式获取本文的源代码，先创建一个空文件夹，接着使用命令行 cd 命令进入此空文件夹，在命令行里面输入以下代码，即可获取到本文的代码

```
git init
git remote add origin https://gitee.com/lindexi/lindexi_gd.git
git pull origin c255d512b09862d291b1a5a3fb921689b0b04a58
```

以上使用的是 gitee 的源，如果 gitee 不能访问，请替换为 github 的源。请在命令行继续输入以下代码

```
git remote remove origin
git remote add origin https://github.com/lindexi/lindexi_gd.git
git pull origin c255d512b09862d291b1a5a3fb921689b0b04a58
```

获取代码之后，进入 RijallcijiDuqewerbu 文件夹

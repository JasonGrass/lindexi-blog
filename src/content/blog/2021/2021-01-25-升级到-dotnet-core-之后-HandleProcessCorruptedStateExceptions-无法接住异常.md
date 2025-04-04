---
title: "升级到 dotnet core 之后 HandleProcessCorruptedStateExceptions 无法接住异常"
pubDatetime: 2021-01-25 00:48:37
modDatetime: 2024-05-20 08:22:06
slug: 升级到-dotnet-core-之后-HandleProcessCorruptedStateExceptions-无法接住异常
description: "升级到 dotnet core 之后 HandleProcessCorruptedStateExceptions 无法接住异常"
tags:
  - dotnet
---




这是 dotnet core 的破坏性改动之一，在 dotnet framework 里面，可以使用 HandleProcessCorruptedStateExceptionsAttribute 接住非托管层抛出的异常，如 C++ 异常等。但是这个功能在 dotnet core 下存在行为的变更，从 .NET Core 1.0 开始，损坏进程状态异常无法由托管代码进行处理。 公共语言运行时不会将损坏进程状态异常传递给托管代码

<!--more-->


<!-- CreateTime:2021/1/25 8:48:37 -->

<!-- 发布 -->

如果逻辑代码完全使用 C# 实现，那么应用程序可以称为是安全的。这里的安全指的是内存安全。这是 dotnet 的一个优势，在于异常处理上，和 C++ 等的异常处理不同的是，很少会有异常能让整个程序闪退。可以很方便在应用程序里面接住软件运行异常，然后通过各个方法让软件继续执行

但如果 C# 调用了 C++ 的库，那就不好玩了，这就意味着如果 C++ 的库如果实现不够好的话，那么这个库是能带着整个应用程序闪退的。而有趣的是，其实我到现在还没遇到几个团队写出的 C++ 库是稳定的，基本上通过我的 DUMP 分析可以看到，每多加一个 C++ 库，软件的稳定性就下降一半。好在，有一些 C++ 库抛出来的异常，咱勉强还是能接住的，至少不会让整个应用程序就闪退了

接住 C++ 异常的其中一个方法就是通过 HandleProcessCorruptedStateExceptions 特性，在方法上面标记 HandleProcessCorruptedStateExceptions 特性，此时在方法里面使用 try catch 是可以接住大部分的 C++ 异常的，如 System.AccessViolationException 异常

请看下面代码

```csharp
        [HandleProcessCorruptedStateExceptions]
        static void Main(string[] args)
        {
            try
            {
                Console.WriteLine(HeederajiYeafalludall());
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }

        [DllImport("BeyajaydahifallChecheecaifelwarlerenel.dll")]
        static extern Int16 HeederajiYeafalludall();
```

上面代码的 HeederajiYeafalludall 方法是由 BeyajaydahifallChecheecaifelwarlerenel.dll 提供的，这是一个由 C++ 写的库，在这里面的实现将会出现越界

```C++
extern "C" __declspec(dllexport) int HeederajiYeafalludall() 
{
    int* p = (int*)123;
    while (true)
    {
        *p = 123;
        p++;
    }

    return 123;
}
```

在标记了 HandleProcessCorruptedStateExceptionsAttribute 特性之后，将可以看到断点能进入到 catch 代码里，而且程序不会闪退

但是这个机制在 dotnet core 就跑不起来了，根据 [从 .NET Framework 到 .NET Core 的中断性变更](https://docs.microsoft.com/zh-cn/dotnet/core/compatibility/fx-core?WT.mc_id=WD-MVP-5003260) 文档，可以看到在 .NET Core 1.0 开始，损坏进程状态异常无法由托管代码进行处理，将上面的 C# 代码切换到 dotnet core 下执行，此时将会发现不会进入到 catch 的代码，应用程序将会退出

大家可以尝试使用我放在 [github](https://github.com/lindexi/lindexi_gd/tree/9bf58ca4/BeyajaydahifallChecheecaifelwarlerenel ) 的代码进行测试，切换框架为 .NET Framework 和 .NET Core 比较这里的行为


那现在有什么办法在 .NET Core 里，包括 .NET 6 或 .NET 7 等处理这些不安全代码的错误？现在官方给出的唯一方法只有是通过 `COMPlus_legacyCorruptedStateExceptionsPolicy` 环境变量配置，做法就是在启动咱的 .NET 进程之前，先设置环境变量

```
set COMPlus_legacyCorruptedStateExceptionsPolicy=1
AccessViolationExceptionTest.exe // 咱的应用
```

或者是启动之后，设置环境变量再重启

```csharp
Environment.SetEnvironmentVariable("COMPlus_legacyCorruptedStateExceptionsPolicy", "1");
Process.Start("AccessViolationExceptionTest.exe"); // 咱的应用
```

或者是干脆设置到用户的全局环境变量里面，再或者是自己修改 AppHost 代码使其在运行 .NET Host 之前设置环境变量

如果在自己的应用代码跑起来之后设置，如在 C# 的 Main 函数设置，这是无效的。因为读取配置的是在 .NET CLR 层，只读取一次，因此在 C# 的 Main 函数设置将会在 CLR 读取配置之后，从而无效

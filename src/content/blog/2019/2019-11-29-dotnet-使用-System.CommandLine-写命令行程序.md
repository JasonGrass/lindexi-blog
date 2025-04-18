---
title: "dotnet 使用 System.CommandLine 写命令行程序"
pubDatetime: 2019-11-29 00:33:49
modDatetime: 2024-05-20 08:22:04
slug: dotnet-使用-System.CommandLine-写命令行程序
description: "dotnet 使用 System.CommandLine 写命令行程序"
tags:
  - dotnet
---




在写命令行程序的时候，会遇到命令行解析的问题，以及参数的使用和规范化等坑。现在社区开源了命令行项目，可以帮助小伙伴快速开发命令行程序，支持自动的命令行解析和规范的参数

<!--more-->


<!-- CreateTime:2019/11/29 8:33:49 -->


我写过一篇关于命令行解析的博客[C＃命令行解析工具](https://blog.lindexi.com/post/C-%E5%91%BD%E4%BB%A4%E8%A1%8C%E8%A7%A3%E6%9E%90%E5%B7%A5%E5%85%B7.html ) 但是这个方法不是很好用

在社区找到了 [System.CommandLine](https://github.com/dotnet/command-line-api) 这是一个还在开发过程的很好用的一个库，里面用了很多很黑的写法

我创建了一个项目，我删除了原来的 Main 函数，使用下面的代码替换原来的 Main 函数，然后居然是可以编译通过运行的

```csharp
        static void Main(string name, string text)
        {
            Console.WriteLine($"{name}{text}");
        }
```

当然在开始之前我需要安装两个 Nuget 库

- System.CommandLine.DragonFruit
- System.CommandLine.Rendering

可以通过创建一个 dotnet core 项目，编辑项目文件，添加下面代码

```csharp
  <ItemGroup>
    <PackageReference Include="System.CommandLine.DragonFruit" Version="0.2.0-alpha.19174.3" />
    <PackageReference Include="System.CommandLine.Rendering" Version="0.2.0-alpha.19174.3" />
  </ItemGroup>
```

现在尝试使用 dotnet 命令行运行，请使用下面代码

```csharp
dotnet run -- --name 林德熙 --text 是逗比
```

在 dotnet 命令使用 `--` 分割调用的参数，也就是在 `--` 后面的参数将会传递到程序里面

于是就相当于运行了测试项目，传入参数 `--name 林德熙 --text 是逗比` 可以看到输出

```csharp
林德熙是逗比
```

这个例子的项目请看[测试程序](https://github.com/lindexi/lindexi_gd/tree/48f39319a18cc99f0f92a08ac446fd43b193c187/DallairhacelKurbegofa)

当然命令行的参数写法有很多，上面的程序也支持下面的参数

```csharp
dotnet run -- --name:林德熙 --text:是逗比
```

当然一个命令行程序，如果就一个 exe 发给小伙伴，那么小伙伴怎么知道如何使用？在软件工程里面，在这一行默认的就是输入 `--help` 就输出帮助信息

于是我在主函数添加一点注释

```csharp
        /// <summary>
        /// 欢迎访问我的博客 http://blog.lindexi.com 从入门到精通
        /// </summary>
        /// <param name="name">逗比名</param>
        /// <param name="text">逗比</param>
        static void Main(string name, string text)
```

此时输入 `dotnet run -- --help` 就可以看到下面代码

```csharp
DallairhacelKurbegofa:
  欢迎访问我的博客 http://blog.lindexi.com 从入门到精通

Usage:
  DallairhacelKurbegofa [options]

Options:
  --name <NAME>    逗比名
  --text <TEXT>    逗比
  --version        Display version information
```

那么这个库是如何做黑科技让你的主函数可以修改参数的？

打开[System.CommandLine.DragonFruit.targets](https://github.com/dotnet/command-line-api/blob/master/src/System.CommandLine.DragonFruit/targets/System.CommandLine.DragonFruit.targets ) 就可以看到 [GenerateRealEntryPointType](https://github.com/dotnet/command-line-api/blob/166610c56ff732093f0145a2911d4f6c40b786da/src/System.CommandLine.DragonFruit/targets/System.CommandLine.DragonFruit.targets#L13-L20) 修改启动项目

修改 StartupObject 可以指定调用的主函数是哪个类里的

```csharp
    <PropertyGroup>
      <StartupObject>AutoGeneratedProgram</StartupObject>
    </PropertyGroup>
```

创建动态代码写入到 `obj` 文件夹里面的 xx.g.cs 文件，写入下面代码

```csharp
// <auto-generated>This file was created automatically</auto-generated>
using System.CommandLine.DragonFruit;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

[CompilerGenerated]
internal class AutoGeneratedProgram
{
  public static async Task<int> Main(string[] args)
  {
    return await CommandLine.ExecuteAssemblyAsync(
      entryAssembly: typeof(global::AutoGeneratedProgram).Assembly,
      args: args);
  }
}

```

因为运行的启动函数就是 AutoGeneratedProgram 里面的主函数，所以其实你写的主函数不是主函数

如果想自己也修改主函数，请看[Roslyn 通过 NuGet 库修改应用程序入口函数](https://blog.lindexi.com/post/roslyn-%E9%80%9A%E8%BF%87-nuget-%E5%BA%93%E4%BF%AE%E6%94%B9%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F%E5%85%A5%E5%8F%A3%E5%87%BD%E6%95%B0 )

想知道这个库是如何做的，请看源代码[dotnet/command-line-api: System.CommandLine: Command line parsing, invocation, and rendering of terminal output.](https://github.com/dotnet/command-line-api )


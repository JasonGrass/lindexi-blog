---
title: "dotnet 用 SourceGenerator 源代码生成技术实现中文编程语言"
pubDatetime: 2022-10-17 00:06:00
modDatetime: 2024-08-06 12:43:31
slug: dotnet-用-SourceGenerator-源代码生成技术实现中文编程语言
description: "dotnet 用 SourceGenerator 源代码生成技术实现中文编程语言"
tags:
  - Roslyn
  - MSBuild
  - 编译器
  - SourceGenerator
  - 生成代码
---




相信有很多伙伴都很喜欢自己造编程语言，在有现代的很多工具链的帮助下，实现一门编程语言，似乎已不是一件十分困难的事情。我利用 SourceGenerator 源代码生成技术实现了一个简易的中文编程语言，核心原理是将中文编程语言翻译为 C# 语言，从而完成后续的所有对接，完成了最简单的构建和运行。本文将告诉大家这个有趣的方式是如何实现

<!--more-->


<!-- CreateTime:2022/10/17 8:06:00 -->

<!-- 发布 -->
<!-- 标签：Roslyn,MSBuild,编译器,SourceGenerator,生成代码 -->

开始之前，先给大家看看效果

<!-- ![](images/img-dotnet 用 SourceGenerator 源代码生成技术实现中文编程语言0.png) -->
![](images/img-modify-742d4760246e45fd188baa86a6570fd4.jpg)

这是我设计的 csg 格式（Chinese programming language by SourceGenerator）的中文编程语言，设计上完全参考（抄袭）了中文宏的实现方式。原本我是考虑抄袭 易语言 的，但是 易语言 更贴近是 VB 系的方式（？ 似乎也不能这么说）感觉不是我随便就能写出来的。我只是想着学习源代码生成技术，顺带测试一下自己能否很随意的就写出一个新的编程语言。当然，测试结果是我不能很随意就写出一个新的编程语言

本文所设计的 csg 格式的中文编程语言，仅仅只能用来做演示使用，丝毫不能用在实际项目里。本文仅仅只是用来告诉大家一个简易的方法来完成自己创建一门编程语言

本文所设计的 csg 格式的中文编程语言，能够和 C# 完美的结合，毕竟实际参与构建的就是 C# 代码。我在本文的最后给出了所有的代码的下载方式，要求在 VS 2022 较新版本上才能成功运行

以下是 csg 的代码，也是本文效果里所使用的代码

```csharp
引用命名空间 系统;

定义命名空间 这是一个命名空间;

类型 这是测试类型
{
    公开的 静态的 无返回值类型的 测试输出()
    {
        控制台.输出一行文本("你好");
    }
}
```

可以看到，这是全部采用中文编写的一段代码。相信大家看到上面的代码，在熟悉 C# 的前提下，能反应过来这段代码的作用

尽管这是采用中文编写的，但不代表着任何人都能读懂这段代码的作用。因为这仅仅只是使用中文对 C# 的关键词进行翻译而已。同理的，也不是任何会英文的人都能读懂代码

那以上代码可以被如何调用呢？可以完全和 C# 交互，被 C# 直接调用，如以下代码，在 C# 代码的主函数里面调用 `测试输出()` 方法。这是利用了 C# 里面允许标识符支持 `Utf-8` 编写，而不仅仅是 ASCII 编码的字符。换句话说是使用中文作用方法名、类名、属性名等，在 C# 里都是合法的

```csharp
// Program.cs

using 这是一个命名空间;

这是测试类型.测试输出();
```

以上是采用 C# 9.0 新特性——顶级语句，无须加上类型和主函数定义，直接编写代码体即主函数执行代码体的。如此可以极大简化代码量

执行代码，可以看到控制台输出了 `你好` 字符串，证明了代码的构建执行正常

接下来将告诉大家实现的原理和实现的细节方法，在开始之前，期望大家已对 C# dotnet 的基础知识熟悉，对 dotnet 整个构建过程熟悉，了解源代码生成技术，本文将略过基础知识

先新建两个项目，分别是 JelallnalukebaqeLairjaybearjair 和 JelallnalukebaqeLairjaybearjair.Analyzers 两个控制台项目。其中 JelallnalukebaqeLairjaybearjair 项目就是用来编写中文编程的项目。而 JelallnalukebaqeLairjaybearjair.Analyzers 是一个分析器项目，将在此项目里编写源代码生成逻辑，用来支持将编写的中文代码转换为 C# 代码，从而参与后续的构建和执行

在 JelallnalukebaqeLairjaybearjair 项目里，将对 `JelallnalukebaqeLairjaybearjair.Analyzers` 项目进行引用，从而用来启动此分析器的内容。添加引用时设置 OutputItemType 为 Analyzer 类型，且设置不使用不引用 JelallnalukebaqeLairjaybearjair.Analyzers 程序集。引用之后的 JelallnalukebaqeLairjaybearjair 项目的 csproj 项目文件的引用代码如下

```xml
  <ItemGroup>
    <ProjectReference Include="..\JelallnalukebaqeLairjaybearjair.Analyzers\JelallnalukebaqeLairjaybearjair.Analyzers.csproj" OutputItemType="Analyzer" ReferenceOutputAssembly="false" />
  </ItemGroup>
```

在本文的例子里，在 JelallnalukebaqeLairjaybearjair 项目里只有两个文件，一个是 Program.cs 文件，一个是 `这是测试类型.csg` 文件。其中 Program.cs 文件就是传统的 C# 项目，采用 C# 9.0 的顶层语句，编写的代码如下

```csharp
using 这是一个命名空间;

这是测试类型.测试输出();
```

而 `这是测试类型.csg` 文件里的内容就是本文开头的中文代码内容

接着，为了让分析器能了解到 `这是测试类型.csg` 文件是需要参与构建的，额外在 JelallnalukebaqeLairjaybearjair 的 csproj 项目文件里面添加 AdditionalFiles 列表。通过 AdditionalFiles 列表，可以在后续的分析器里面，在增量构建里，通过 AdditionalTextsProvider 监听获取到这部分文件内容。编辑 JelallnalukebaqeLairjaybearjair 的 csproj 项目文件，添加如下代码

```xml
  <ItemGroup>
      <AdditionalFiles Include="这是测试类型.csg" />
  </ItemGroup>
```

以上就是 JelallnalukebaqeLairjaybearjair 项目的所有文件和核心逻辑了。完成了准备工作之后，开始编写 `JelallnalukebaqeLairjaybearjair.Analyzers` 分析器项目。为了能够在 Visual Studio 里面加载上分析器，以及同时在 dotnet 命令行里加载分析器，设置 TargetFramework 为 .NET Standard 2.0 版本。因为 Visual Studio 采用的是 .NET Framework 运行时，而 dotnet 命令行工具采用的是 .NET Core 运行时，于是分析器采用 .NET Standard 2.0 版本就能刚好在这两个运行时加载

为了编写分析器项目，按照惯例，还需要引用必要的 NuGet 包。这里需要引用 Microsoft.CodeAnalysis.Analyzers 和 Microsoft.CodeAnalysis.CSharp 程序集

编辑 JelallnalukebaqeLairjaybearjair.Analyzers 的 csproj 项目文件为如下代码

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
    <AppendTargetFrameworkToOutputPath>false</AppendTargetFrameworkToOutputPath>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.CodeAnalysis.Analyzers" Version="3.3.3" PrivateAssets="all" />
    <PackageReference Include="Microsoft.CodeAnalysis.CSharp" Version="4.2.0" PrivateAssets="all" />
  </ItemGroup>

</Project>
```

完成了安装库之后，即可开始编写核心代码。需求是将 csg 格式的中文编程语言，转换为 C# 代码，从而参与后续的构建和执行

新建一个叫 CsgIncrementalGenerator 类型，继承 IIncrementalGenerator 接口，顺带加上 GeneratorAttribute 特性标识这是生成 C# 代码的。类型名可以自己发挥，只是本文作为例子叫成 CsgIncrementalGenerator 而已

```csharp
    [Generator(LanguageNames.CSharp)]
    public class CsgIncrementalGenerator : IIncrementalGenerator
    {
        // 忽略代码
    }
```

继承 IIncrementalGenerator 接口，需要实现 `public void Initialize(IncrementalGeneratorInitializationContext context)` 方法。如 [尝试 IIncrementalGenerator 进行增量 Source Generator 生成代码](https://blog.lindexi.com/post/%E5%B0%9D%E8%AF%95-IIncrementalGenerator-%E8%BF%9B%E8%A1%8C%E5%A2%9E%E9%87%8F-Source-Generator-%E7%94%9F%E6%88%90%E4%BB%A3%E7%A0%81.html ) 博客所述，在进行增量构建时，只有 Initialize 方法。在 Initialize 方法里面，加上分析器感兴趣的文件以及对这些文件的处理方法即可

咱这里的中文编程语言采用后缀名为 `.csg` 的文件，在 JelallnalukebaqeLairjaybearjair 项目里也将 csg 文件在 csproj 项目文件里添加到 AdditionalFiles 列表里面。在 Initialize 方法里面，先告诉分析器感兴趣的文件就是 csg 文件，只有有 csg 文件的变更，那将自动触发更新逻辑，在更新逻辑里执行实际的转换代码

```csharp
        public void Initialize(IncrementalGeneratorInitializationContext context)
        {
            var csgFileIncrementalValuesProvider =
            context.AdditionalTextsProvider.Where(t =>
                string.Equals(Path.GetExtension(t.Path), ".csg", StringComparison.OrdinalIgnoreCase));
            // 忽略文件
        }
```

以上代码的 AdditionalTextsProvider 不是实际立刻提供了文件，而是用来编写文件变更时的过滤命令，这也是增量代码生成的核心逻辑。通过编写过滤命令的方式，可以减少代码生成实际转换逻辑的执行次数，只有在遇到感兴趣的文件的变更的时候才会触发实际的执行逻辑，从而极大的提升性能

接下来将此过滤条件加入注册，在过滤条件 `csgFileIncrementalValuesProvider` 能过滤出有文件变更时，将执行转换代码。转换代码的输入是 csg 中文编程语言的代码文件，输出是加入到构建的 C# 的代码字符串

通过 RegisterSourceOutput 方法进行注册，注册在满足 `csgFileIncrementalValuesProvider` 过滤条件时，支持添加额外的参与构建代码

```csharp
            context.RegisterSourceOutput(csgFileIncrementalValuesProvider, (sourceProductionContext, csg) =>
            {
                // 忽略代码
            });
```

在 RegisterSourceOutput 的开始，是先注册框架部分的代码，如上面的中文代码，可以看到用到了一些需要预设的框架代码，例如 `控制台.输出一行文本("你好");` 这句代码就需要先有预设的名为 `控制台` 的类型。先添加框架代码如下

```csharp
            context.RegisterSourceOutput(csgFileIncrementalValuesProvider, (sourceProductionContext, csg) =>
            {
                AddFrameworkCode(sourceProductionContext);
                // 忽略代码
            });
```

这里拿到的 `sourceProductionContext` 参数，可以用来设置构建的生成代码。在 AddFrameworkCode 里面，添加框架需要的预设代码，代码如下

```csharp
        /// <summary>
        /// 添加框架代码
        /// </summary>
        /// <param name="sourceProductionContext"></param>
        private static void AddFrameworkCode(SourceProductionContext sourceProductionContext)
        {
            string consoleText = @"
using System;

namespace 系统;

static class 控制台
{
    public static void 输出一行文本(string 文本)
    {
        Console.WriteLine(文本);
    }
}";
            sourceProductionContext.AddSource("DefaultConsole", consoleText);
        }
```

本文这里只添加了用来演示的名为 `控制台` 的类型，添加方法如上代码。以上代码将会在项目里，添加一个叫做 `DefaultConsole` 的生成代码，如此即可让中文编程代码里有可以使用的控制台辅助类型

接下来是获取到发生变更的 csg 中文编程语言的文件的内容，用来转换为 C# 代码

```csharp
            context.RegisterSourceOutput(csgFileIncrementalValuesProvider, (sourceProductionContext, csg) =>
            {
                AddFrameworkCode(sourceProductionContext);

                var csgSource = csg.GetText();
                if (csgSource == null) return;
                // 忽略代码
            });
```

通过 GetText 即可获取到其文本内容

获取到内容之后，需要将 csg 中文编程语言的内容转换为 C# 代码字符串内容。我这里抄袭了中文宏的方法，使用关键词替换。本文这里只是替换了演示所需要的关键词，没有对其他的关键词进行替换

```csharp
                var keyDictionary = new Dictionary<string, string>()
                {
                    {"引用命名空间 ","using "},
                    {"定义命名空间 ","namespace "},
                    {"类型 ","class "},
                    {"公开的 ","public "},
                    {"静态的 ","static "},
                    {"无返回值类型的 ","void "},
                };

                var stringBuilder = new StringBuilder();
                foreach (var textLine in csgSource.Lines)
                {
                    var text = textLine.ToString();
                    if (!string.IsNullOrEmpty(text))
                    {
                        foreach (var keyValuePair in keyDictionary)
                        {
                            text = text.Replace(keyValuePair.Key, keyValuePair.Value);
                        }
                    }

                    stringBuilder.AppendLine(text);
                }
```

如此一行行进行替换，即可拿到一段 C# 代码

将 `stringBuilder` 里的 C# 代码作为生成代码，添加到 `sourceProductionContext` 用于参与构建

```csharp
                sourceProductionContext.AddSource(Path.GetFileNameWithoutExtension(csg.Path) + ".g.cs", stringBuilder.ToString());
```

添加的时候，设置了 `hintName` 参数为 `Path.GetFileNameWithoutExtension(csg.Path) + ".g.cs"` 如此即可在相同的一个 csg 文件变更的时候，生成的代码可以替换旧的生成代码。生成代码之间的替换就是采用 `hintName` 参数作为判断条件

如此即可完成将 csg 中文编程语言转换为 C# 代码，且加入到构建里

本文只是作为一个演示，告诉大家可以利用 Source Generator 技术，将中文编程语言转换为 C# 代码，方便的加入到构建里，从而复用整个 dotnet 的机制

本文的代码放在[github](https://github.com/lindexi/lindexi_gd/tree/bba0c728bbc1d850f6f1929ab14a42e995e23e3b/JelallnalukebaqeLairjaybearjair) 和 [gitee](https://gitee.com/lindexi/lindexi_gd/tree/bba0c728bbc1d850f6f1929ab14a42e995e23e3b/JelallnalukebaqeLairjaybearjair) 欢迎访问

可以通过如下方式获取本文的源代码，先创建一个空文件夹，接着使用命令行 cd 命令进入此空文件夹，在命令行里面输入以下代码，即可获取到本文的代码

```
git init
git remote add origin https://gitee.com/lindexi/lindexi_gd.git
git pull origin bba0c728bbc1d850f6f1929ab14a42e995e23e3b
```

以上使用的是 gitee 的源，如果 gitee 不能访问，请替换为 github 的源。请在命令行继续输入以下代码

```
git remote remove origin
git remote add origin https://github.com/lindexi/lindexi_gd.git
git pull origin bba0c728bbc1d850f6f1929ab14a42e995e23e3b
```

获取代码之后，进入 JelallnalukebaqeLairjaybearjair 文件夹

更多增量构建请看 [尝试 IIncrementalGenerator 进行增量 Source Generator 生成代码](https://blog.lindexi.com/post/%E5%B0%9D%E8%AF%95-IIncrementalGenerator-%E8%BF%9B%E8%A1%8C%E5%A2%9E%E9%87%8F-Source-Generator-%E7%94%9F%E6%88%90%E4%BB%A3%E7%A0%81.html )

更多编译器、代码分析、代码生成相关博客，请参阅我的 [博客导航](https://blog.lindexi.com/post/%E5%8D%9A%E5%AE%A2%E5%AF%BC%E8%88%AA.html )

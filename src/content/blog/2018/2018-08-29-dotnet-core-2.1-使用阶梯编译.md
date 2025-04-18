---
title: "dotnet core 2.1 使用阶梯编译"
pubDatetime: 2018-08-29 00:49:12
modDatetime: 2024-05-20 08:22:03
slug: dotnet-core-2.1-使用阶梯编译
description: "dotnet core 2.1 使用阶梯编译"
tags:
  - dotnetcore
---




在 dotnet core 2.1 可以使用阶梯编译的方法，从 dotnet framework 开始，在代码的所有方法在第一次进入的时候就需要使用 JIT 进行编译为本机的代码。可以看到代码是在第一次访问时编译的，所以编译的速度就影响了软件的运行速度。
在 dotnet core 2.1 使用的阶梯编译就是为了解决软件启动的问题

<!--more-->


<!-- CreateTime:2018/8/29 8:49:12 -->

<!-- 标签：dotnetcore -->

## 什么是阶梯编译

在软件启动的过程，可以认为几乎所有的方法都需要进行编译，在 Roslyn 有不同的方式编译，一个是快速编译，使用快速编译的方式会让代码运行速度比较慢。而另一个方式是优化编译，这个编译方式的编译速度比较慢，但是代码运行比较快。

现在在 dotnet core 2.1 就可以使用阶梯编译，在第一次遇到一个函数时就进行快速编译，而之后发现这个方法会频繁访问，就在另一个线程对这个方法进行优化编译，在编译完成再替换原来的入口。这样就可以做到在软件启动的过程使用的是快速编译的方法，通过快速编译的方法提高软件启动的速度，而在方法频繁访问的时候再重新使用优化编译，提高代码运行速度

## 如何打开

最简单的方法是在项目文件添加属性，当然要求先升级一下 dotnet core 2.1 的 sdk 可以到 [dotnet sdk 2.1.300 winx64-CSDN下载](https://download.csdn.net/download/lindexi_gd/10582416 )

打开 `xx.csproj` 这里的 `xx` 就是项目的文件，当然如果看到这个博客，相信大家也知道这是哪个文件。

在这个文件的 `PropertyGroup` 添加 ` <TieredCompilation>true</TieredCompilation>` 就可以打开，请看下面代码，如果看不到代码，请点击[.NET Core Project File with Tiered Compilation Enabled](https://gist.github.com/richlander/53a3c5f0505433b45c83c98db74c5e03#file-tieredcompilation-csproj-xml )

<script src="https://gist.github.com/richlander/53a3c5f0505433b45c83c98db74c5e03.js"></script>

因为这个编译是在软件运行的时候使用 JIT 编译的，所以即使软件已经生成也可以通过`configProperties`打开，请看例子

```diff
  {
+      "runtimeOptions": 
+      {
+        "configProperties": 
+        {
+          "System.Runtime.TieredCompilation": true
+        }
+      },
      "framework": 
      {
        ...
      }
    }
```

如果不想修改文件可以添加环境变量`COMPlus_TieredCompilation=1`打开，具体请看[tiered compilation demo ](https://github.com/aspnet/JitBench/blob/tiered_compilation_demo/README.md )


[Tiered Compilation Preview in .NET Core 2.1 ](https://blogs.msdn.microsoft.com/dotnet/2018/08/02/tiered-compilation-preview-in-net-core-2-1/ )

<!-- 奥利奥\TIM图片20180824091727.jpg -->
![](images/img-5b7f5cdebe8a8.jpg)


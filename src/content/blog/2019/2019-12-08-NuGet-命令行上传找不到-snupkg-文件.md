---
title: "NuGet 命令行上传找不到 snupkg 文件"
pubDatetime: 2019-12-08 07:07:18
modDatetime: 2024-05-20 08:22:03
slug: NuGet-命令行上传找不到-snupkg-文件
description: "NuGet 命令行上传找不到 snupkg 文件"
tags:
  - NuGet
---




在 NuGet 提供符号 NuGet 库的支持，在默认上传将会同时上传符号库。在 NuGet 上传文件将会默认将 snupkg 符号文件上传

<!--more-->


<!-- CreateTime:2019/12/8 15:07:18 -->

<!-- 标签：NuGet -->

让 NuGet 发布默认不上传符号文件的方法是添加参数 NoSymbols 请看代码

```csharp
 nuget push .\bin\release\*.nupkg -Source https://api.nuget.org/v3/index.json -SkipDuplicate -NoSymbols 
```

在 nuget 发布可以给某个文件路径，将这个路径所有文件上传，在上传文件时，将会同步上传符号文件。如果符号文件不存在，建议输出提示

```
File does not exist (.\bin\release\*.snupkg)
```

通过在命令行添加参数不上传外，还可以在创建 NuGet 库创建符号文件，这样就不会提示找不到

在 sdk style 格式的项目文件，添加下面代码，添加之后打包就会创建 snupkg 文件

```xml
<PropertyGroup>
    <IncludeSymbols>true</IncludeSymbols>	
    <SymbolPackageFormat>snupkg</SymbolPackageFormat>	
</PropertyGroup>
```

这里的 PropertyGroup 元素可以添加到 Project 元素下

另一个方法是在命令行打包添加参数

```csharp
dotnet pack -p:IncludeSymbols=true -p:SymbolPackageFormat=snupkg
```

如果使用 msbuild 打包，可以使用下面代码

```csharp
msbuild /t:pack /p:IncludeSymbols=true /p:SymbolPackageFormat=snupkg
```

如果使用 nuget 打包，如对应的 `xx.nuspec` 可以使用下面代码

```csharp
nuget pack MyPackage.nuspec -Symbols -SymbolPackageFormat snupkg
```

[NuGet 符号服务器](https://blog.lindexi.com/post/NuGet-%E7%AC%A6%E5%8F%B7%E6%9C%8D%E5%8A%A1%E5%99%A8.html )

[How to publish NuGet symbol packages using the new symbol package format '.snupkg'](https://docs.microsoft.com/en-us/nuget/create-packages/symbol-packages-snupkg )

在 NuGet 包嵌入 符号文件 的方法是添加 AllowedOutputExtensionsInPackageBuildOutputFolder 属性

```xml
<Project Sdk="Microsoft.NET.Sdk">
 <PropertyGroup>
    <!-- Include symbol files (*.pdb) in the built .nupkg -->
    <AllowedOutputExtensionsInPackageBuildOutputFolder>$(AllowedOutputExtensionsInPackageBuildOutputFolder);.pdb</AllowedOutputExtensionsInPackageBuildOutputFolder>
  </PropertyGroup>
</Project>
```

默认符号文件是放在 snupkg 文件，而不是放在 nupkg 文件，原因是将符号文件放在 nupkg 文件，会让 nupkg 文件太大。如果将符号文件放在 nupkg 文件，那么不需要开发者另外配置符号服务器，就可以拿到符号文件

详细请看 [Roslyn 打包自定义的文件到 NuGet 包](https://blog.lindexi.com/post/Roslyn-%E6%89%93%E5%8C%85%E8%87%AA%E5%AE%9A%E4%B9%89%E7%9A%84%E6%96%87%E4%BB%B6%E5%88%B0-NuGet-%E5%8C%85.html )


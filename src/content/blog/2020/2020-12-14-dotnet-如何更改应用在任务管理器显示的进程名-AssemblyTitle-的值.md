---
title: "dotnet 如何更改应用在任务管理器显示的进程名 AssemblyTitle 的值"
pubDatetime: 2020-12-14 00:36:58
modDatetime: 2024-08-06 12:43:30
slug: dotnet-如何更改应用在任务管理器显示的进程名-AssemblyTitle-的值
description: "dotnet 如何更改应用在任务管理器显示的进程名 AssemblyTitle 的值"
tags:
  - dotnet
---




我有一个应用，我期望他在任务管理器里面显示为 Doubi 这样大家就知道这是一个逗比进程。但是我更改了程序集名，也就是 exe 文件名都没有什么用，因为在任务管理器里面通过 AssemblyTitle 属性决定显示的进程名。本文来告诉大家如何更改 AssemblyTitle 的值

<!--more-->


<!-- CreateTime:2020/12/14 8:36:58 -->

<!-- 发布 -->

在旧版本的 Franken-proj 格式的 csproj 格式里面，在项目都有一个 `Properties\AssemblyInfo.cs` 文件，通过修改这个文件的 AssemblyTitle 属性，就可以更改软件在任务管理器上显示的进程名

```
[assembly: AssemblyTitle("Doubi")]
```

可以自定义这个特性值，我的团队就采用了预编译技术，根据定制版本的不同，修改这个文件返回不同的值

更改之后，可以在任务管理器上看到进程名的更改

<!-- ![](images/img-dotnet 如何更改应用在任务管理器显示的进程名 AssemblyTitle 的值0.png) -->
![](images/img-modify-ac15826f8b63a7cecd226bc4caee237a.jpg)

在更新到新的 VS 2017 的 SDK Style 的 csproj 格式，默认没有给 `Properties\AssemblyInfo.cs` 文件，如果此时大家自己创建一个 `Properties\AssemblyInfo.cs` 文件，那么在构建的时候将会提示 `Error CS0579 Duplicate 'System.Reflection.AssemblyTitleAttribute' attribute` 原因是当前的 AssemblyInfo.cs 是生成的。如果想要加上 `Properties\AssemblyInfo.cs` 文件，就需要在 csproj 上设置不要自动生成 `AssemblyInfo.cs` 文件

```xml
<PropertyGroup>
    <GenerateAssemblyInfo>false</GenerateAssemblyInfo>
</PropertyGroup>
```

在 csproj 文件上添加了上面代码，将不会生成 AssemblyInfo 的所有内容。如果仅仅只是不想生成 AssemblyTitle 属性，那么请将 GenerateAssemblyInfo 属性替换为 GenerateAssemblyTitleAttribute 属性

```xml
<PropertyGroup>
    <GenerateAssemblyTitleAttribute>false</GenerateAssemblyInfo>
</PropertyGroup>
```

但更推荐的做法是在 csproj 上指定 AssemblyTitle 属性，如下面代码

```xml
    <AssemblyTitle>Doubi</AssemblyTitle>
```

以下是全的 csproj 内容，为了方便大家了解上面的代码写在哪

```xml
<Project Sdk="Microsoft.NET.Sdk.WindowsDesktop">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>netcoreapp3.1</TargetFramework>
    <UseWPF>true</UseWPF>
    <AssemblyTitle>Doubi</AssemblyTitle>
  </PropertyGroup>

</Project>
```

设置了 AssemblyTitle 属性，可以在输出的程序集右击属性，在文件属性详细里面看到文件说明就是对应这个属性的内容

这是一个用来给人类友好的属性，因此可以使用空格和中文等

那么这个值最终会放入到输出的 PE 格式的 exe 文件的哪里？其实是放在 Win32 的 Resource 里面

通过 FileAlyzer 工具的辅助，可以在 Reousrce 里面找到 FileDescription 属性

<!-- ![](images/img-dotnet 如何更改应用在任务管理器显示的进程名 AssemblyTitle 的值1.png) -->

![](images/img-modify-68bdcfc6b02a51fd1882b92c70138b9c.jpg)

本文代码放在[github](https://github.com/lindexi/lindexi_gd/tree/18983486/BeehijemwaboHaihafobe)欢迎大家访问



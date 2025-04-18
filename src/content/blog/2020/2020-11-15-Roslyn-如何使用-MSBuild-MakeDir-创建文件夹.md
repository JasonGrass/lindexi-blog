---
title: "Roslyn 如何使用 MSBuild MakeDir 创建文件夹"
pubDatetime: 2020-11-15 11:26:49
modDatetime: 2024-05-20 08:22:03
slug: Roslyn-如何使用-MSBuild-MakeDir-创建文件夹
description: "Roslyn 如何使用 MSBuild MakeDir 创建文件夹"
tags:
  - Roslyn
  - MSBuild
  - 编译器
---




本文告诉大家如何在 MSBuild 里使用 MakeDir 创建文件夹

<!--more-->


<!-- CreateTime:2020/11/15 19:26:49 -->

<!-- 标签：Roslyn,MSBuild,编译器 -->

在 MSBuild 的 Task 内置任务里面，可以使用 MakeDir task 进行创建文件夹，简单的使用方法如下

```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">

    <PropertyGroup>
        <OutputDirectory>\Output\</OutputDirectory>
    </PropertyGroup>

    <Target Name="CreateDirectories">
        <MakeDir Directories="$(OutputDirectory)"/>
    </Target>

</Project>

```

上面代码中，核心逻辑就是 `<MakeDir Directories="$(OutputDirectory)"/>` 用来创建文件夹。有多个文件夹，可以通过 `;` 分割

在 MakeDir task 里面还有一个属性是 `DirectoriesCreated` 属性，这个属性用来输出表示有哪些文件夹创建成功的。也就是说在 Directories 属性里面传入的文件夹列表里面，所有创建成功的都会在 `DirectoriesCreated` 属性输出

读取输出的创建成功的文件夹代码如下

```xml
<Target Name="_WalterlvCreateDirectoryForPacking">
    <MakeDir Directories="$(MSBuildThisFileDirectory)..\bin\$(Configuration)\">
        <Output TaskParameter="DirectoriesCreated" PropertyName="CreatedPackingDirectory" />
    </MakeDir>
</Target>
```

判断文件夹不存在，则创建文件夹的代码可以是如下

```xml
    <PropertyGroup>
        <OutputDirectory>\Output\</OutputDirectory>
    </PropertyGroup>

    <Target Name="CreateDirectories">
        <MakeDir Condition="!Exists('$(OutputDirectory)')"
                 Directories="$(OutputDirectory)" />
    </Target>
```

更多在 MSBuild 编译过程中操作文件和文件夹的细节请看 [在 MSBuild 编译过程中操作文件和文件夹（检查存在/创建文件夹/读写文件/移动文件/复制文件/删除文件夹）walterlv - 吕毅-CSDN博客](https://walterlv.blog.csdn.net/article/details/103760615)

更多请看官方文档 [MakeDir Task - Visual Studio](https://docs.microsoft.com/en-us/visualstudio/msbuild/makedir-task?view=vs-2019)

更多关于 Roslyn 请看 [手把手教你写 Roslyn 修改编译](https://blog.lindexi.com/post/roslyn.html ) 

参见：[Roslyn 入门 - CSDN博客](https://blog.csdn.net/lindexi_gd/category_7945110.html )


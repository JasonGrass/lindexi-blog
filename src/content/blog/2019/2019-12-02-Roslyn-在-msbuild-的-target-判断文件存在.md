---
title: "Roslyn 在 msbuild 的 target 判断文件存在"
pubDatetime: 2019-12-02 00:31:05
modDatetime: 2024-05-20 08:22:03
slug: Roslyn-在-msbuild-的-target-判断文件存在
description: "Roslyn 在 msbuild 的 target 判断文件存在"
tags:
  - Roslyn
---




在使用 msbuild 定义编译时运行的逻辑，可以使用 Exists 判断文件是否存在

<!--more-->


<!-- CreateTime:2019/12/2 8:31:05 -->

<!-- csdn -->

假设需要判断某个文件是否存在，如果存在则执行逻辑，如删除这个文件，可以使用下面代码

```csharp
        <PropertyGroup>
			<SourceProjectPackageFile>SourceProjectPackageFile.txt</SourceProjectPackageFile>
        </PropertyGroup>

		<Delete Files="$(SourceProjectPackageFile)" Condition="Exists($(SourceProjectPackageFile))"></Delete>
```

上面代码就可以用来删除定义的 SourceProjectPackageFile.txt 文件


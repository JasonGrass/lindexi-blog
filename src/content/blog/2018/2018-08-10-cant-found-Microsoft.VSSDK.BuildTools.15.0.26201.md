---
title: "cant found Microsoft.VSSDK.BuildTools.15.0.26201"
pubDatetime: 2018-08-10 11:16:52
modDatetime: 2024-08-06 12:43:26
slug: cant-found-Microsoft.VSSDK.BuildTools.15.0.26201
description: "cant found Microsoft.VSSDK.BuildTools.15.0.26201"
---




如果在vs扩展开发中出现
```csharp
    严重性 代码  说明  项目  文件  行   禁止显示状态
错误      Failed to load 'C:\程序\EncodingNormalior\packages\Microsoft.VSSDK.BuildTools.15.0.26201\tools\VSSDK\bin\VSCT.exe' Assembly. 未能加载文件或程序集“file:///C:\程序\EncodingNormalior\packages\Microsoft.VSSDK.BuildTools.15.0.26201\tools\VSSDK\bin\VSCT.exe”或它的某一个依赖项。系统找不到指定的文件。   EncodingNormalizerVsx
```

<!--more-->


<!-- CreateTime:2018/8/10 19:16:52 -->


找不到一个 packages 的文件，或程序集，那么一般就是 nuget 的坑。

可以打开 EncodingNormalior\packages 文件夹，删除所有的文件，然后重新编译。

如果无法删除，那么关闭 vs 就可以删除，注意看 nuget 是否添加了源，有一些是本地的，需要自己看好。

国内比较好的源： [NuGet镜像上线试运行 - 博客园团队 - 博客园](http://www.cnblogs.com/cmt/p/nuget-mirror.html)

如果在开发vs扩展，参见：VisualStudio 扩展开发，在我的博客 lindexi.oschina.io

现在我的插件放在 [https://marketplace.visualstudio.com/items?itemName=lindexigd.vs-extension-18109](https://marketplace.visualstudio.com/items?itemName=lindexigd.vs-extension-18109)，可以下载，功能：检查项目是否存在编码格式错误的文件，保存一个项目为自己需要格式。

可以使用之前的vs的高级保存，保存当前文件编码。

也可以点击工具选择扩展，搜索 Encoding 找到

![](images/img-modify-f9672a8faf971d649406a404d894305b.jpg)


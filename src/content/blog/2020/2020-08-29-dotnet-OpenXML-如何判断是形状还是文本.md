---
title: "dotnet OpenXML 如何判断是形状还是文本"
pubDatetime: 2020-08-29 03:27:53
modDatetime: 2024-05-20 08:22:03
slug: dotnet-OpenXML-如何判断是形状还是文本
description: "dotnet OpenXML 如何判断是形状还是文本"
tags:
  - dotnet
  - OpenXML
---




在 OpenXML 格式里面，其实不存在文本这个元素，所有都是形状。但是在 PPT 界面看到的文本框是什么呢？其实他是特别的形状。而几乎所有的形状都可以输入文本，因此区分形状和文本的意义不会特别大，只是在做解析的时候才会碰到

<!--more-->


<!-- CreateTime:2020/8/29 11:27:53 -->



在 OpenXML 的 PML 也就是 PPT 使用的格式里面，在 [dotnet OpenXML 解析 PPT 页面元素文档格式](https://blog.lindexi.com/post/dotnet-OpenXML-%E8%A7%A3%E6%9E%90-PPT-%E9%A1%B5%E9%9D%A2%E5%85%83%E7%B4%A0%E6%96%87%E6%A1%A3%E6%A0%BC%E5%BC%8F.html ) 告诉大家都是形状

那么文本框是什么形状？其实文本框是特别的形状

在 PPT 里面拖入文本框，然后使用 [OpenXML 解压缩文档为文件夹工具](https://blog.lindexi.com/post/dotnet-OpenXML-%E8%A7%A3%E5%8E%8B%E7%BC%A9%E6%96%87%E6%A1%A3%E4%B8%BA%E6%96%87%E4%BB%B6%E5%A4%B9%E5%B7%A5%E5%85%B7.html ) 解压缩，此时可以看到在页面里的元素大概内容如下

```xml
<p:sp>
    <p:nvSpPr>
        <p:cNvSpPr txBox="1"/>
    </p:nvSpPr>
    <!-- 忽略 -->
</p:sp>
```

也就是说文本框也是 `p:sp` 也就是 Shape 元素，但是在 `p:nvSpPr->p:cNvSpPr->txBox` 有属性表示是文本框

在 dotnet 里面通过 OpenXML SDK 可以这样获取

```csharp
            // nvSpPr
            NonVisualShapeProperties nonVisualShapeProperties = shape.NonVisualShapeProperties;
            // cNvSpPr
            var nonVisualShapeDrawingProperties = nonVisualShapeProperties?.NonVisualShapeDrawingProperties;

            var isTextBox = nonVisualShapeDrawingProperties?.TextBox?.Value is true;
```

在 OpenXML SDK 的帮助下，可以解析很多 PPT 文档的缩写，可以提升可读性。如 `nvSpPr` 其实就是 `Non(n) Visual(v) Shape(Sp) Properties(pr)` 的意思

更多请看 [Office 使用 OpenXML SDK 解析文档博客目录](https://blog.lindexi.com/post/Office-%E4%BD%BF%E7%94%A8-OpenXML-SDK-%E8%A7%A3%E6%9E%90%E6%96%87%E6%A1%A3%E5%8D%9A%E5%AE%A2%E7%9B%AE%E5%BD%95.html )



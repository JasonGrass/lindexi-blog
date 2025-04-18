---
title: "C# dotnet 使用 OpenXml 解析 PPT 文件"
pubDatetime: 2020-02-29 02:27:27
modDatetime: 2024-05-20 08:22:03
slug: C-dotnet-使用-OpenXml-解析-PPT-文件
description: "C# dotnet 使用 OpenXml 解析 PPT 文件"
tags:
  - dotnet
  - OpenXML
  - C#
---




在 2013 微软开源了 OpenXml 解析库，在微软的 PPTX 文档，使用的文档格式就是国际规范的 OpenXml 格式。这个格式有很多版本，详细请看百度。因为演示文稿使用的是 OpenXml 在 .NET 开发可以非常简单将 PowerPoint 文档进行解析，大概只需要两句话

<!--more-->


<!-- CreateTime:2020/2/29 10:27:27 -->

<!-- csdn -->

解析 PPT 文件不等于显示 PPT 文件，只是可以拿到 PPT 里面的数据

第一步是通过 NuGet 安装 [OpenXml](https://www.nuget.org/packages/DocumentFormat.OpenXml) 库，这个库支持跨平台，因为只是解析数据

第二步就是传入 PPT 文件解析

```csharp
            using (var presentationDocument = DocumentFormat.OpenXml.Packaging.PresentationDocument.Open("测试.pptx", false))
```

这样就完成了 PPT 文件的解析，在调试添加断点，可以在局部变量看到 presentationDocument 的内容

这里面的内容就是整个 PPT 的数据，至于这些数据的含义是什么，就需要额外阅读一下文档

下面是一个简单的例子，获取 PPT 文件里面每一页的所有文本

```csharp
            using (var presentationDocument = DocumentFormat.OpenXml.Packaging.PresentationDocument.Open("测试.pptx", false))
            {
                var presentationPart = presentationDocument.PresentationPart;
                var presentation = presentationPart.Presentation;

                // 先获取页面
                var slideIdList = presentation.SlideIdList;

                foreach (var slideId in slideIdList.ChildElements.OfType<SlideId>())
                {
                    // 获取页面内容
                    SlidePart slidePart = (SlidePart) presentationPart.GetPartById(slideId.RelationshipId);

                    var slide = slidePart.Slide;

                    foreach (var paragraph in
                        slidePart.Slide
                            .Descendants<DocumentFormat.OpenXml.Drawing.Paragraph>())
                    {
                        // 获取段落
                        // 在 PPT 文本是放在形状里面
                        foreach (var text in
                            paragraph.Descendants<DocumentFormat.OpenXml.Drawing.Text>())
                        {
                            // 获取段落文本，这样不会添加文本格式
                            Debug.WriteLine(text.Text);
                        }
                    }
                }
            }
```

代码放在 [github](https://github.com/lindexi/lindexi_gd/tree/3bb1678686dbd12c4b2d911d3d3bd42ec30d8987/WhocohefurWallqemwaychurgu) 欢迎小伙伴访问

[OfficeDev/Open-XML-SDK: Open XML SDK by Microsoft](https://github.com/OfficeDev/Open-XML-SDK )

[Openxml学习 - 标签 - FrankZC - 博客园](https://www.cnblogs.com/FourLeafCloverZc/tag/Openxml%E5%AD%A6%E4%B9%A0/ )

[Open Xml SDK 引文](https://www.cnblogs.com/pengzhen/p/3811834.html )

官方文档 [欢迎使用 Open XML SDK 2.5 for Office](https://docs.microsoft.com/zh-cn/office/open-xml/open-xml-sdk )

其他语言的解析

[scanny/python-pptx: Create Open XML PowerPoint documents in Python](https://github.com/scanny/python-pptx )

更多请看 [Office 使用 OpenXML SDK 解析文档博客目录](https://blog.lindexi.com/post/Office-%E4%BD%BF%E7%94%A8-OpenXML-SDK-%E8%A7%A3%E6%9E%90%E6%96%87%E6%A1%A3%E5%8D%9A%E5%AE%A2%E7%9B%AE%E5%BD%95.html )


---
title: "WPF 将 docx 的 Word 文件转换为 FlowDocument 显示"
pubDatetime: 2020-08-04 11:30:53
modDatetime: 2024-08-06 12:43:41
slug: WPF-将-docx-的-Word-文件转换为-FlowDocument-显示
description: "WPF 将 docx 的 Word 文件转换为 FlowDocument 显示"
tags:
  - WPF
---




本文告诉大家如何将 docx 的 Word 文档在 WPF 中显示内容

<!--more-->


<!-- CreateTime:2020/8/4 19:30:53 -->



本文源代码请看 [ArtMalykhin/wpf-embedded-docx](https://github.com/ArtMalykhin/wpf-embedded-docx )

在 [Office 文档解析 文档格式和协议](https://lindexi.gitee.io/post/Office-%E6%96%87%E6%A1%A3%E8%A7%A3%E6%9E%90-%E6%96%87%E6%A1%A3%E6%A0%BC%E5%BC%8F%E5%92%8C%E5%8D%8F%E8%AE%AE.html ) 咱可以了解到 Word 文档只是一个压缩文件里面的文件使用 xml 表示

因此需要做的是将 xml 转 FlowDocument 在 WPF 界面显示，大概做到的效果就是丢失很多样式和特效，然后文本形式加超链接在 WPF 显示的效果

<!-- ![](images/img-WPF 将 docx 的 Word 文件转换为 FlowDocument 显示0.png) -->

![](images/img-modify-ae5ba321cf310e0739700702f6195f90.jpg)

详细请看 [Show Word File in WPF - CodeProject](https://www.codeproject.com/Articles/649064/Show-Word-file-in-WPF )




---
title: "dotnet OpenXML 文本 ParagraphProperties 的属性作用"
pubDatetime: 2020-07-22 11:26:42
modDatetime: 2024-08-06 12:43:28
slug: dotnet-OpenXML-文本-ParagraphProperties-的属性作用
description: "dotnet OpenXML 文本 ParagraphProperties 的属性作用"
tags:
  - dotnet
  - OpenXML
---




本文收集 a:pPr 段落属性 ParagraphProperties 的属性的作用

<!--more-->


<!-- CreateTime:2020/7/22 19:26:42 -->

本文的 OpneXMl SDK 的获取代码前提都有以下代码

```csharp
public void Foo(Paragraph textParagraph)
{
	 ParagraphProperties paragraphProperties = textParagraph.ParagraphProperties;
}
```

本文会不断更新，因为属性太多了

## defTabSz

Default Tab Size

OpneXMl SDK: `var defaultTabSize = paragraphProperties.DefaultTabSize;`

单位： EMU

作用： 描述 Tab 字符的默认宽度，注意 Tab 会被具体的字符影响，实际宽度不一定等于这个属性设置的值，因为会被具体的标尺影响，会和具体的排版相关

例如下面代码

```xml
<a:pPr fontAlgn="auto" defTabSz="360000">
	<a:r>
		<a:rPr b="1" dirty="0" lang="en-US" sz="2400">
			<a:latin typeface="+mn-ea"/>
		</a:rPr>
		<a:t>1 1	1</a:t>
	</a:r>
</a:pPr>
```

上面代码将 `defTabSz` 设置为 `360000` 也就是 10 厘米

```
1 cm = 360000 EMUs
10 cm = 3600000 EMUs
```

因此设置之后的效果如下

<!-- ![](images/img-dotnet OpenXML 文本 ParagraphProperties 的属性作用0.png) -->

![](images/img-modify-fef43b3e10f133341663121bb0412795.jpg)

在两个字符之间如果输入 Tab 键，那么这个 Tab 键将占用 360000EMU 单位空间，当然，后续在这两个字符中间输出不超过 360000EMU 单位空间 的字符，那么依然不会更改 Tab 后字符的距离，如下图，输入了多个 z 字符

<!-- ![](images/img-dotnet OpenXML 文本 ParagraphProperties 的属性作用1.png) -->

![](images/img-modify-f3a93e5003c2e5d36be8195fe035d164.jpg)

当然，想要理解这一点，还需要了解 Tab 的规则

## latinLnBrk

Latin Line Break

OpenXML SDK: `var latinLineBreak = paragraphProperties.LatinLineBreak;`

作用：是否允许西文在单词中间换行

<!-- ![](images/img-dotnet OpenXML 文本 ParagraphProperties 的属性作用2.png) -->

![](images/img-modify-33cb96779eb078274e44cf84c1e2ec7c.jpg)

例如下面代码

```xml
<a:p>
	<a:pPr fontAlgn="auto" defTabSz="3600000" latinLnBrk="0">
	</a:pPr>
	<a:r>
		<a:rPr b="1" dirty="0" lang="en-US" sz="2400" >
			<a:latin typeface="+mn-ea"/>
		</a:rPr>
		<a:t>aa aa aa aa aa aa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</a:t>
	</a:r>
</a:p>
```

显示效果如下

<!-- ![](images/img-dotnet OpenXML 文本 ParagraphProperties 的属性作用3.png) -->

![](images/img-modify-067b63191fad4a348e3b4e10a1c8a787.jpg)

将 `latinLnBrk` 设置为 1 的效果如下

```xml
	<a:pPr fontAlgn="auto" defTabSz="3600000" latinLnBrk="1">
```

<!-- ![](images/img-dotnet OpenXML 文本 ParagraphProperties 的属性作用4.png) -->

![](images/img-modify-dd5431b44d6e545cb6ec00aa0e1a3a33.jpg)

## eaLnBrk

East Asian Line Break

OpenXML SDK: `var eastAsianLineBreak = paragraphProperties.EastAsianLineBreak;`

作用：是否允许东方字符在单词中间换行

请看 latinLnBrk 的作用，表现为允许标点在行首，如下面代码

```xml
<a:p>
	<a:pPr fontAlgn="auto" defTabSz="3600000" latinLnBrk="1"></a:pPr>
	<a:r>
		<a:rPr b="1" dirty="0" lang="en-US" sz="2400" >
			<a:latin typeface="+mn-ea"/>
		</a:rPr>
		<a:t>打字打字打字打字打字打字打字打字打字打字打字。</a:t>
	</a:r>
</a:p>
```

效果如下

<!-- ![](images/img-dotnet OpenXML 文本 ParagraphProperties 的属性作用5.png) -->

![](images/img-modify-d6bbb18940e0a608331a7dd5ff166a99.jpg)


## fontAlgn

Font Alignment

OpenXML SDK: `var fontAlignment = paragraphProperties.FontAlignment;`

作用：设置字体比较小的文本对齐方法

Office 的 PPT 2016 不支持

效果如下图

<!-- ![](images/img-dotnet OpenXML 文本 ParagraphProperties 的属性作用6.png) -->

![](images/img-modify-fddaebd41c0c0de5e825f6ae7ed6c56c.jpg)

可以作出上标下标的效果

本文的单位请看 [Office Open XML 的测量单位](https://blog.lindexi.com/post/Office-Open-XML-%E7%9A%84%E6%B5%8B%E9%87%8F%E5%8D%95%E4%BD%8D.html )

更多请看 [Office 使用 OpenXML SDK 解析文档博客目录](https://blog.lindexi.com/post/Office-%E4%BD%BF%E7%94%A8-OpenXML-SDK-%E8%A7%A3%E6%9E%90%E6%96%87%E6%A1%A3%E5%8D%9A%E5%AE%A2%E7%9B%AE%E5%BD%95.html )



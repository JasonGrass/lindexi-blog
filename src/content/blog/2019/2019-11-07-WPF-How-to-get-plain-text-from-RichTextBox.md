---
title: "WPF How to get plain text from RichTextBox"
pubDatetime: 2019-11-07 02:26:17
modDatetime: 2024-05-20 08:22:03
slug: WPF-How-to-get-plain-text-from-RichTextBox
description: "WPF How to get plain text from RichTextBox"
tags:
  - WPF
---




We can not find any function to get plain text from RichTextBox. But we can use TextRange to get plain text.

<!--more-->


<!-- CreateTime:2019/11/7 10:26:17 -->

<!-- csdn -->

We create a RichTextBox in UI

```csharp
<RichTextBox Name="RichTextBox">
  <FlowDocument>
    <Paragraph>
      <Run>Paragraph 1</Run>
    </Paragraph>
    <Paragraph>
      <Run>Paragraph 2</Run>
    </Paragraph>
    <Paragraph>
      <Run>Paragraph 3</Run>
    </Paragraph>
  </FlowDocument>
</RichTextBox>
```

And we can use TextRange to get plain text from RichTextBox

```csharp
 string text = new TextRange(RichTextBox.Document.ContentStart, RichTextBox.Document.ContentEnd).Text
```
	
See: [How to: Extract the Text Content from a RichTextBox](https://docs.microsoft.com/en-us/dotnet/framework/wpf/controls/how-to-extract-the-text-content-from-a-richtextbox?redirectedfrom=MSDN )

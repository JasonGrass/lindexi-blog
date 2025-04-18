---
title: "C# dotnet 分割换行"
pubDatetime: 2020-03-23 08:04:05
modDatetime: 2024-05-20 08:22:03
slug: C-dotnet-分割换行
description: "C# dotnet 分割换行"
tags:
  - dotnet
  - C#
---




我在写一个 UWP 文本阅读器，我需要提升性能，需要将文本按行绘制但是文本里面的换行分割规则有点坑，本文写了一个辅助的方法用于分割换行

<!--more-->


<!-- CreateTime:2020/3/23 16:04:05 -->



虽然有默认字符串提供的 Split 分割方法很好用，在一些字符串里面只包含 `\r` 或 `\n` 很好用，但是如果在字符串里面同时包含了 `\r` 和 `\n` 就不好玩了，如下面字符串

```csharp
             var str = "123123\r123123\n123123\r\n123";
``` 

我需要按照只要有 `\r` 或 `\n` 就分割字符串，如果有连续的 `\r\n` 就分割一次

```csharp
            var newLineList = str.Split('\n', '\r').Select(text => text = text.Replace("\r", ""))
                .ToList();
```

上面代码将会多分割出一个空行，原因是 `\r\n` 被分割为两行

我自己写了一个辅助代码

```csharp
        private static List<string> SplitMultiLines(string str)
        {
            var lineList = new List<string>();
            var text = new StringBuilder(str.Length);
            for (var i = 0; i < str.Length; i++)
            {
                var c = str[i];
                if (c == '\r')
                {
                    lineList.Add(text.ToString());
                    text.Clear();

                    if (i < str.Length - 1)
                    {
                        if (str[i + 1] == '\n')
                        {
                            i++;
                        }
                    }
                }
                else if (c == '\n')
                {
                    lineList.Add(text.ToString());
                    text.Clear();

                    if (i < str.Length - 1)
                    {
                        if (str[i + 1] == '\r')
                        {
                            i++;
                        }
                    }
                }
                else
                {
                    text.Append(c);
                }
            }

            lineList.Add(text.ToString());
            return lineList;
        }
```

上面代码能符合我预期，如果小伙伴有更简单的方法，欢迎告诉我

本文代码放在 [github](https://github.com/lindexi/lindexi_gd/tree/0495ca07ac65af548810035628a4d565b26f1c91/BepirquwiKedoucawji) 欢迎小伙伴访问


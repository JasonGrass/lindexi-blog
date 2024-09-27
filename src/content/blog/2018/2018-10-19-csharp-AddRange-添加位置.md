---
title: "C# AddRange 添加位置"
pubDatetime: 2018-10-19 01:03:08
modDatetime: 2024-08-06 12:43:24
slug: C-AddRange-添加位置
description: "C# AddRange 添加位置"
tags:
  - C#
---




有没人想知道， AddRange 添加位置 是哪？
是添加到数组的开始，还是数组的末尾？

<!--more-->


<!-- CreateTime:2018/10/19 9:03:08 -->


<div id="toc"></div>

假如有一个 代码，看起来是下面的，很简单，把一个 list b 放进list a


```csharp
                List<int> a=new List<int>(){1,2,};
            List<int> b = new List<int> {5, 6};
            a.AddRange(b);
            foreach (var temp in a)
            {
                Console.WriteLine(temp);
            }
```

那么打印的是 1 2  5 6

还是 5 6 1 2

答案是自己去跑。

不要打我，答案是 1256， AddRange 添加数组的末尾。

![](images/img-modify-6d4d22daee5f84aba718de8394b2c012.jpg)


---
title: "C＃枚举中使用Flags特性"
pubDatetime: 2019-09-02 04:57:37
modDatetime: 2024-05-20 08:22:03
slug: C枚举中使用Flags特性
description: "C＃枚举中使用Flags特性"
tags:
  - C#
---




如果对一个值可以包含多个，那么可以使用枚举，加上Flags
本文告诉大家如何写一个 Flags。

<!--more-->


<!-- CreateTime:2019/9/2 12:57:37 -->


<div id="toc"></div>

在写前，需要知道一些基础知识，取反、或、与，如果不知道的话，请去看看基础。

当然，这些太复杂了，我也不会在这里解释。

假如有类型 Show 的定义如下


```csharp
    [Flags]
    public enum Show
    {
        A = 0x00000001,
        B = 0x00000010,
        C = 0x00000100,
        D = 0x00001000,
    }
```


## 合并多个值

合并多个，使用 `|`


```csharp
  Show show=Show.A | Show.B
```

枚举通过这个方法可以在一个变量包含多个值

## 判断是否存在某个值

一个简单方法是用 HasFlag，但是一个方法是用 `&` 


```csharp
  Show show = Show.A | Show.B;
  show.HasFlag(Show.A);
  //其他
  bool 包含 = (show & Show.A) !=0 ;
```

从性能上看通过 `&` 的性能会比 HasFlag 高，但是从可读性上 HasFlag 更友好，如果你的代码没有性能问题推荐使用 HasFlag 方法

只要一个 enum 使用了 Flags 标记就可以使用 HasFlag 方法

## 去掉一个值

```csharp
  Show show=Show.A | Show.B;
  show=show & (~Show.A);
```

## 取反一个值


```csharp
  Show show=Show.A | Show.B;
  bool 包含=(show & Show.A)!=0;
  if(包含)
  {
     show=show & (~Show.A);
  }
  else
  {
     show=show | Show.A;
  }
```

需要知道在以前，写枚举的值，不是二进制，现在C#7可使用二进制


```csharp
    [Flags]
    public enum Show
    {
        A = 0b00000001,
        B = 0b00000010,
        C = 0b00000100,
        D = 0b00001000,
    }
```

于是这样就可以合并多个值，用一个 byte 表示一个值

参见：http://www.cnblogs.com/jhxk/articles/1738831.html


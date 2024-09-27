---
title: "C# 从 short 转 byte 方法"
pubDatetime: 2019-04-29 04:08:39
modDatetime: 2024-08-06 12:43:24
slug: C-从-short-转-byte-方法
description: "C# 从 short 转 byte 方法"
tags:
  - C#
---




本文告诉大家多个方法转换 short 和 byte 有简单的也有快的

<!--more-->


<!-- CreateTime:2019/4/29 12:08:39 -->


## 快速简单的方法

```csharp
static short ToShort(short byte1, short byte2)
{
    return (byte2 << 8) + byte1;
}

static void FromShort(short number, out byte byte1, out byte byte2)
{
    byte2 = (byte) (number >> 8);
    byte1 = (byte) (number & 255);
}
```

## 简单的方法

通过[BitConverter](https://docs.microsoft.com/en-us/dotnet/api/system.bitconverter?wt.mc_id=MVP ) 可以将大量的类转换为 byte 包括 short 的方法

```csharp
short number = 42;
byte[] numberBytes = BitConverter.GetBytes(number);
short converted = BitConverter.ToInt16(numberBytes);
```

但是为了这么简单的 short 两个 byte 创建一个数组，感觉不是很好

https://stackoverflow.com/q/1442583/6116637

![](images/img-modify-2fd6ff8898bc27015976ef96b5fa3b9d.png)


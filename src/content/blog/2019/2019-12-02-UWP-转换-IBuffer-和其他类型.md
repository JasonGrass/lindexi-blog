---
title: "UWP 转换 IBuffer 和其他类型"
pubDatetime: 2019-12-02 00:31:47
modDatetime: 2024-05-20 08:22:03
slug: UWP-转换-IBuffer-和其他类型
description: "UWP 转换 IBuffer 和其他类型"
tags:
  - UWP
---




本文告诉大家在 UWP 如何转换 IBuffer 为 string 和 stream 类

<!--more-->


<!-- CreateTime:2019/12/2 8:31:47 -->

<!-- csdn -->

## byte 数组转 IBuffer

使用下面代码可以将 byte 数组转 IBuffer

```csharp
using System.Runtime.InteropServices.WindowsRuntime;

            byte[] byteList = xx;
            IBuffer buffer = byteList.AsBuffer();

```
	
这里的 AsBuffer 是扩展方法所以需要使用 using 的方法

```csharp
using System.Runtime.InteropServices.WindowsRuntime;

            IBuffer buffer = xx;
            var byteList = buffer.ToArray();
```

## string 转 IBuffer

可以使用两个方式，第一个方式是将 string 转换为 byte 数组，请看代码

```csharp
    using System.Text;

            byteList = Encoding.UTF8.GetBytes(str);

```

从数组转 string 的方法请看下面

```csharp
    using System.Text;
  
            var str = Encoding.UTF8.GetString(byteList);

```

转换为 byte 数组就可以使用上面的方法转换为 IBuffer 但是在这样可以看到方法的代码有些多，可以使用下面的方法快速转换

通过 CryptographicBuffer 类可以将 string 转换为 IBuffer 请看代码

```csharp

 using Windows.Security.Cryptography;

            IBuffer buffer = CryptographicBuffer.ConvertStringToBinary(str, BinaryStringEncoding.Utf8);

            str = CryptographicBuffer.ConvertBinaryToString(BinaryStringEncoding.Utf8, buffer);

```




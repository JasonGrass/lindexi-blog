---
title: "C# GUID ToString "
pubDatetime: 2018-10-19 01:04:44
modDatetime: 2024-08-06 12:43:24
slug: C-GUID-ToString-
description: "C# GUID ToString "
tags:
  - C#
---




最近在看到小伙伴直接使用 Guid.ToString 方法，我告诉他需要使用 Guid.ToString("N") 的方式输出字符串 ，为什么需要使用 N 这个参数呢，因为默认的是参数 D 在输出的时候会出现连字符

<!--more-->


<!-- CreateTime:2018/10/19 9:04:44 -->


Guid 是 Globally Unique Identifier 全局唯一标识符的缩写，是一种由算法生成的唯一标识，在 C# dotnet 里面的 Guid 类是微软的UUID标准的实现。

Guid.ToString 里面可以添加下面几个参数，“N”，“D”，“B”，“P”，“X” 等

如果直接使用 `Guid.ToString()` 那么就是使用 “D” 这个参数，添加了这个参数之后的输出格式大概如下，也就是在字符串中添加连字符

```csharp
00000000-0000-0000-0000-000000000000
536b4dd7-f3dd-4664-bd69-bc0859d710ab
```

如果使用 “N” 那么就是只有32位数字，没有连字符，这里的数字是 16 进制表示的，也就是说字符串有 a-f 这几个英文字符和 0-9 的数字

```csharp
00000000000000000000000000000000
2329fcac4fd640f1bc221e254b14d621
```

在我的业务里面，没有连字符看起来比较好看，于是我就建议小伙伴使用 Guid 的字符串输出的时候加上 N 这个参数

而在 Guid 格式化输出里面，可以选的参数中的 B 和 P 这只是在使用括号包字符串，如以下代码

```csharp
            System.Console.WriteLine(Guid.NewGuid().ToString("B"));
            {e34dead4-212d-442a-8f4c-e00107baec24}
```

```csharp
System.Console.WriteLine(Guid.NewGuid().ToString("P"));
(ac10d607-2b39-448f-99b5-0a3205cc9ac1)
```

从代码可以看到 B 使用 `{` 括号包含内容 ，使用参数 P 将使用 `(` 括号包含内容


在 Guid 格式化中的最特殊的是 x 参数，他会存在 4 个数字，最后一个数字是 8 个数字组合的，如下面代码

```csharp
   Console.WriteLine(Guid.NewGuid().ToString("X"));
  {0xd3f51d9d,0x31b3,0x45f6,{0x9b,0x7c,0x89,0x1d,0xa5,0x6a,0xa3,0x43}}
```

## GUID 转 int 

一个 GUID 需要 16 个 byte 也就是 4 个 int 才能组成，可以使用下面的方法转换

```csharp
      public static int[] Guid2Int(Guid value)
        {
            byte[] b = value.ToByteArray();
            int bint = BitConverter.ToInt32(b, 0);
            var bint1 = BitConverter.ToInt32(b, 4);
            var bint2 = BitConverter.ToInt32(b, 8);
            var bint3 = BitConverter.ToInt32(b, 12);
            return new[] {bint, bint1, bint2, bint3};
        }

        public static Guid Int2Guid(int value, int value1, int value2, int value3)
        {
            byte[] bytes = new byte[16];
            BitConverter.GetBytes(value).CopyTo(bytes, 0);
            BitConverter.GetBytes(value1).CopyTo(bytes, 4);
            BitConverter.GetBytes(value2).CopyTo(bytes, 8);
            BitConverter.GetBytes(value3).CopyTo(bytes, 12);
            return new Guid(bytes);
        }
```

参见：[全局唯一标识符 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E5%85%A8%E5%B1%80%E5%94%AF%E4%B8%80%E6%A0%87%E8%AF%86%E7%AC%A6 )

![](images/img-modify-8a9f690c5f565d4cc269d8549d2362ee.jpg)


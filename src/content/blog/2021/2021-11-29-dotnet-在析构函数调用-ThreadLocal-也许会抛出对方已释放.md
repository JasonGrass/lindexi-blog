---
title: "dotnet 在析构函数调用 ThreadLocal 也许会抛出对方已释放"
pubDatetime: 2021-11-29 12:27:00
modDatetime: 2024-08-06 12:43:30
slug: dotnet-在析构函数调用-ThreadLocal-也许会抛出对方已释放
description: "dotnet 在析构函数调用 ThreadLocal 也许会抛出对方已释放"
tags:
  - dotnet
---




我在不自量力做一个数组池，就是为了减少使用 System.Buffers.dll 程序集，然而在数组池里面，所用的 ThreadLocal 类型，在我对象析构函数进行归还数组时，抛出了无法访问已释放对象

<!--more-->


<!-- CreateTime:2021/11/29 20:27:00 -->

<!-- 发布 -->

先来看第一个张图，亮点在于线程是 GC 终结器线程

<!-- ![](images/img-dotnet 在析构函数调用 ThreadLocal 也许会抛出对方已释放0.png) -->

![](images/img-modify-85a5db05c440d2b318bed3605e319f8b.jpg)

调用堆栈是 `~ByteListMessageStream` 函数，也就是 ByteListMessageStream 的 析构函数。代码如下

```csharp
        ~ByteListMessageStream()
        {
            _sharedArrayPool.Return(Buffer);
        }
```

<!-- ![](images/img-dotnet 在析构函数调用 ThreadLocal 也许会抛出对方已释放2.png) -->

![](images/img-modify-27b94c4baabf65c4d1aec87f657600db.jpg)

在进行数组归还的时候，因为 ThreadLocal 已被释放，所在的线程也不存在。此时的访问将失败，如下图

<!-- ![](images/img-dotnet 在析构函数调用 ThreadLocal 也许会抛出对方已释放1.png) -->

![](images/img-modify-9b8de83fcce6a3e079d60c19315a2f23.jpg)

请大家不要重复踩入此坑


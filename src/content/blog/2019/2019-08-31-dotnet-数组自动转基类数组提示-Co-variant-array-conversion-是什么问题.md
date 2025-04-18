---
title: "dotnet 数组自动转基类数组提示 Co-variant array conversion 是什么问题"
pubDatetime: 2019-08-31 08:55:58
modDatetime: 2024-05-20 08:22:04
slug: dotnet-数组自动转基类数组提示-Co-variant-array-conversion-是什么问题
description: "dotnet 数组自动转基类数组提示 Co-variant array conversion 是什么问题"
tags:
  - dotnet
---




在 C# 的语法，可以提供自动将某个类的数组自动转这个类的基类数组的方法，但是这样的转换在 Resharper 会提示 Co-variant array conversion 这是什么问题？

<!--more-->


<!-- CreateTime:2019/8/31 16:55:58 -->


在 C# 使用强类型，也就是默认在某个类型的数组里面，不能存放不继承当前数组类型的类。在自动转换基类的数组的时候，实际的对象还是原来的类。

如我可以使用下面的代码将 string 数组转换为 object 数组

```csharp
            string[] foo = new[]
            {
                "lindexi",
                "欢迎访问我博客 https://blog.lindexi.com/ 里面有大量 UWP WPF 博客"
            };

            object[] f1 = foo;
```

但是这不代表 f1 也是 object 数组，只是用起来可以作为 object 数组用，如果我存放一个不是继承字符串的类，那么将会提示 `System.ArrayTypeMismatchException: Attempted to access an element as a type incompatible with the array.` 因为这个数组是强数组，不能加入和数组定义不相同的

```csharp
            string[] foo = new[]
            {
                "lindexi",
                "欢迎访问我博客 https://blog.lindexi.com/ 里面有大量 UWP WPF 博客"
            };

            object[] f1 = foo;

            f1[1] = 10;// System.ArrayTypeMismatchException: Attempted to access an element as a type incompatible with the array.
```

在 `object[] f1 = foo` 有 Resharper 提示 `Co-variant array conversion can cause run-time exception` 告诉你不建议这样写

但是如果我定义的时候，将 foo 修改为 object 数组就没有这个问题

```csharp
            object[] foo = new object[]
            {
                "lindexi",
                "欢迎访问我博客 https://blog.lindexi.com/ 里面有大量 UWP WPF 博客"
            };

            object[] f1 = foo;

            f1[1] = 10;
```

这个方法就是将这个数组定义的类尽可能底层这样就可以让数组加入继承定义的数组的类的

但是更多的是在 Linq 的时候使用，如我从一个 Foo 方法里面拿到了字符串数组，此时我需要将这个数组转换为 object 数组，那么也会有相同提示

```csharp
            object[] foo = new List<string>
            {
                "lindexi",
                "欢迎访问我博客 https://blog.lindexi.com/ 里面有大量 UWP WPF 博客"
            }.ToArray();
            // Resharper 提示 Co-variant array conversion can cause run-time exception 因为 ToArray 返回的是 string[] 也就是通过 foo 拿到的是强数组
```

需要解决这个问题可以使用 ToArray 的方法，让返回的是 object 数组

```csharp
            object[] foo = new List<string>
            {
                "lindexi",
                "欢迎访问我博客 https://blog.lindexi.com/ 里面有大量 UWP WPF 博客"
            }.ToArray<object>();
```

[Co-variant array conversion](https://www.jetbrains.com/help/resharper/2018.3/CoVariantArrayConversion.html )

[Eric Lippert post](https://blogs.msdn.microsoft.com/ericlippert/2007/10/17/covariance-and-contravariance-in-c-part-two-array-covariance/)


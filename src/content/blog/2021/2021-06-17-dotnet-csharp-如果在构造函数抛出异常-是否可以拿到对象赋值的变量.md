---
title: "dotnet C# 如果在构造函数抛出异常 是否可以拿到对象赋值的变量"
pubDatetime: 2021-06-17 12:14:09
modDatetime: 2024-05-20 08:22:03
slug: dotnet-C-如果在构造函数抛出异常-是否可以拿到对象赋值的变量
description: "dotnet C# 如果在构造函数抛出异常 是否可以拿到对象赋值的变量"
tags:
  - dotnet
  - C#
---




如果使用某个变量去获取某个类型的对象创建，但是在这个类型的构造函数调用时抛出异常，请问此变量是否可以拿到对应的对象

<!--more-->


<!-- CreateTime:2021/6/17 20:14:09 -->

<!-- 发布 -->

如下面代码

```csharp
        private void F1()
        {
            Foo foo = null;
            try
            {
                foo = new Foo();
            }
            catch
            {
                // 忽略
            }
        }

    class Foo
    {
        public Foo()
        {
            throw new Exception("lindexi is doubi");
        }

        ~Foo()
        {
        }
    }
```

请问在执行完成 F1 函数前，在 F1 函数定义的 foo 变量是什么，是空，还是 Foo 对象

答案自然是空，原因是在 .NET 运行时的逻辑是先分配对象内存空间，然后再调用对象的构造函数，接着将对象赋值给到 foo 变量

而在进行第二步时就炸了，自然就不会给 foo 变量赋值



---
title: "VisualStudio 通过 EditorBrowsable 隐藏不开放的属性或方法"
pubDatetime: 2018-12-15 02:30:35
modDatetime: 2024-05-20 08:22:03
slug: VisualStudio-通过-EditorBrowsable-隐藏不开放的属性或方法
description: "VisualStudio 通过 EditorBrowsable 隐藏不开放的属性或方法"
tags:
  - VisualStudio
---




在开发中，总是会有一些方法不期望让大家直接使用到，就可以通过 EditorBrowsable 特性让智能提示不显示这个属性或方法

<!--more-->


<!-- CreateTime:2018/12/15 10:30:35 -->

<!-- csdn  -->

假设我开发了这样一个类

```csharp
    public class Foo
    {
        public void Doubi()
        {
            Console.WriteLine("林德熙是逗比");
        }
    }
```

我不想让小伙伴调用 Doubi 方法，但是我自己又想使用，此时就可以使用 EditorBrowsable 标记在方法

```csharp
    public class Foo
    {
        [EditorBrowsable(EditorBrowsableState.Never)]
        public void Doubi()
        {
            Console.WriteLine("林德熙是逗比");
        }
    }
```

现在 VisualStudio 智能提示就不能够提示这个方法了，但是 Resharper 依然可以提示，只有通过 ReSharper > Options > Environment > IntelliSense > Completion Appearance 设置去掉 EditorBrowsable 的值才能不显示

于是现在小伙伴就无法从智能提示找到 Doubi 方法了，那么这个特性是在什么时候有用？在于自己写了一些不想让小伙伴用的属性或方法的时候

在 WPF 底层就在 DispatcherObject 的 CheckAccess 判断调用线程是否是创建线程的方法标记了这个特性，只有了解 WPF 依赖属性的小伙伴才能使用这个方法

当然这个做法没有接口隐藏的方法做的好，只是使用起来方便

[Resharper 配置](https://www.jetbrains.com/help/resharper/Reference__Options__Environment__IntelliSense__Completion_Appearance.html )

[EditorBrowsableAttribute Class](https://docs.microsoft.com/en-us/dotnet/api/system.componentmodel.editorbrowsableattribute?view=netframework-4.7.2 )


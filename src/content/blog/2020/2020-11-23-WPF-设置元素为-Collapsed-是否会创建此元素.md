---
title: "WPF 设置元素为 Collapsed 是否会创建此元素"
pubDatetime: 2020-11-23 11:05:02
modDatetime: 2024-05-20 08:22:03
slug: WPF-设置元素为-Collapsed-是否会创建此元素
description: "WPF 设置元素为 Collapsed 是否会创建此元素"
tags:
  - WPF
---




在 WPF 的 XAML 中，如果将某个元素初始的时候设置 Visibility 为 Collapsed 的值，那么意味着这个元素将不会参与布局，就和不存在是一样的。那么这个元素是否会被创建在内存中？是会创建的

<!--more-->


<!-- CreateTime:2020/11/23 19:05:02 -->



在 WPF 中，在 XAML 里面写的元素，无论 Visibility 设置为什么，都会在内存中创建这个元素对象

测试方法是自己定义一个元素，然后在 XAML 里面写，如下面代码定义的类

```csharp
    class Foo : UIElement
    {
        public Foo()
        {
            Debugger.Break();
        }
    }
```

在构造函数上添加 Debugger.Break 相当于加上一个断点

接着在 XAML 添加这个元素，如下面代码

```xml
        <local:Foo Visibility="Collapsed"></local:Foo>
```

此时运行程序，可以看到进入 Foo 构造函数

但是此时界面上没有任何的元素，实时的视觉树也没有显示界面有任何元素，也就是 Foo 元素只是创建出来，啥都不做

那为什么 WPF 默认行为会创建出这样的元素出来？原因是界面上有绑定或者有事件关联等都需要存在一个对象，因此这部分不敢做优化

本文代码放在[github](https://github.com/lindexi/lindexi_gd/tree/90372c4f3ee3be33246a4c1fe4400511b68997d8/KemkicemdurFemceloja)欢迎小伙伴访问


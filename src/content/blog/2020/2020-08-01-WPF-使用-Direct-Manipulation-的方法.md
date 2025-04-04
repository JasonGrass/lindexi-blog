---
title: "WPF 使用 Direct Manipulation 的方法"
pubDatetime: 2020-08-01 00:32:34
modDatetime: 2024-05-20 08:22:03
slug: WPF-使用-Direct-Manipulation-的方法
description: "WPF 使用 Direct Manipulation 的方法"
tags:
  - WPF
---




小伙伴是否了解在 UWP 和 WPF 触摸的滑动的顺滑是不相同的，一个原因是 UWP 使用了 Direct Manipulation 这个科技。这个科技需要采用 Pointer 消息的支持，本文告诉大家如何使用

<!--more-->


<!-- CreateTime:2020/8/1 8:32:34 -->



本文的代码都是从 [Using DirectManipulation with WPF](http://blog.neteril.org/blog/2019/03/30/using-directmanipulation-with-wpf/ ) 这篇博客抄的

可以运行的代码放在 [github](https://github.com/lindexi/lindexi_gd/tree/c628f0ba18094c2cfdc4d9dcfa8193107ee6de70/WileegowaqereLinallechaka) 欢迎小伙伴访问

顶层的用法效果如下

```csharp
        private readonly PointerBasedManipulationHandler _manipulationHandler = new PointerBasedManipulationHandler();
```

这里的 PointerBasedManipulationHandler 将是从 Pointer 消息拿到 Manipulation 的辅助方法，想要让这个方法跑起来需要在构造函数添加以下代码

```csharp
        public MainWindow()
        {
            InitializeComponent();

            PresentationSource.AddSourceChangedHandler(this, OnSourceChanged);

            _manipulationHandler.ScaleUpdated += ManipulationHandler_ScaleUpdated;

            SizeChanged += MainWindow_SizeChanged;
        }
```

在 SizeChanged 初始化
 
```csharp
        private void MainWindow_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            _manipulationHandler.InitializeDirectManipulation(e.NewSize);
        }
```

可以通过 ScaleUpdated 拿到缩放的参数，此时就完成了从 Pointer 拿到 Manipulation 进行缩放。而滑动效果我还没学会

关于 PointerBasedManipulationHandler 的逻辑，看起来比较复杂，我就没有放在博客里面，请小伙伴在 [github](https://github.com/lindexi/lindexi_gd/tree/c628f0ba18094c2cfdc4d9dcfa8193107ee6de70/WileegowaqereLinallechaka) 访问

滑动的使用方法可以一个测试的程序让大家看到，实际上是需要小伙伴自己去玩一下，对比一下才能感知到这个技术的强大

现在这个技术我还没在 .NET Core 3.1 下跑过，在 .NET Core 3.1 下运行将会抛出 UnauthorizedAccessException 运行失败

这个技术需要开启 Pointer 消息，开启方法请看 [win10 支持默认把触摸提升 Pointer 消息](https://blog.lindexi.com/post/win10-%E6%94%AF%E6%8C%81%E9%BB%98%E8%AE%A4%E6%8A%8A%E8%A7%A6%E6%91%B8%E6%8F%90%E5%8D%87-Pointer-%E6%B6%88%E6%81%AF.html)


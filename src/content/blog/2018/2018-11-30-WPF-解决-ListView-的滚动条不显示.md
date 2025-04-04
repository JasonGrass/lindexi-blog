---
title: "WPF 解决 ListView 的滚动条不显示"
pubDatetime: 2018-11-30 11:24:57
modDatetime: 2024-05-20 08:22:03
slug: WPF-解决-ListView-的滚动条不显示
description: "WPF 解决 ListView 的滚动条不显示"
tags:
  - WPF
---




本文告诉大家如何解决一个诡异的问题，如果有一个 ListView 同时里面的元素的高度很长，但是滚动条就是不显示，怎么让这个滚动条显示

<!--more-->


<!-- CreateTime:2018/11/30 19:24:57 -->

<!-- csdn -->

本文不属于小白博客，忽略所有的业务环境和样式问题以及对 ScrollViewer 的设置问题

在开始发现这个问题请先看 ListView 的滚动条，通过继承 ListView 或 ListBox 可以在 Load 事件拿到滚动条，需要判断 ScrollViewer 的 ExtentHeight 的大小

```csharp
        private void ListBox_Loaded(object sender, RoutedEventArgs e)
        {
            _scroll = this.VisualDescendant<ScrollViewer>();
        }
```

如果拿到的 `_scroll` 的 ExtentHeight 的大小相对预期小，则可以继续看本文的方法，如果有一些方法 Load 之后还没有设置数据可以等待设置数据之后通过 Dispatcher.InvokeAsync 的方法判断 ExtentHeight 的高度

如果这时高度太小，可能是因为 ItemsPresenter 没布局，尝试使用下面的代码解决

```csharp
        protected override void OnItemsSourceChanged(IEnumerable oldValue, IEnumerable newValue)
        {
            Dispatcher.InvokeAsync(() =>
            {
                InvalidateMeasure();

                if (_scroll != null)
                {
                    ItemsPresenter itemsPresenter = _scroll.Content as ItemsPresenter;
                    var size = new Size(double.PositiveInfinity, double.PositiveInfinity);
                    itemsPresenter?.Measure(size);
                    itemsPresenter?.InvalidateMeasure();
                }
            });

            base.OnItemsSourceChanged(oldValue, newValue);
        }
```

所有在 ItemsControl 的类都有 OnItemsSourceChanged 重写这个类都是在用户设置数据，在用户设置数据的时候，通过 Dispatcher.InvokeAsync 重新计算，这样就可以解决滚动条不显示

这样的原理是滚动条是否出现是通过判断 ScrollableHeight 或 ScrollableWidth 的值，但是这个值是通过判断内容的长度或宽度减去显示的长度宽度如果显示的内容大于内容就不显示。

通过 ItemsPresenter 重新布局就是解决这样的问题，在 ScrollViewer 的判断 ScrollableHeight 是通过 `this.ExtentHeight - this.ViewportHeight` 同时宽度是 `this.ExtentWidth - this.ViewportWidth` 判断

这里的 ExtentHeight 会收到用户的滚动条的一个设置 CanContentScroll 的修改，当然本文的方法能解决的是 CanContentScroll 已经设置为 false 这样 ExtentHeight 就是内容的长度

通过 ScrollViewer.Content 可以知道 ExtentHeight 和 ExtentWidth 这个在 ListView 等是 ItemsPresenter 如果出现 ExtentHeight 太小就可能是 ItemsPresenter 布局不对

[.net Framework 源代码 · ScrollViewer](https://blog.lindexi.com/post/dotnet-Framework-%E6%BA%90%E4%BB%A3%E7%A0%81-ScrollViewer.html )


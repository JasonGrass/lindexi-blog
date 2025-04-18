---
title: "WPF 调用 InvalidateVisual 不触发 OnRender 的原因"
pubDatetime: 2020-03-10 01:13:18
modDatetime: 2024-08-06 12:43:42
slug: WPF-调用-InvalidateVisual-不触发-OnRender-的原因
description: "WPF 调用 InvalidateVisual 不触发 OnRender 的原因"
tags:
  - WPF
---




我昨天和头像大人在解决一个坑，发现调用了 InvalidateVisual 的时候，不会触发 OnRender 方法。那么在什么时候会触发 OnRender 方法，在什么时候不会触发

<!--more-->


<!-- CreateTime:2020/3/10 9:13:18 -->



在 WPF 中通过 InvalidateVisual 方法可以告诉 WPF 框架，当前这个控件需要重新绘制元素，但是调用这个方法不是立刻进行绘制，不然性能就太差了。而是等待 WPF 的下一次更新界面就会触发控件的刷新

换句话说，在调用 InvalidateVisual 方法的时候不会立刻触发 OnRender 方法，需要等待下一次的 Dispatcher 的 Render 优先级的任务触发的时候才会调用

但是本文解决的问题是，为什么调用 InvalidateVisual 方法的时候，等待下一次的 Dispatcher 或等很久都没有进入 OnRender 方法

先通过一个简单的代码让大家能测试 WPF 的行为

本文的代码放在 [github](https://github.com/lindexi/lindexi_gd/tree/bbeb1f05f1254eccc485834fe1e25c81c2d4b84f/HelrayacalLigemleacaifeece) 欢迎小伙伴访问

我创建了 Foo 类，继承 FrameworkElement 类，这样就能让这个 Foo 使用十分底层的方法，也减少了 WPF 框架的其他业务逻辑

我重写了 OnRender 方法，在里面随意显示了一个文本，触发了一个事件。触发事件的作用是让我上层可以知道这个控件触发了 OnRender 方法

```csharp
    public class Foo : FrameworkElement
    {
        public event EventHandler Render;

        /// <inheritdoc />
        protected override void OnRender(DrawingContext drawingContext)
        {
            Render?.Invoke(this, null);

            var formattedText = new FormattedText($"lindexi", CultureInfo.CurrentCulture, FlowDirection.LeftToRight,
                new Typeface(new FontFamily("微软雅黑"), new FontStyle(), new FontWeight(), new FontStretch()), 25,
                new SolidColorBrush(Colors.Black), 96);

            drawingContext.DrawText(formattedText, new Point());
            base.OnRender(drawingContext);
        }
    }
```

然后写一个简单的界面，这个界面包含 Foo 控件，和一个文本控件，在文本控件其实就是在 Foo 的渲染方法触发的时候给出当前刷新的时间

还有几个按钮分别是调用 InvalidateVisual 和控件是否可以显示等属性

<!-- ![](images/img-WPF 调用 InvalidateVisual 不触发 OnRender 的原因0.png) -->

![](images/img-modify-1491e057a5eddf60c1af6211c0f849d6.jpg)

此时可以看到点击 InvalidateVisual 按钮默认会触发 OnRender 方法，可以在界面的文本控件的时间看到，点击按钮之后时间更新

而如果此时点击 Collapsed 按钮，然后点击 InvalidateVisual 可以看到时间没有更新，也就是 OnRender 没有触发

<!-- ![](images/img-WPF 调用 InvalidateVisual 不触发 OnRender 的原因.gif) -->

![](images/img-modify-0b05434038a68ccc9e87729732257be1.gif)

原理是在控件的 OnRender 触发条件是控件需要在视觉树上，如果控件不在视觉树上，如被从上层元素移除或元素被设置 Collapsed 那么 OnRender 将不会触发

为什么此时设计让 OnRender 不触发？原因是既然这个控件就不想显示出来了，那么还调用他的 OnRender 方法做什么。此时调用渲染方法执行的结果又没有用户视觉反馈，相当于无用的功能，这就和条件判断的自动跳过执行代码一样的做法

所以在元素不在视觉树上以及元素被 Collapsed 将不调用 OnRender 方案是设计如此

这也就是为什么说不要在 OnRender 里面写业务代码的原因，因为 OnRender 作用只是用来绘制界面，而其他业务都应该和 OnRender 无关。我和头像遇到的问题是我逗比在 OnRender 写了业务代码，就像本文的例子程序一样，添加了一个事件，然后发现事件不触发。进一步可以告诫小伙伴，遵循规范可以少踩一些坑，不遵循规范可以了解更多的细节

有没有例外项？有的，如果使用 VisualBrush 获取元素的显示状态，那么此时的元素即使不在视觉树上也能进行显示，当然这也就出现了 VisualBrush 的内存泄漏问题了，详细请看 [wpf VisualBrush 已知问题](https://blog.lindexi.com/post/wpf-VisualBrush-%E5%B7%B2%E7%9F%A5%E9%97%AE%E9%A2%98.html )

那么如果是选择 Hide 呢？其实选择 Hide 只是元素不可见，本身元素还是在视觉树上面的，所以此时的渲染方法还是会被调用

注意本文说的 OnRender 方法为渲染方法这个说法不准确，应该是指导渲染方法


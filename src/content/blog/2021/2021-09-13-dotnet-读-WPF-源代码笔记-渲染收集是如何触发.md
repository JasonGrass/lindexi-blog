---
title: "dotnet 读 WPF 源代码笔记 渲染收集是如何触发"
pubDatetime: 2021-09-13 00:33:54
modDatetime: 2024-05-20 08:22:04
slug: dotnet-读-WPF-源代码笔记-渲染收集是如何触发
description: "dotnet 读 WPF 源代码笔记 渲染收集是如何触发"
tags:
  - WPF
  - 渲染
  - WPF源代码
---




在 WPF 里面，渲染可以从架构上划分为两层。上层是 WPF 框架的 OnRender 之类的函数，作用是收集应用程序渲染的命令。上层将收集到的应用程序绘制渲染的命令传给下层，下层是 WPF 的 GFX 层，作用是根据收到的渲染的命令绘制出界面。本文所聊的是渲染上层部分，在 WPF 框架是如何做到界面刷新渲染，包括此调用的顺序以及框架逻辑

<!--more-->


<!-- CreateTime:2021/9/13 8:33:54 -->


<!-- 标签：WPF，渲染，WPF源代码 -->
<!-- 发布 -->

阅读本文之前，我期望读者有一定的 WPF 渲染基础，以及了解 WPF 的大架构。本文不会涉及到任何底层渲染相关的知识。阅读本文，你将了解到依赖属性和 WPF 渲染层之间的关系

在开始之前，必须明确一点的是，不是所有的 WPF 应用行为，如依赖属性变更，都会触发渲染变更。有渲染变更不代表立刻将会触发界面刷新，从触发渲染变更到界面刷新，还有以下步骤： 触发渲染，渲染上层收集应用层的绘制渲染的命令，触发渲染线程接收绘制渲染的命令，渲染的下层根据绘制渲染的命令进入 DirectX 渲染管线，由 DirectX 完成后续渲染步骤

本文所聊到的仅仅只是以上的触发渲染，渲染上层收集应用层的绘制渲染的命令这两个步骤。关于 WPF 渲染部分的大框架还请参阅 [WPF 渲染原理](https://lindexi.gitee.io/post/WPF-%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86.html )

本篇博客基于 [WPF 更改 DrawingVisual 的 RenderOpen 用到的对象的内容将持续影响渲染效果](https://blog.lindexi.com/post/WPF-%E6%9B%B4%E6%94%B9-DrawingVisual-%E7%9A%84-RenderOpen-%E7%94%A8%E5%88%B0%E7%9A%84%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%86%85%E5%AE%B9%E5%B0%86%E6%8C%81%E7%BB%AD%E5%BD%B1%E5%93%8D%E6%B8%B2%E6%9F%93%E6%95%88%E6%9E%9C.html ) 博客进行更深入 WPF 框架源代码探讨

为了能更好说明 WPF 框架的行为，本文开始先介绍一个测试代码用来测试 WPF 的行为


在本文实际开始之前，还请大家思考一个问题，在 WPF 中，调用 DrawingVisual 的 RenderOpen 方法返回的 DrawingContext 对象里面，传入的参数的属性值影响渲染结果，是一次性的，还是持续的？什么是一次性的，什么是持续的？换个问法是如果传入的值在 DrawingContext 关闭之后，变更属性，此时是否还会影响到渲染结果。答案的是或否就决定了 WPF 底层的实现行为，是否在 DrawingContext 关闭的时候，就直接触发渲染模块，或者就取出了传入的值的数据，断开和传入值之间的影响。如下面最简单的代码

```csharp
            var drawingVisual = new DrawingVisual();
            var translateTransform = new TranslateTransform();
            using (var drawingContext = drawingVisual.RenderOpen())
            {
                drawingContext.PushTransform(translateTransform);

                var rectangleGeometry = new RectangleGeometry(new Rect(0, 0, 10, 10));
                drawingContext.DrawGeometry(Brushes.Red, null, rectangleGeometry);

                drawingContext.Pop();
            }

            SetTranslateTransform(translateTransform);

        private async void SetTranslateTransform(TranslateTransform translateTransform)
        {
            while (true)
            {
                translateTransform.X++;

                await Task.Delay(TimeSpan.FromMilliseconds(10));
            }
        }
```

以上代码在 SetTranslateTransform 函数里面，不断修改 TranslateTransform 的属性，是否还会影响到 DrawingVisual 的渲染效果？带着这个问题，进入到本文的开始

众所周知，只有在渲染收集触发的时候，才会收集应用层的渲染数据。以 TranslateTransform 为例，在更改 TranslateTransform 的 X 或 Y 属性的值的时候，如果没有给此 TranslateTransform 对象建立直接渲染关系，也就是 Freezable 的 AddSingletonContext 方法没有被传入渲染的直接元素联系的时候，对属性值的更改只是和更改 CLR 自动属性一样，不会有任何的通知和变更。也就是说在 TranslateTransform 对象想要影响到最终界面渲染，需要被动在渲染收集时，才会更新数据

```csharp
class Freezable
{
        private void AddSingletonContext(DependencyObject context, DependencyProperty property)
        {
            // 忽略建立联系代码，这里面比较绕。核心逻辑就是取出 context 里面的 SingletonHandler 委托
            // 以上的 context 是 RenderData 类型。此 SingletonHandler 委托将会在继承 Freezable 的类型的依赖属性变更的时候，支持被调用
            // 对于建立直接联系的对象，如存放在 UIElement 上的 TranslateTransform 属性，此时的 SingletonHandler 对象就是由 UIElement 发起的订阅
        }
}
```

如在 [WPF 更改 DrawingVisual 的 RenderOpen 用到的对象的内容将持续影响渲染效果](https://blog.lindexi.com/post/WPF-%E6%9B%B4%E6%94%B9-DrawingVisual-%E7%9A%84-RenderOpen-%E7%94%A8%E5%88%B0%E7%9A%84%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%86%85%E5%AE%B9%E5%B0%86%E6%8C%81%E7%BB%AD%E5%BD%B1%E5%93%8D%E6%B8%B2%E6%9F%93%E6%95%88%E6%9E%9C.html ) 博客所聊到的实现方式，通过在 DrawingVisual 里面设置一个 TranslateTransform 对象，再将 DrawingVisual 放入到 UIElement 里面。如此行为将让 TranslateTransform 无法和 UIElement 建立直接的联系。以上进入 AddSingletonContext 函数将传入的是属于 DrawingVisual 的 RenderData 对象，这就意味着当 TranslateTransform 的属性变更时，仅仅只能通知到 DrawingVisual 对象，而不能通知到更上层的 UIElement 对象

这完全取决于此应用代码的实现，为了让大家不需要在两篇博客之间来回跳，以下给出用到 [WPF 更改 DrawingVisual 的 RenderOpen 用到的对象的内容将持续影响渲染效果](https://blog.lindexi.com/post/WPF-%E6%9B%B4%E6%94%B9-DrawingVisual-%E7%9A%84-RenderOpen-%E7%94%A8%E5%88%B0%E7%9A%84%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%86%85%E5%AE%B9%E5%B0%86%E6%8C%81%E7%BB%AD%E5%BD%B1%E5%93%8D%E6%B8%B2%E6%9F%93%E6%95%88%E6%9E%9C.html ) 博客的核心代码

以下是一个继承 UIElement 的 Foo 类

```csharp
    class Foo : UIElement
    {
        public Foo()
        {
            var drawingVisual = new DrawingVisual();
            var translateTransform = new TranslateTransform();
            using (var drawingContext = drawingVisual.RenderOpen())
            {
                var rectangleGeometry = new RectangleGeometry(new Rect(0, 0, 10, 10));

                drawingContext.PushTransform(translateTransform);

                drawingContext.DrawGeometry(Brushes.Red, null, rectangleGeometry);

                drawingContext.Pop();
            }

            Visual = drawingVisual;

            SetTranslateTransform(translateTransform);
        }

        private async void SetTranslateTransform(TranslateTransform translateTransform)
        {
            while (true)
            {
                translateTransform.X++;

                if (translateTransform.X > 700)
                {
                    translateTransform.X = 0;
                }

                await Task.Delay(TimeSpan.FromMilliseconds(10));
            }
        }

        protected override Visual GetVisualChild(int index) => Visual;
        protected override int VisualChildrenCount => 1;

        private Visual Visual { get; }
    }
```

以下是使用此 Foo 的 xaml 代码

```xml
    <Grid>
        <local:Foo x:Name="Foo"></local:Foo>
    </Grid>
```

以上就是本文所有用到的测试辅助的代码

为了更好了解 WPF 框架的底层行为，以上代码被我放入到我私有的 WPF 仓库中，作为 WPF 仓库里面的 demo 的代码。可以从 [github](https://github.com/dotnet-campus/wpf/tree/c6435f597ebe2044d74a6b29ca8e92a23c072549/Microsoft.Dotnet.Wpf.sln) 获取本文以上测试代码，获取代码之后，请将 WPFDemo 作为启动项目

以上就是本文构建的测试逻辑。下面将回到主题部分

从 TranslateTransform 属性影响界面逻辑渲染入手，在变更 TranslateTransform 属性时，将因为没有和 Foo 此 UIElement 建立直接的逻辑关系，同时所在的 DrawingVisual 也没有在 Foo 里面被调用 AddVisualChild 方法而加入到可视化树（视觉树）上，因此 TranslateTransform 属性的变更无法通知到 WPF 布局层

更好利用此特性来测试 WPF 框架层的行为。在此先回答一个问题，为什么不通过静态代码阅读了解框架的行为？原因是 WPF 框架太过庞大，我在静态代码阅读过程将受限于记忆而无法从全局把握 WPF 框架逻辑。因此更多的是需要靠测试代码来了解 WPF 框架的逻辑

在 Dispatcher 对象里面，从 VisualStudio 的调试窗口可以看到有没有开放的几个 Reserved 属性，其中一项就是专门给 MediaContext 所使用。如命名，此 MediaContext 类型就是 WPF 渲染上层的渲染上下文，依靠此渲染上下文可以用来控制 WPF 的多媒体（渲染）层的行为

在 WPF 框架里面可以随处见到从 Dispatcher 里面获取 MediaContext 对象的代码

```csharp
MediaContext mctx = MediaContext.From(dispatcher);
```

从众多的（不包括动画）触发渲染进入之后，都会汇总到 MediaContext 的 PostRender 方法。此方法是给 Dispatcher 传递一个渲染消息，也就是优先级为 Render 的 RenderMessage 任务。以下是有删减的 PostRender 方法代码

```csharp
        internal void PostRender()
        {
        	// 如果当前没有在进入渲染状态，那么开始触发渲染消息
            if (!_isRendering)
            {
                if (_currentRenderOp != null)
                {
                    // 如果已有渲染消息在消息队列里，那么更改优先级确保是 Render 优先级。此渲染消息将会很快被调度
                    // If we already have a render operation in the queue, we should
                    // change its priority to render priority so it happens sooner.
                    _currentRenderOp.Priority = DispatcherPriority.Render;
                }
                else
                {
                    // 如果还没有渲染消息，那么给 Dispatcher 传入优先级为 Render 的渲染消息
                    // If we don't have a render operation in the queue, add one at
                    // render priority.
                    _currentRenderOp = Dispatcher.BeginInvoke(DispatcherPriority.Render, _renderMessage, null);
                }
            }
        }
```

以上代码的 `_renderMessage` 就是具体的执行渲染消息，定义如下

```csharp
        internal MediaContext(Dispatcher dispatcher)
        {
             _renderMessage = new DispatcherOperationCallback(RenderMessageHandler);
        }

private DispatcherOperationCallback _renderMessage;
```

歪楼一下，在 WPF 里面，通用的调度使用的委托都是 DispatcherOperationCallback 类型，使用此类型是为了性能考虑。在 Dispatcher 的 WrappedInvoke 方法里面，将会通过 as 判断当前传入的 Delegate 委托类型。使用框架内置的 Action 和 DispatcherOperationCallback 等类型，可以使用明确类型的委托调用，而不需要使用 DynamicInvoke 调用委托来提升性能。详细请看 [github 上大佬的更改](https://github.com/dotnet/wpf/pull/4757) 内容

通过以上代码可以了解到渲染消息的在于 MediaContext 的 RenderMessageHandler 方法里面。此方法将会被 Dispatcher 使用 Render 优先级进行调用，也会被各个模块触发渲染时加入 Dispatcher 队列

```csharp
            private object RenderMessageHandler(
              object resizedCompositionTarget /* can be null if we are not resizing*/
            )
            {
                 // 忽略调试用的逻辑 
                 RenderMessageHandlerCore(resizedCompositionTarget);
            }
```

接着在 RenderMessageHandlerCore 里面将会层层调用，调用到 Render 方法。此方法实现以下功能

- 渲染每个注册的 ICompositionTarget 以完成批处理。 渲染都是一批批处理的
- 更新收集的渲染数据
- 将收集到的数据提交给下层渲染

核心的步骤就是在 更新收集的渲染数据 这一步。这里也就能解答 WPF 的渲染收集是如何触发的

在 更新收集的渲染数据 里面的实现代码如下

```csharp
        private void RaiseResourcesUpdated()
        {
            if (_resourcesUpdatedHandlers != null)
            {
                DUCE.ChannelSet channelSet = GetChannels();
                _resourcesUpdatedHandlers(channelSet.Channel, false /* do not skip the "on channel" check */);
                _resourcesUpdatedHandlers = null;
            }
        }
```

这里的 `_resourcesUpdatedHandlers` 是委托，在各个资源，如 TranslateTransform 都会注册到 MediaContext 里，也就是在这一层可以让资源可以收到渲染更新的消息

如在 TranslateTransform 的基类 Animatable 里面，就在 RegisterForAsyncUpdateResource 方法注册，代码如下

```csharp
        internal void RegisterForAsyncUpdateResource()
        {
            MediaContext mediaContext = MediaContext.From(Dispatcher);

            if (!resource.GetHandle(mediaContext.Channel).IsNull)
            {
                mediaContext.ResourcesUpdated += new MediaContext.ResourcesUpdatedHandler(UpdateResource);
            }
        }
```

如上文，在 WPF 框架里面，可以非常方便从 Dispatcher 拿到 MediaContext 对象，从而也很方便加上 ResourcesUpdated 委托

在此 ResourcesUpdated 事件触发的时候，就需要各个资源向 DUCE.Channel 写入资源的数据，让下层渲染使用。如 TranslateTransform 的实现代码

```csharp
        internal override void UpdateResource(DUCE.Channel channel, bool skipOnChannelCheck)
        {
            if (skipOnChannelCheck || _duceResource.IsOnChannel(channel))
            {
                base.UpdateResource(channel, skipOnChannelCheck);
                DUCE.MILCMD_TRANSLATETRANSFORM data;
                unsafe
                {
                    data.Type = MILCMD.MilCmdTranslateTransform;
                    data.Handle = _duceResource.GetHandle(channel);
                    data.X = X;
                    data.Y = Y;

                    channel.SendCommand(
                        (byte*)&data,
                        sizeof(DUCE.MILCMD_TRANSLATETRANSFORM));
                }
            }
        }
```

回到本文开始的问题，在 WPF 调用 DrawingContext 的关闭时，此时不会立刻执行界面渲染逻辑。此时离实际的界面渲染还很远，需要先通知到 MediaContext 将渲染消息加入到 Dispatcher 队列。等待 Dispatcher 的调度，接着进入 MediaContext 的层层 Render 方法，再由 Render 方法触发资源收集更新的事件，依靠监听事件让各个资源向 Channel 写入资源的当前状态信息。最后告诉下层渲染，批量收集渲染数据完成，可以开始执行下层渲染逻辑

更多渲染相关博客请看 [渲染相关](https://blog.lindexi.com/post/%E6%B8%B2%E6%9F%93 )


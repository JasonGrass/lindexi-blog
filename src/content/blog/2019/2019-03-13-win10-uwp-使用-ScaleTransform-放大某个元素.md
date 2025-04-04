---
title: "win10 uwp 使用 ScaleTransform 放大某个元素"
pubDatetime: 2019-03-13 11:05:56
modDatetime: 2024-08-06 12:43:36
slug: win10-uwp-使用-ScaleTransform-放大某个元素
description: "win10 uwp 使用 ScaleTransform 放大某个元素"
tags:
  - Win10
  - UWP
---




本文告诉大家如何通过 ScaleTransform 放大元素
放大一个元素的方法有很多个，通过 ScaleTransform 放大是比较清真的

<!--more-->


<!-- CreateTime:2019/3/13 19:05:56 -->

<!-- csdn -->

在 UWP 中 ScaleTransform 是属于 RenderTransform 的内容，所有的 UIElement 都有 RenderTransform 属性，通过设置这个属性可以做到在运行的时候修改渲染的元素

如新建一个简单的 UWP 程序，里面就放一个按钮

```csharp
        <Button VerticalAlignment="Center" HorizontalAlignment="Center" Content="Click" Click="Button_OnClick">
        </Button>
```

如果想要将按钮显示放大两倍，简单的方法是使用 ScaleTransform 设置两个方向放大

修改一下代码

```csharp
            <StackPanel Orientation="Horizontal" VerticalAlignment="Center" HorizontalAlignment="Center">
                <Button Margin="10,10,10,10" Content="放大前按钮">

                </Button>
                <Button VerticalAlignment="Center" HorizontalAlignment="Center" Content="放大的按钮">
                    <Button.RenderTransform>
                        <ScaleTransform x:Name="ScaleTransform" ScaleX="2" ScaleY="2"></ScaleTransform>
                    </Button.RenderTransform>
                </Button>
            </StackPanel>
```

<!-- ![](images/img-win10 uwp 使用 ScaleTransform 放大某个元素0.png) -->

![](images/img-modify-7940423de37034afb6fb78684f4fe024.png)

代码请看 [github](https://github.com/lindexi/lindexi_gd/tree/2c00ce47ec76474b95953bbfc17e286d9938d534/HearqicalbasteKajalltearfearnahir)

从上面看到 ScaleTransform 支持两个方向的放大，可以设置两个方向为不同的值

其实 ScaleTransform 还可以设置放大中心，也就是从那个点为中心放大

默认没有设置是从 (0,0) 点也就是左上角的点开始放大，放大之后会保持左上角的坐标不变

很多时候会使用到的是从中心放大，从中心放大需要设置放大元素的中心点，请看代码，在按钮点击的时候放大，中心点是按钮中心

```csharp
<Button VerticalAlignment="Center" HorizontalAlignment="Center" Content="放大的按钮" Click="Button_OnClick">
    <Button.RenderTransform>
        <ScaleTransform x:Name="ScaleTransform" ScaleX="1" ScaleY="1"></ScaleTransform>
    </Button.RenderTransform>
</Button>
```

```csharp
        private void Button_OnClick(object sender, RoutedEventArgs e)
        {
            var button = (Button) sender;
            ScaleTransform.CenterX = button.ActualWidth / 2;
            ScaleTransform.CenterY = button.ActualHeight / 2;

            ScaleTransform.ScaleX = 1.5;
            ScaleTransform.ScaleY = 1.5;
        }
```
<!-- ![](images/img-中心放大.gif) -->

![](images/img-modify-2965814a70d5a6d13f47a1f71feb97e7.png)

对比一下不设置的从左上角放大


```csharp
        private void Button_OnClick(object sender, RoutedEventArgs e)
        {
            ScaleTransform.ScaleX = 1.5;
            ScaleTransform.ScaleY = 1.5;
        }
```


![](images/img-modify-a0c072ce88722db9138dd39a260b6ecf.png)

那么如何做缩放动画

下面我使用一个没有一点优点的方法做动画，请小伙伴不要学习这个写法

```csharp
        private void Button_OnClick(object sender, RoutedEventArgs e)
        {
            Task.Run(async () =>
            {
                while (true)
                {
                    await Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                    {
                        ScaleTransform.ScaleX++;
                        ScaleTransform.ScaleY++;
                    });

                    await Task.Delay(100);
                }
            });
        }
```

我开启一个线程，使用一个无限循环，在里面使用 Task.Delay 做延迟

因为在 UWP 不是主线程是不能访问主线程的元素，所以就需要通过 Dispatcher.RunAsync 让代码在主线程运行

那么清真一点的方法是如何做呢？通过 xaml 写动画倒是一个不错的方法

```csharp
                <Button VerticalAlignment="Center" HorizontalAlignment="Center" Content="放大的按钮" Click="Button_OnClick">
                    <Button.Resources>
                        <Storyboard x:Key="Storyboard">
                            <DoubleAnimation Storyboard.TargetName="ScaleTransform" Storyboard.TargetProperty="ScaleX" To="1.5" Duration="0:0:1"></DoubleAnimation>
                            <DoubleAnimation Storyboard.TargetName="ScaleTransform" Storyboard.TargetProperty="ScaleY" To="1.5" Duration="0:0:1"></DoubleAnimation>
                        </Storyboard>
                    </Button.Resources>
                    <Button.RenderTransform>
                        <ScaleTransform x:Name="ScaleTransform" ScaleX="1" ScaleY="1"></ScaleTransform>
                    </Button.RenderTransform>
                </Button>
```

这时通过点击按钮拿到资源，运行动画

```csharp
        private void Button_OnClick(object sender, RoutedEventArgs e)
        {
            var button = (Button) sender;

            var storyboard = (Storyboard) button.Resources["Storyboard"];

            storyboard.Begin();
        }
```

[ScaleTransform Class (Windows.UI.Xaml.Media) - Windows UWP applications](https://docs.microsoft.com/en-us/uwp/api/windows.ui.xaml.media.scaletransform )


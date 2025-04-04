---
title: "WPF 设置 ShowInTaskbar 对窗口最小化的影响"
pubDatetime: 2021-03-18 08:29:44
modDatetime: 2024-08-06 12:43:42
slug: WPF-设置-ShowInTaskbar-对窗口最小化的影响
description: "WPF 设置 ShowInTaskbar 对窗口最小化的影响"
tags:
  - WPF
---




在 WPF 中，如果设置了 ShowInTaskbar 为 False 那么窗口将不会在任务栏显示。此时如果设置窗口最小化，那么窗口将会收起来作为没有任务栏时的显示方法

<!--more-->


<!-- CreateTime:2021/3/18 16:29:44 -->

<!-- 发布 -->

如下面代码

```xml
<Window x:Class="BekairlilearDujalgereno.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:local="clr-namespace:BekairlilearDujalgereno"
        mc:Ignorable="d" 
        ShowInTaskbar="False"
        Title="MainWindow" Height="450" Width="800">
  <Grid>
    <Button HorizontalAlignment="Center" VerticalAlignment="Center" Content="最小化" Click="Button_OnClick" />
  </Grid>
</Window>
```

通过 `ShowInTaskbar="False"` 设置窗口不在任务栏显示

在点击按钮的时候，设置最小化

```csharp
        private void Button_OnClick(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Minimized;
        }
```

此时窗口将会到左下角，作为一个只有标题栏的窗口存在，如下图

<!-- ![](images/img-WPF 设置 ShowInTaskbar 对窗口最小化的影响0.png) -->

![](images/img-modify-c48e6745a340f6a8915d7b2f6ecc24a0.jpg)

如果不想要这个标题栏窗口，那么除非不要使用最小化，而是使用 `Visibility = Visibility.Collapsed` 或者 Hide 方法，如下面代码

```csharp
        private void Button_OnClick(object sender, RoutedEventArgs e)
        {
            Visibility = Visibility.Collapsed;
            //WindowState = WindowState.Minimized;
        }
```

此时点击按钮就可以让窗口消失，当然，使用 Hide 也是相同的效果

以上代码放在 [github](https://github.com/lindexi/lindexi_gd/tree/9c68faa6/BekairlilearDujalgereno ) 和 [gitee](https://gitee.com/lindexi/lindexi_gd/tree/9c68faa6/BekairlilearDujalgereno ) 欢迎小伙伴访问


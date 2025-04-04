---
title: "win10 uwp 如何拖动一个TextBlock的文字到另一个TextBlock "
pubDatetime: 2018-02-13 09:23:03
modDatetime: 2024-05-20 08:22:05
slug: win10-uwp-如何拖动一个TextBlock的文字到另一个TextBlock-
description: "win10 uwp 如何拖动一个TextBlock的文字到另一个TextBlock "
tags:
  - Win10
  - UWP
---




我在堆栈网看到有人问 如何拖动一个TextBlock的文字到另一个TextBlock 于是看到一个大神给出的方法，下面我就来和大家说下如何拖动

<!--more-->


<!-- CreateTime:2018/2/13 17:23:03 -->


<div id="toc"></div>



一开始我们需要一个界面，就放两个TextBlock 一个是源，一个目标。我们拖动源到目标。


```xml

<Page
    x:Class="Textvt.MainPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="using:Textvt"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d">

    <Grid Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">
        <StackPanel Background="{ThemeResource ApplicationPageBackgroundThemeBrush}" Padding="30">

            <Border BorderBrush="Azure" BorderThickness="2">
                <TextBlock x:Name="TextSource" 
                           Text="我是源" 
                           CanDrag="True" 
                           DragStarting="Txtsource_OnDragStarting"  />
            </Border>
            <Border Margin="20" BorderBrush="Azure" BorderThickness="2"
                    AllowDrop="True" >
                <TextBlock x:Name="TextTarget" Text="目标TextBlock" 
                           Drop="Txttarget_OnDrop"
                           Height="50" Width="400"  
                           AllowDrop="True" 
                           DragEnter="Txttarget_OnDragEnter"/>
            </Border>
        </StackPanel>
    </Grid>
</Page>

  
```

在xaml.cs 需要3个事件，开始拖放，拖放，拖放进入。

其中拖放进入是设置鼠标显示的字和其他的东西，可以不要这个函数，不会影响功能。


```csharp
        private void Txtsource_OnDragStarting(UIElement sender, DragStartingEventArgs args)
        {
            //开始拖放
            //设置拖放文字，文字是我们点击的TextBlock
            args.Data.SetText(TextSource.Text);
        }

        private async void Txttarget_OnDrop(object sender, DragEventArgs e)
        {
            //如果有文字，那么就是把他放在要拖放的TextBlock
            bool hasText = e.DataView.Contains(StandardDataFormats.Text);
            //显示复制还是没有
            //拖动显示可以去我之前写的 http://blog.csdn.net/lindexi_gd/article/details/49757187?locationNum=2&fps=1
            e.AcceptedOperation = hasText ? DataPackageOperation.Copy : DataPackageOperation.None;
            if (hasText)
            {
                var text = await e.DataView.GetTextAsync();
                TextTarget.Text += "\n" + text;
            }
        }

        private void Txttarget_OnDragEnter(object sender, DragEventArgs e)
        {
            
            bool hasText = e.DataView.Contains(StandardDataFormats.Text);
            e.AcceptedOperation = hasText ? DataPackageOperation.Copy : DataPackageOperation.None;
            if (hasText)
            {
                if (e.DragUIOverride != null)
                {
                    e.DragUIOverride.Caption = "Drop here to insert text";
                }
            }
        }
```

代码：[http://download.csdn.net/detail/lindexi_gd/9739764](http://download.csdn.net/detail/lindexi_gd/9739764) 可以的话给点积分。

问题原文：

https://stackoverflow.com/questions/41662650/how-to-move-text-from-one-textblock-to-another-textblock-using-drag-and-drop-in


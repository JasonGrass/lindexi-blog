---
title: "win10 uwp 禁用 ScrollViewer 交互"
pubDatetime: 2019-01-25 13:45:37
modDatetime: 2024-05-20 08:22:05
slug: win10-uwp-禁用-ScrollViewer-交互
description: "win10 uwp 禁用 ScrollViewer 交互"
tags:
  - Win10
  - UWP
---




如果在 UWP 有一个控件里面有 ScrollViewer 控件，那么因为默认的 ScrollViewer 会使用触摸的交互，这样在控件就收不到触摸的交互

<!--more-->


<!-- CreateTime:2019/1/25 21:45:37 -->

<!-- csdn -->

通过 `VerticalScrollMode="Disabled" HorizontalScrollMode="Disabled"` 可以关闭 ScrollViewer 交互

接下来就是简单告诉大家如何使用 ScrollViewer 在禁用默认交互还让 ScrollViewer 滑动，先创建一个简单的 UWP 项目

打开 xaml 添加一点代码，创建一个 Canvas 放在 ScrollViewer 内，在里面放一个矩形，通过这个矩形就可以知道有没有移动

```csharp
        <ScrollViewer>
            <Canvas Width="100000" Height="10000000">
                <Rectangle Width="100" Height="100" Fill="Black" 
                           Canvas.Left="100" Canvas.Top="100" />
            </Canvas>
        </ScrollViewer>
```

创建的 ScrollViewer 只有对水平做滑动，尝试用触摸滑动矩形，会发现只能通过垂直滑动

如果想水平也可以滚动，需要设置 HorizontalScrollBarVisibility 属性，设置为 Auto Hidden  Visible 都可以

```csharp
        <ScrollViewer HorizontalScrollBarVisibility="Hidden">
            <Canvas Width="100000" Height="10000000">
                <Rectangle Width="100" Height="100" Fill="Black" 

                           Canvas.Left="100" Canvas.Top="100" />
            </Canvas>
        </ScrollViewer>
```

现在再试试触摸矩形

如果现在尝试拿到 滚动条外面的 Grid 的 Manipulation 事件，可以看到没被被调用

```csharp
    <Grid Background="Transparent" ManipulationMode="TranslateX,TranslateY" ManipulationDelta="Grid_OnManipulationDelta">
        <ScrollViewer HorizontalScrollBarVisibility="Hidden"
                      HorizontalScrollMode="Disabled"
                      VerticalScrollMode="Disabled">
            <Canvas  Width="100000" Height="10000000">
                <Rectangle Width="100" Height="100" Fill="Black" 
                           Canvas.Left="100" Canvas.Top="100" />
            </Canvas>
        </ScrollViewer>
    </Grid>

        private void Grid_OnManipulationDelta(object sender, ManipulationDeltaRoutedEventArgs e)
        {
            
        }
```

这里需要设置 Grid 的背景和设置 ManipulationMode 可以水平或垂直，设置 Grid 的背景是让 Grid 有命中测试，这样 UWP 才知道用户点击到哪个控件，通过 ManipulationMode 才可以让事件知道可以如何做

那么如何让 Grid 接收到 Manipulation 或者 Pointer 事件？

尝试下面的代码

```csharp
        <ScrollViewer HorizontalScrollBarVisibility="Hidden"
                      HorizontalScrollMode="Disabled"
                      VerticalScrollMode="Disabled">
                      ……
        </ScrollViewer>
```

此时就可以看到 Grid 收到 Pointer 事件

但是如果想要 ScrollViewer 外面的控件可以收到交互同时想要让 ScrollViewer 可以和之前一样，那么就需要自己写一些代码

首先给 ScrollViewer 命名，这样在后台代码才可以使用

```csharp
        private void Grid_OnManipulationDelta(object sender, ManipulationDeltaRoutedEventArgs e)
        {
            ScrollViewer.ChangeView(ScrollViewer.HorizontalOffset - e.Delta.Translation.X,
                ScrollViewer.VerticalOffset - e.Delta.Translation.Y, null, true);
        }
```

现在尝试运行一下代码，才不告诉大家 ChangeView 有一个属性需要修改为 true 看起来清真


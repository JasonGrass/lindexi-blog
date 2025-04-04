---
title: "WPF 使用基于 Chromium 内核的 Microsoft Edge 封装的 WebView2 控件"
pubDatetime: 2020-08-25 00:54:05
modDatetime: 2024-05-20 08:22:03
slug: WPF-使用基于-Chromium-内核的-Microsoft-Edge-封装的-WebView2-控件
description: "WPF 使用基于 Chromium 内核的 Microsoft Edge 封装的 WebView2 控件"
tags:
  - WPF
---




现在是 2020.08.23 当前这个技术依然是预览版，使用 WebView2 只需要通过 NuGet 安装库，可以支持 Win7 和 Win8 和 Win10 系统，无 IE 依赖。内核使用 Chromium 内核，顶层技术是 Microsoft Edge 封装

<!--more-->


<!-- CreateTime:2020/8/25 8:54:05 -->




创建一个 WPF 项目，项目框架要求最低版本是 .NET Framework 4.6.2 或以上， 或 .NET Core 3.0 以上版本

使用 NuGet 搜 Microsoft.Web.WebView2 勾选预览版

![](images/img-installnuget.png)

打开 MainWindow.xaml 添加命名空间

```
xmlns:wv2="clr-namespace:Microsoft.Web.WebView2.Wpf;assembly=Microsoft.Web.WebView2.Wpf"
```

添加之后的 MainWindow.xaml 文件内容大概如下

```xml
<Window x:Class="Lindexi.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:wv2="clr-namespace:Microsoft.Web.WebView2.Wpf;assembly=Microsoft.Web.WebView2.Wpf"
        mc:Ignorable="d"
        Title="LindexiDoubi"
        Height="450" Width="800">

    <Grid>

    </Grid>
</Window>
```

在 Grid 添加 WebView2 控件，如下面代码

```xml
<Grid>
    <wv2:WebView2 Name="webView"
                  Source="http://blog.lindexi.com/"/>
</Grid>
```

此时运行项目，即可看到打开了内嵌的浏览器以及自动跳转我的博客

更多使用方法请看官方文档 [适用于 WPF 应用的 Microsoft Edge Web 视图2 - Microsoft Edge Development](https://docs.microsoft.com/zh-cn/microsoft-edge/WebView2/gettingstarted/wpf)


---
title: "WPF 引用 UWP 控件 不打包为 MSIX 分发的方法"
pubDatetime: 2021-07-28 12:35:00
modDatetime: 2024-05-20 08:22:03
slug: WPF-引用-UWP-控件-不打包为-MSIX-分发的方法
description: "WPF 引用 UWP 控件 不打包为 MSIX 分发的方法"
tags:
  - WPF
  - UWP
---




按照微软的官方文档，大部分的文档都会说如果用了 XAML Islands 等技术的时候，需要新建一个打包项目，将 WPF 应用打包为 msix 等才可以进行分发和使用。但是实际上不打包也可以，此时可以和此前的 Win32 应用一样的分发方式进行分发，可以支持到 Win7 系统，当然了在 Win7 系统上可用不了 UWP 的控件，但是至少应用软件自身可以在 Win7 继续运行的。可以通过判断系统版本决定功能是否开放，如是 Win10 版本，那么开放 UWP 控件部分的使用

<!--more-->


<!-- CreateTime:2021/7/28 20:35:00 -->

<!-- 发布 -->

如果新建一个空的 .NET Core 3.1 的 WPF 项目，然后只是安装了必要的 NuGet 包之后，就在 XAML 界面里面添加了 UWP 的控件，如笔迹控件。那么此时将不能成功运行应用。如下面的代码方式，在 csproj 添加如下的代码

```xml
  <ItemGroup>
    <PackageReference Include="Microsoft.Toolkit.Win32.UI.SDK" Version="6.1.2" />
    <PackageReference Include="Microsoft.Toolkit.Win32.UI.XamlApplication" Version="6.1.3" />
    <PackageReference Include="Microsoft.Toolkit.Wpf.UI.Controls" Version="6.1.2" />
    <PackageReference Include="Microsoft.Toolkit.Wpf.UI.XamlHost" Version="6.1.2" />
  </ItemGroup>
```

在 XAML 里面使用如下代码引用了 UWP 的笔迹控件

```xml
<Window x:Class="LaykearduchuNachairgurharhear.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:local="clr-namespace:LaykearduchuNachairgurharhear"
        xmlns:controls="clr-namespace:Microsoft.Toolkit.Wpf.UI.Controls;assembly=Microsoft.Toolkit.Wpf.UI.Controls"
        mc:Ignorable="d"
        Title="MainWindow" Height="450" Width="800">
  <Grid>
    <controls:InkCanvas x:Name="InkCanvas" DockPanel.Dock="Top" Loaded="InkCanvas_Loaded" />
  </Grid>
</Window>
```

此时运行应用将会报错，提示没有在 Win10 下运行，如下面代码

```
Exception: 灾难性故障

WindowsXamlManager and DesktopWindowXamlSource are supported for apps targeting Windows version 10.0.18226.0 and later.  Please check either the application manifest or package manifest and ensure the MaxTestedVersion property is updated.
```

解决方法有两个，第一个是通过微软文档说的打包的方法，再新建一个打包工程，在这个工程里面打包作为 MSIX 安装包。第二个方法是在原有的 WPF 项目中添加应用清单，在应用清单设置可以在 Win10 使用

右击项目添加应用清单 App.manifest 文件，在此文件添加 `<supportedOS Id="{8e0f7a12-bfb3-4fe8-b9a5-48fd50a15a9a}" />` 表示支持 Win10 系统以及加上 DPI 功能，以下是我的 App.manifest 文件

```xml
<?xml version="1.0" encoding="utf-8"?>
<assembly manifestVersion="1.0" xmlns="urn:schemas-microsoft-com:asm.v1">
  <assemblyIdentity version="1.0.0.0" name="MyApplication.app"/>
  <trustInfo xmlns="urn:schemas-microsoft-com:asm.v2">
    <security>
      <requestedPrivileges xmlns="urn:schemas-microsoft-com:asm.v3">
        <requestedExecutionLevel level="asInvoker" uiAccess="false" />
      </requestedPrivileges>
    </security>
  </trustInfo>

  <compatibility xmlns="urn:schemas-microsoft-com:compatibility.v1">
    <application>
      <!-- 设计此应用程序与其一起工作且已针对此应用程序进行测试的
           Windows 版本的列表。取消评论适当的元素，
           Windows 将自动选择最兼容的环境。 -->

      <!-- Windows 10 -->
      <supportedOS Id="{8e0f7a12-bfb3-4fe8-b9a5-48fd50a15a9a}" />

    </application>
  </compatibility>

  <!-- 指示该应用程序可以感知 DPI 且 Windows 在 DPI 较高时将不会对其进行
       自动缩放。Windows Presentation Foundation (WPF)应用程序自动感知 DPI，无需
       选择加入。选择加入此设置的 Windows 窗体应用程序(目标设定为 .NET Framework 4.6 )还应
       在其 app.config 中将 "EnableWindowsFormsHighDpiAutoResizing" 设置设置为 "true"。-->
  <application xmlns="urn:schemas-microsoft-com:asm.v3">
    <windowsSettings>
      <dpiAware xmlns="http://schemas.microsoft.com/SMI/2005/WindowsSettings">true/PM</dpiAware>
      <dpiAwareness xmlns="http://schemas.microsoft.com/SMI/2016/WindowsSettings">PerMonitorV2, PerMonitor</dpiAwareness>
    </windowsSettings>
  </application>

</assembly>
```

此时即可让此 WPF 应用运行。如果想要发布出去，还请右击项目选择发布，就和发布其他 .NET Core 应用的方式进行发布

以上的代码放在 [github](https://github.com/lindexi/lindexi_gd/tree/eb289cd0d1c7e273df4c7bae6a7bcd17fb12aa6a/LaykearduchuNachairgurharhear) 和 [gitee](https://gitee.com/lindexi/lindexi_gd/tree/eb289cd0d1c7e273df4c7bae6a7bcd17fb12aa6a/LaykearduchuNachairgurharhear) 欢迎访问

可以通过如下方式获取本文的源代码，先创建一个空文件夹，接着使用命令行 cd 命令进入此空文件夹，在命令行里面输入以下代码，即可获取到本文的代码

```
git init
git remote add origin https://gitee.com/lindexi/lindexi_gd.git
git pull origin eb289cd0d1c7e273df4c7bae6a7bcd17fb12aa6a
```

以上使用的是 gitee 的源，如果 gitee 不能访问，请替换为 github 的源

```
git remote remove origin
git remote add origin https://github.com/lindexi/lindexi_gd.git
```

获取代码之后，进入 LaykearduchuNachairgurharhear 文件夹

更多 WPF 引用 UWP 做高性能笔迹文档请看：

- [WPF 使用 Microsoft.Toolkit.Wpf.UI.Controls 的 InkCanvas 做高性能笔迹应用](https://blog.lindexi.com/post/WPF-%E4%BD%BF%E7%94%A8-Microsoft.Toolkit.Wpf.UI.Controls-%E7%9A%84-InkCanvas-%E5%81%9A%E9%AB%98%E6%80%A7%E8%83%BD%E7%AC%94%E8%BF%B9%E5%BA%94%E7%94%A8.html )
- [WPF 使用 Microsoft.Toolkit.Wpf.UI.Controls 的 InkCanvas 时加上背景色和按钮方法](https://blog.lindexi.com/post/WPF-%E4%BD%BF%E7%94%A8-Microsoft.Toolkit.Wpf.UI.Controls-%E7%9A%84-InkCanvas-%E6%97%B6%E5%8A%A0%E4%B8%8A%E8%83%8C%E6%99%AF%E8%89%B2%E5%92%8C%E6%8C%89%E9%92%AE%E6%96%B9%E6%B3%95.html )


---
title: "dotnet 控制台 使用 Microsoft.Maui.Graphics 配合 Skia 进行绘图入门"
pubDatetime: 2022-06-29 07:03:53
modDatetime: 2024-08-06 12:43:30
slug: dotnet-控制台-使用-Microsoft.Maui.Graphics-配合-Skia-进行绘图入门
description: "dotnet 控制台 使用 Microsoft.Maui.Graphics 配合 Skia 进行绘图入门"
tags:
  - MAUI
  - MauiGraphics
  - Skia
  - SkiaSharp
  - 渲染
---




本文将告诉大家如何在 dotnet 的控制台模式下，采用 MAUI 自绘库 Microsoft.Maui.Graphics 进行绘图，设置 Microsoft.Maui.Graphics 底层调用 Microsoft.Maui.Graphics.Skia 库的 Skia 进行具体的绘图实现，此控制台可以跨平台运行，我在本机 Win10 和 WSL 的 Ubuntu 上都运行过，输出的结果图片像素级相似。本文将告诉大家如何采用 Microsoft.Maui.Graphics 进行跨平台的自绘

<!--more-->


<!-- CreateTime:2022/6/29 15:03:53 -->


<!-- 标签：MAUI,MauiGraphics,Skia,SkiaSharp,渲染 -->
<!-- 发布 -->

在开始之前，先理清一下概念。刚正式发布的 MAUI 指的是一个跨平台的 UI 框架，而 dotnet 指的是在 UI 框架下面的运行时，这是早已实现跨平台的了。本文所说的 Microsoft.Maui.Graphics 是属于 MAUI 的一个组件，是 MAUI 的渲染层里面的一个部分。相当于直接使用 Microsoft.Maui.Graphics 就是将 MAUI 的渲染里面的一个模块拆出来独立使用。可以看到 MAUI 的设计上，渲染的一个模块是可以拆处理独立使用的

<!-- ![](images/img-dotnet 控制台 使用 Microsoft.Maui.Graphics 配合 Skia 进行绘图入门0-modify-3c17a67c2191857edbda50bb746c11d3.png) -->

![](images/img-modify-692cbca10ff4dfe4cd1d924448b14284.jpg)

本文将从一个控制台开始，从比较基础的层面告诉大家如何使用 Microsoft.Maui.Graphics 进行绘图。我采用 Microsoft.Maui.Graphics.Skia 库的 Skia 进行具体的绘图实现，实现将画出的内容存放到本地文件

新建一个控制台项目，我将项目放在 `D:\lindexi\Code\SkiaSharp\SkiaSharp\BihuwelcairkiDelalurnere` 文件夹里面

按照惯例，安装 `Microsoft.Maui.Graphics.Skia` 的 NuGet 包。为了可以在 Windows Subsystem for Linux （WSL）适用于 Linux 的 Windows 子系统上的 Ubuntu 上运行，继续添加 `SkiaSharp.NativeAssets.Linux.NoDependencies` 库，详细请看 [dotnet 修复在 Linux 上使用 SkiaSharp 提示找不到 liblibSkiaSharp 库](https://blog.lindexi.com/post/dotnet-%E4%BF%AE%E5%A4%8D%E5%9C%A8-Linux-%E4%B8%8A%E4%BD%BF%E7%94%A8-SkiaSharp-%E6%8F%90%E7%A4%BA%E6%89%BE%E4%B8%8D%E5%88%B0-liblibSkiaSharp-%E5%BA%93.html )

添加完成库的 csproj 项目文件内容如下

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net6.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Maui.Graphics.Skia" Version="6.0.403" />
    <PackageReference Include="SkiaSharp.NativeAssets.Linux.NoDependencies" Version="2.88.0" />
  </ItemGroup>

</Project>
```

在 Program.cs 加上命名空间引用

```csharp
using Microsoft.Maui.Graphics;
using Microsoft.Maui.Graphics.Skia;
using SkiaSharp;
```

在 Microsoft.Maui.Graphics 里，一切的逻辑都是从 ICanvas 画板开始。这是一个接口，可以采用 SkiaCanvas 来进行实现，代码如下

```csharp
        var skiaCanvas = new SkiaCanvas();
```

而 SkiaCanvas 需要有一个具体的 Skia 绘制的画板，也就是 Canvas 属性。接下来开始构建 Skia 的画板，采用的是图片的方式，让 Skia 绘制到图片上

先新建图片的信息

```csharp
var skImageInfo = new SKImageInfo(1920, 1080, SKColorType.Bgra8888, SKAlphaType.Opaque, SKColorSpace.CreateSrgb());
```

我喜欢配置颜色采用 Bgra8888 的格式。在通用性上来说，这个 Bgra8888 是 B(Blue蓝色) G(Green绿色) R(Red 红色) 和 A(Alpha透明度) 每个分量各 8 个位的 32 位表示一个像素的格式，由于足够简单，被很多个平台和框架和硬件所支持。尽管 Bgra8888 不是效率最高的方式，但好在简单也方便理解，同时也在多个平台可以方便共用，因此在不确定选什么颜色的时候，默认采用这个格式也是不错的

通过 SKImage.Create 方法创建出图片，这个图片不是只存放磁盘里的图片，而是 Skia 的一个概念

```
using var skImage = SKImage.Create(skImageInfo);
```

为了在此 SKImage 上绘制，需要取出 SKBitmap 对象，放入到 SKCanvas 里，代码如下

```csharp
using (SKBitmap skBitmap = SKBitmap.FromImage(skImage))
{
    using (var skCanvas = new SKCanvas(skBitmap))
    {
    }
}
```

于是就获取到了 SKCanvas 的对象，可以放入到 SkiaCanvas 里面

```csharp
using (SKBitmap skBitmap = SKBitmap.FromImage(skImage))
{
    using (var skCanvas = new SKCanvas(skBitmap))
    {
        var skiaCanvas = new SkiaCanvas();
        skiaCanvas.Canvas = skCanvas;
    }
}
```

如此即可拿到 ICanvas 的对象，这一层就是抽象的，无论具体的底层绘制采用的是什么基础，业务用 ICanvas 类型

```csharp
        var skiaCanvas = new SkiaCanvas();
        skiaCanvas.Canvas = skCanvas;

        ICanvas canvas = skiaCanvas;
```

以上就完成了将 Microsoft.Maui.Graphics 的具体绘制底层逻辑更换使用为 Skia 进行绘制。相似的可以替换为采用 WPF 进行绘制，详细请看 [WPF 使用 MAUI 的自绘制逻辑](https://blog.lindexi.com/post/WPF-%E4%BD%BF%E7%94%A8-MAUI-%E7%9A%84%E8%87%AA%E7%BB%98%E5%88%B6%E9%80%BB%E8%BE%91.html )

接下来就是尝试画一条线段测试一下

```csharp
        canvas.StrokeSize = 2;
        canvas.StrokeColor = Colors.Blue;

        canvas.DrawLine(10, 10, 100, 10);
```

将画出的内容保存到图片文件，就需要回到 SkiaSharp 的逻辑

```csharp
        var fileName = $"xx.png";

        skCanvas.Flush();

        using (var skData = skBitmap.Encode(SKEncodedImageFormat.Png, 100))
        {
            var file = new FileInfo(fileName);
            using (var fileStream = file.OpenWrite())
            {
                fileStream.SetLength(0);
                skData.SaveTo(fileStream);
            }
        }
```

完成代码，先在 Windows 上运行一下，可以看到输出了图片如下

<!-- ![](images/img-dotnet 控制台 使用 Microsoft.Maui.Graphics 配合 Skia 进行绘图入门1-modify-64269c76a08d0d16d0e392f6698ff9db.png) -->

![](images/img-modify-a37dc9c50c5aeceb48dcf13cfa4a501c.jpg)

接下来进入 WLS 也运行一下代码

<!-- ![](images/img-dotnet 控制台 使用 Microsoft.Maui.Graphics 配合 Skia 进行绘图入门2-modify-5f9a89759e07fba8dc3daf5070b0ca12.png) -->

![](images/img-modify-b317a4786650fcf15ba86bb1bdba326e.jpg)

输出的图片和在 Windows 上输出的图片文件是完全二进制相同的

更多细节请看 [绘制图形对象 - .NET MAUI Microsoft Docs](https://docs.microsoft.com/zh-cn/dotnet/maui/user-interface/graphics/draw?WT.mc_id=WD-MVP-5003260 )

更多的 MAUI 相关博客，还请参阅我的 [博客导航](https://blog.lindexi.com/post/%E5%8D%9A%E5%AE%A2%E5%AF%BC%E8%88%AA.html )

本文的例子放在[github](https://github.com/lindexi/lindexi_gd/tree/d910685120d0a4be91792685ada4bd9c967f6e4a/SkiaSharp/BihuwelcairkiDelalurnere) 和 [gitee](https://gitee.com/lindexi/lindexi_gd/tree/d910685120d0a4be91792685ada4bd9c967f6e4a/SkiaSharp/BihuwelcairkiDelalurnere) 欢迎访问

可以通过如下方式获取本文的源代码，先创建一个空文件夹，接着使用命令行 cd 命令进入此空文件夹，在命令行里面输入以下代码，即可获取到本文的代码

```
git init
git remote add origin https://gitee.com/lindexi/lindexi_gd.git
git pull origin d910685120d0a4be91792685ada4bd9c967f6e4a
```

以上使用的是 gitee 的源，如果 gitee 不能访问，请替换为 github 的源。请在命令行继续输入以下代码

```
git remote remove origin
git remote add origin https://github.com/lindexi/lindexi_gd.git
git pull origin d910685120d0a4be91792685ada4bd9c967f6e4a
```

获取代码之后，进入 `SkiaSharp\BihuwelcairkiDelalurnere` 文件夹

我建立了一个 SkiaSharp 的群： 788018852 欢迎大家加入讨论

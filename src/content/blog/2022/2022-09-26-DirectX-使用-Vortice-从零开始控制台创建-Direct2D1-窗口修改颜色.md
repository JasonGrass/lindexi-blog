---
title: "DirectX 使用 Vortice 从零开始控制台创建 Direct2D1 窗口修改颜色"
pubDatetime: 2022-09-26 00:23:45
modDatetime: 2024-08-06 12:43:26
slug: DirectX-使用-Vortice-从零开始控制台创建-Direct2D1-窗口修改颜色
description: "DirectX 使用 Vortice 从零开始控制台创建 Direct2D1 窗口修改颜色"
tags:
  - C#
  - D2D
  - DirectX
  - Vortice
  - Direct2D
---




本文将告诉大家如何使用 Vortice 底层库从零开始，从一个控制台项目，开始搭建一个最简单的使用 Direct2D1 的 DirectX 应用。本文属于入门级博客，期望本文能让大家了解 Vortice 底层库是可以如何调用 DirectX 的功能，以及了解 DirectX 中，特别是 D2D 部分的初始化逻辑

<!--more-->


<!-- CreateTime:2022/9/26 8:23:45 -->


<!-- 标签：C#,D2D,DirectX,Vortice,Direct2D, -->
<!-- 发布 -->
<div id="toc"></div>

在开始聊 Vortice 之前，必须要先聊聊 SharpDx 库。 众所周知，现在 SharpDx 已不维护，尽管 SharpDx 的不维护对咱开发影响很小，除非需要用到这几年新加的功能，否则使用不维护的 SharpDx 的问题也不大。而 Vortice 是作为 SharpDx 的一个代替的存在，是从 SharpDx 的基础上，继续开发的一个项目。 使用 Vortice 底层库，能让 C# 代码比较方便的和 DirectX 对接

从设计上，此 Vortice 库和 SharpDx 是对 DirectX 的低级封装，低级封装意味着将会让咱在开发时，必须了解非常的细节，但同时也带来了可以进行底层优化的可能

可以代替 SharpDx 的库，除了 Vortice 之外，还有很多，详细请看 [SharpDx 的代替项目](https://blog.lindexi.com/post/SharpDx-%E7%9A%84%E4%BB%A3%E6%9B%BF%E9%A1%B9%E7%9B%AE.html)

在开始阅读本文之前，我期望读者已了解很多相关的知识，例如 Win32 的概念，以及 DirectX 是什么，和 .NET 框架的基础知识加 C# 的基础语法等知识。尽管本文属于入门级博客，但不会涉及到过于基础的知识

想要开始使用 D2D 绘制内容，就需要有一个用来承载绘制内容的 "画布" 对象，在 D2D 里面，对应的就是一个 [ID2D1RenderTarget](https://learn.microsoft.com/zh-cn/windows/win32/api/d2d1/nn-d2d1-id2d1rendertarget) 类型的对象

为了能在屏幕上能看到绘制的内容，那最好是有一个窗口用来显示绘制内容。当然，使用离屏渲染也可以，只是用离屏渲染的话，自然有离屏渲染的自带的坑再加上为了能看到渲染内容而做的编码为图片的坑，这就让入门博客不友好了。本文将通过 Win32 的方式一步步创建窗口，尽可能告诉大家更多的细节

本文使用的步骤如下：

- 创建一个 Win32 窗口
- 创建 D3D11 的设备，和交换链，将 D3D 挂到窗口上
- 通过 DXGI 配合 D3D11 创建 D2D 的 [ID2D1RenderTarget](https://learn.microsoft.com/zh-cn/windows/win32/api/d2d1/nn-d2d1-id2d1rendertarget) 进行绘制修改颜色

## 创建项目

本文将使用 VisualStudio 2022 作为 IDE 工具，理论上还在使用低于 VisualStudio 2022 版本的开发者，也应该升级 IDE 了

使用非 VisualStudio 作为 IDE 的，那推荐本文看着玩就好了，不要去尝试本文的代码

新建一个 dotnet 6 的控制台项目

接下来咱将从这个控制台项目开始，编写 D2D 应用

本文贴出的代码只有部分，如果构建不通过，推荐到本文的最后获取整个项目的代码。本文的所有的源代码可在本文的最后找到下载方式

## 安装库

找到咱 dotnet 的惯例，在使用某个库之前，就是使用 NuGet 安装库

本文需要安装以下的 NuGet 库：

- Vortice.Direct2D1
- Vortice.Direct3D11
- Vortice.DirectX
- Vortice.D3DCompiler
- Vortice.Win32
- Microsoft.Windows.CsWin32

新建的项目默认采用 SDK 风格的 csproj 项目文件格式，可以双击项目，编辑 csproj 项目文件，在项目文件上添加如下代码用来快速安装 NuGet 库

```xml
  <ItemGroup>
    <PackageReference Include="Vortice.Direct2D1" Version="2.1.32" />
    <PackageReference Include="Vortice.Direct3D11" Version="2.1.32" />
    <PackageReference Include="Vortice.DirectX" Version="2.1.32" />
    <PackageReference Include="Vortice.D3DCompiler" Version="2.1.32" />
    <PackageReference Include="Vortice.Win32" Version="1.6.2" />
    <PackageReference Include="Microsoft.Windows.CsWin32" PrivateAssets="all" Version="0.2.63-beta" />
  </ItemGroup>
```

编辑之后的 csproj 项目文件的代码如下

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net6.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Vortice.Direct2D1" Version="2.1.32" />
    <PackageReference Include="Vortice.Direct3D11" Version="2.1.32" />
    <PackageReference Include="Vortice.DirectX" Version="2.1.32" />
    <PackageReference Include="Vortice.D3DCompiler" Version="2.1.32" />
    <PackageReference Include="Vortice.Win32" Version="1.6.2" />
    <PackageReference Include="Microsoft.Windows.CsWin32" PrivateAssets="all" Version="0.2.63-beta" />
  </ItemGroup>
</Project>
```

## 加上命名空间

为了更加方便大家静态阅读代码，我特意使用了以下引用方式，让大家在阅读代码的时候，了解到对应的类型是属于哪个命名空间下

```csharp
using D3D = Vortice.Direct3D;
using D3D11 = Vortice.Direct3D11;
using DXGI = Vortice.DXGI;
using D2D = Vortice.Direct2D1;
```

其他的引用代码如下

```csharp
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Runtime.Versioning;
using Windows.Win32.Foundation;
using Windows.Win32.UI.WindowsAndMessaging;
using static Windows.Win32.PInvoke;
using static Windows.Win32.UI.WindowsAndMessaging.PEEK_MESSAGE_REMOVE_TYPE;
using static Windows.Win32.UI.WindowsAndMessaging.WNDCLASS_STYLES;
using static Windows.Win32.UI.WindowsAndMessaging.WINDOW_STYLE;
using static Windows.Win32.UI.WindowsAndMessaging.WINDOW_EX_STYLE;
using static Windows.Win32.UI.WindowsAndMessaging.SYSTEM_METRICS_INDEX;
using static Windows.Win32.UI.WindowsAndMessaging.SHOW_WINDOW_CMD;
using Vortice.DCommon;
using Vortice.Mathematics;
using AlphaMode = Vortice.DXGI.AlphaMode;
```

由于本文使用的项目，在 csproj 项目文件设置了使用 ImplicitUsings 属性，加上对 System 等命名空间的默认引用，这里就不需要再写对默认命名空间的引用

## 加上 Win32 定义

为了创建 Win32 窗口以及初始化创建 DX 对象，就需要使用一些 Win32 函数。使用 Win32 函数之前，需要对 Win32 函数进行定义。本文使用 Microsoft.Windows.CsWin32 库来辅助编写 Win32 函数的定义

在安装了 Microsoft.Windows.CsWin32 库，即可新建一个 `NativeMethods.txt` 的文件，在这个文件里面，一行一个函数或 Win32 类型名，即可自动使用源代码生成的方式创建定义。详细请看 [dotnet 使用 CsWin32 库简化 Win32 函数调用逻辑](https://blog.lindexi.com/post/dotnet-%E4%BD%BF%E7%94%A8-CsWin32-%E5%BA%93%E7%AE%80%E5%8C%96-Win32-%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8%E9%80%BB%E8%BE%91.html )

新建一个 `NativeMethods.txt` 文件，在这个文件里面写上需要使用的 Win32 函数，内容如下

```csharp
GetModuleHandle
PeekMessage
TranslateMessage
DispatchMessage
GetMessage
RegisterClassExW
DefWindowProc
LoadCursor
PostQuitMessage
CreateWindowExW
DestroyWindow
ShowWindow
GetSystemMetrics
AdjustWindowRectEx
GetClientRect
GetWindowRect
IDC_ARROW
WM_KEYDOWN
WM_KEYUP
WM_SYSKEYDOWN
WM_SYSKEYUP
WM_DESTROY
WM_QUIT
WM_PAINT
WM_CLOSE
WM_ACTIVATEAPP
VIRTUAL_KEY
```

完成了初始化准备之后，接下来就可以开始编写代码

## 创建窗口

本文使用控制台项目，在创建 Win32 窗口，需要使用到很多 Win32 窗口创建的细节代码，但本文更侧重如何使用 DX 的知识，因此关于 Win32 创建窗口的逻辑，大部分都会略过

在开始创建 Win32 窗口之前，先准备一些参数

设置窗口的尺寸

```csharp
        SizeI clientSize = new SizeI(1000, 1000);
```

再给窗口定义一个标题

```csharp
        // 窗口标题
        var title = "Demo";
        var windowClassName = "lindexi doubi";
```

配置窗口的 Win32 样式，这个样式的内容没啥固定的，可以根据自己的需求来，也可以乱来，不离谱就好

```csharp
        // 窗口样式，窗口样式含义请执行参阅官方文档，样式只要不离谱，自己随便写，影响不大
        WINDOW_STYLE style = WS_CAPTION |
                             WS_SYSMENU |
                             WS_MINIMIZEBOX |
                             WS_CLIPSIBLINGS |
                             WS_BORDER |
                             WS_DLGFRAME |
                             WS_THICKFRAME |
                             WS_GROUP |
                             WS_TABSTOP |
                             WS_SIZEBOX;
```

根据上面设置的窗口尺寸，尝试根据样式算出实际可用的尺寸

```csharp
        var rect = new RECT
        {
            right = clientSize.Width,
            bottom = clientSize.Height
        };

        // Adjust according to window styles
        AdjustWindowRectEx(&rect, style, false, WS_EX_APPWINDOW);
```

接着算出窗口显示的坐标和尺寸，这个逻辑非核心逻辑，也可以自己随意写一个坐标。本文将尝试让窗口显示在屏幕中间

```csharp
        int x = 0;
        int y = 0;
        int windowWidth = rect.right - rect.left;
        int windowHeight = rect.bottom - rect.top;

        // 随便，放在屏幕中间好了。多个显示器？忽略
        int screenWidth = GetSystemMetrics(SM_CXSCREEN);
        int screenHeight = GetSystemMetrics(SM_CYSCREEN);

        x = (screenWidth - windowWidth) / 2;
        y = (screenHeight - windowHeight) / 2;
```

准备完成，开始创建窗口

```csharp
        var hInstance = GetModuleHandle((string)null);

        fixed (char* lpszClassName = windowClassName)
        {
            PCWSTR szCursorName = new((char*)IDC_ARROW);

            var wndClassEx = new WNDCLASSEXW
            {
                cbSize = (uint)Unsafe.SizeOf<WNDCLASSEXW>(),
                style = CS_HREDRAW | CS_VREDRAW | CS_OWNDC,
                // 核心逻辑，设置消息循环
                lpfnWndProc = new WNDPROC(WndProc),
                hInstance = (HINSTANCE)hInstance.DangerousGetHandle(),
                hCursor = LoadCursor((HINSTANCE)IntPtr.Zero, szCursorName),
                hbrBackground = (Windows.Win32.Graphics.Gdi.HBRUSH)IntPtr.Zero,
                hIcon = (HICON)IntPtr.Zero,
                lpszClassName = lpszClassName
            };

            ushort atom = RegisterClassEx(wndClassEx);

            if (atom == 0)
            {
                throw new InvalidOperationException(
                    $"Failed to register window class. Error: {Marshal.GetLastWin32Error()}"
                );
            }
        }

        // 创建窗口
        var hWnd = CreateWindowEx
        (
            WS_EX_APPWINDOW,
            windowClassName,
            title,
            style,
            x,
            y,
            windowWidth,
            windowHeight,
            hWndParent: default,
            hMenu: default,
            hInstance: default,
            lpParam: null
        );
```

获取到的 `hWnd` 将会在接下来被 DX 挂上

但愿大家知道 `hWnd` 是啥意思

既然创建出了窗口了，那就显示出来吧

```csharp
        // 创建完成，那就显示
        ShowWindow(hWnd, SW_NORMAL);
```

获取实际的窗口大小，这将用来决定后续交换链的创建。什么是交换链？自己去了解

```csharp
        RECT windowRect;
        GetClientRect(hWnd, &windowRect);
        clientSize = new SizeI(windowRect.right - windowRect.left, windowRect.bottom - windowRect.top);
```

以上代码就完成了创建 Win32 窗口

## 获取显示适配器接口

这一步是可选的，通过枚举 DX 提供的抽象的显示适配器接口，可以用来后续创建 D3D 设备。本文这里是给大家演示如何获取抽象的显示适配器接口的方法，没有指定显示适配器接口也是可以创建 D3D 设备

显示适配器接口 IDXGIAdapter 是对硬件或软件的一个抽象，可以是一个显卡，也可以是一个软件渲染器。这里获取到的抽象的显示适配器接口，在大部分情况下都是和具体的显卡相关的，但是不代表着一定就是真实的显卡

下图是从官方文档拷贝的，一个电脑加两个显卡的对象关系

![](images/img-modify-19c30caaf92f28ee62fc32177fec80ab.jpg)

先尝试使用 [IDXGIFactory6](https://learn.microsoft.com/zh-cn/windows/win32/api/dxgi1_6/nn-dxgi1_6-idxgifactory6) 提供的 [EnumAdapterByGpuPreference](https://learn.microsoft.com/zh-cn/windows/win32/api/dxgi1_6/nf-dxgi1_6-idxgifactory6-enumadapterbygpupreference) 方法枚举显卡，这个方法的功能是可以按照给定的参数进行排序，特别方便开发时，获取首个可用显卡

想要使用 [EnumAdapterByGpuPreference](https://learn.microsoft.com/zh-cn/windows/win32/api/dxgi1_6/nf-dxgi1_6-idxgifactory6-enumadapterbygpupreference) 方法，需要先获取 [IDXGIFactory6](https://learn.microsoft.com/zh-cn/windows/win32/api/dxgi1_6/nn-dxgi1_6-idxgifactory6) 对象。而 [IDXGIFactory6](https://learn.microsoft.com/zh-cn/windows/win32/api/dxgi1_6/nn-dxgi1_6-idxgifactory6) 对象可以通过工厂创建 [IDXGIFactory2](https://learn.microsoft.com/zh-cn/windows/win32/api/dxgi1_2/nn-dxgi1_2-idxgifactory2) 对象间接获取

接下来咱也会用到 [IDXGIFactory2](https://learn.microsoft.com/zh-cn/windows/win32/api/dxgi1_2/nn-dxgi1_2-idxgifactory2) 提供的功能

```csharp
        // 开始创建工厂创建 D3D 的逻辑
        var dxgiFactory2 = DXGI.DXGI.CreateDXGIFactory1<DXGI.IDXGIFactory2>();
```

为了让大家方便阅读获取显卡的代码，将获取显卡的代码放入到 GetHardwareAdapter 方法

```csharp
 private static IEnumerable<DXGI.IDXGIAdapter1> GetHardwareAdapter(DXGI.IDXGIFactory2 factory)
 {
 }
```

先尝试从 [IDXGIFactory2](https://learn.microsoft.com/zh-cn/windows/win32/api/dxgi1_2/nn-dxgi1_2-idxgifactory2) 对象获取 [IDXGIFactory6](https://learn.microsoft.com/zh-cn/windows/win32/api/dxgi1_6/nn-dxgi1_6-idxgifactory6) 对象

在 DX 的设计上，接口都是一个个版本迭代的，为了保持兼容性，只是新加接口，而不是更改原来的接口定义。也就是获取到的对象，也许有在这台设备上的 DX 版本，能支持到 [IDXGIFactory6](https://learn.microsoft.com/zh-cn/windows/win32/api/dxgi1_6/nn-dxgi1_6-idxgifactory6) 版本，通用的做法是调用 `QueryInterface*` 方法，例如 `QueryInterfaceOrNull` 方法，尝试获取到更新的版本的接口对象。使用封装的 `QueryInterfaceOrNull` 方法，可以在不支持时返回空，通过判断返回值即可了解是否支持

```csharp
        DXGI.IDXGIFactory6? factory6 = factory.QueryInterfaceOrNull<DXGI.IDXGIFactory6>();
        if (factory6 != null)
        {
            // 这个系统的 DX 支持 IDXGIFactory6 类型
        }
        else
        {
            // 不支持就不支持咯，用旧版本的方式获取显示适配器接口
        }
```

在 [IDXGIFactory6](https://learn.microsoft.com/zh-cn/windows/win32/api/dxgi1_6/nn-dxgi1_6-idxgifactory6) 新加的 [EnumAdapterByGpuPreference](https://learn.microsoft.com/zh-cn/windows/win32/api/dxgi1_6/nf-dxgi1_6-idxgifactory6-enumadapterbygpupreference) 方法可以支持传入参数，通过参数按照顺序返回显示适配器接口

传入高性能参数开始获取，将会按照顺序获取到 DX 认为的高性能排列的顺序

```csharp
            // 先告诉系统，要高性能的显卡
            for (int adapterIndex = 0;
                 factory6.EnumAdapterByGpuPreference(adapterIndex, DXGI.GpuPreference.HighPerformance,
                     out DXGI.IDXGIAdapter1? adapter).Success;
                 adapterIndex++)
            {
                if (adapter == null)
                {
                    continue;
                }
            }
```

再扔掉使用软渲染的，扔掉软渲染的这一步只是为了演示如何判断获取到的显示适配器接口是采用软渲染的

```csharp
            // 先告诉系统，要高性能的显卡
            for (int adapterIndex = 0;
                 factory6.EnumAdapterByGpuPreference(adapterIndex, DXGI.GpuPreference.HighPerformance,
                     out DXGI.IDXGIAdapter1? adapter).Success;
                 adapterIndex++)
            {
                if (adapter == null)
                {
                    continue;
                }

                DXGI.AdapterDescription1 desc = adapter.Description1;

                if ((desc.Flags & DXGI.AdapterFlags.Software) != DXGI.AdapterFlags.None)
                {
                    // Don't select the Basic Render Driver adapter.
                    adapter.Dispose();
                    continue;
                }
            }
```

这里可以输出获取到的显示适配器接口的描述，可以看看在不同的设备上的输出

```csharp
Console.WriteLine($"枚举到 {adapter.Description1.Description} 显卡");
```

所有的获取的代码如下

```csharp
        DXGI.IDXGIFactory6? factory6 = factory.QueryInterfaceOrNull<DXGI.IDXGIFactory6>();
        if (factory6 != null)
        {
            // 先告诉系统，要高性能的显卡
            for (int adapterIndex = 0;
                 factory6.EnumAdapterByGpuPreference(adapterIndex, DXGI.GpuPreference.HighPerformance,
                     out DXGI.IDXGIAdapter1? adapter).Success;
                 adapterIndex++)
            {
                if (adapter == null)
                {
                    continue;
                }

                DXGI.AdapterDescription1 desc = adapter.Description1;

                if ((desc.Flags & DXGI.AdapterFlags.Software) != DXGI.AdapterFlags.None)
                {
                    // Don't select the Basic Render Driver adapter.
                    adapter.Dispose();
                    continue;
                }

                //factory6.Dispose();

                Console.WriteLine($"枚举到 {adapter.Description1.Description} 显卡");
                yield return adapter;
            }

            factory6.Dispose();
        }
```

如果获取不到，那就使用旧的方法枚举

```csharp
        // 如果枚举不到，那系统返回啥都可以
        for (int adapterIndex = 0;
             factory.EnumAdapters1(adapterIndex, out DXGI.IDXGIAdapter1? adapter).Success;
             adapterIndex++)
        {
            DXGI.AdapterDescription1 desc = adapter.Description1;

            if ((desc.Flags & DXGI.AdapterFlags.Software) != DXGI.AdapterFlags.None)
            {
                // Don't select the Basic Render Driver adapter.
                adapter.Dispose();

                continue;
            }

            Console.WriteLine($"枚举到 {adapter.Description1.Description} 显卡");
            yield return adapter;
        }
```

为了方便调试，这里就加上 ToList 让所有代码都执行

```csharp
        var hardwareAdapter = GetHardwareAdapter(dxgiFactory2)
            // 这里 ToList 只是想列出所有的 IDXGIAdapter1 在实际代码里，大部分都是获取第一个
            .ToList().FirstOrDefault();
        if (hardwareAdapter == null)
        {
            throw new InvalidOperationException("Cannot detect D3D11 adapter");
        }
```

以上代码即可获取到显示适配器接口用来进行后续的初始化

## 初始化 D3D 交换链

在开始之前，按照 [C# 从零开始写 SharpDx 应用 聊聊功能等级](https://blog.lindexi.com/post/C-%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E5%86%99-SharpDx-%E5%BA%94%E7%94%A8-%E8%81%8A%E8%81%8A%E5%8A%9F%E8%83%BD%E7%AD%89%E7%BA%A7.html) 的方法，定义代码

```csharp
        // 功能等级
        // [C# 从零开始写 SharpDx 应用 聊聊功能等级](https://blog.lindexi.com/post/C-%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E5%86%99-SharpDx-%E5%BA%94%E7%94%A8-%E8%81%8A%E8%81%8A%E5%8A%9F%E8%83%BD%E7%AD%89%E7%BA%A7.html)
        D3D.FeatureLevel[] featureLevels = new[]
        {
            D3D.FeatureLevel.Level_11_1,
            D3D.FeatureLevel.Level_11_0,
            D3D.FeatureLevel.Level_10_1,
            D3D.FeatureLevel.Level_10_0,
            D3D.FeatureLevel.Level_9_3,
            D3D.FeatureLevel.Level_9_2,
            D3D.FeatureLevel.Level_9_1,
        };
```

使用以上获取的显示适配器接口创建设备

```csharp
        DXGI.IDXGIAdapter1 adapter = hardwareAdapter;
        D3D11.DeviceCreationFlags creationFlags = D3D11.DeviceCreationFlags.BgraSupport;
        var result = D3D11.D3D11.D3D11CreateDevice
        (
            adapter,
            D3D.DriverType.Unknown,
            creationFlags,
            featureLevels,
            out D3D11.ID3D11Device d3D11Device, out D3D.FeatureLevel featureLevel,
            out D3D11.ID3D11DeviceContext d3D11DeviceContext
        );
```

也许使用这个显示适配器接口创建不出设备，通过判断返回值即可了解是否成功。创建失败，那就不指定具体的参数，使用 WARP 的方法创建

```csharp
        if (result.Failure)
        {
            // 如果失败了，那就不指定显卡，走 WARP 的方式
            // http://go.microsoft.com/fwlink/?LinkId=286690
            result = D3D11.D3D11.D3D11CreateDevice(
                IntPtr.Zero,
                D3D.DriverType.Warp,
                creationFlags,
                featureLevels,
                out d3D11Device, out featureLevel, out d3D11DeviceContext);

            // 如果失败，就不能继续
            result.CheckError();
        }
```

以上代码的 CheckError 方法，将会在失败抛出异常

创建成功，可以获取到 ID3D11Device 和 ID3D11DeviceContext 类型的对象和实际的功能等级。 这里的 ID3D11Device 就是 D3D 设备，提供给交换链绑定的功能，可以绘制到交换链的缓存里，从而被交换链刷新到屏幕上。这里的 ID3D11DeviceContext 是包含了 D3D 设备的环境和配置，可以用来设置渲染状态等

由于后续期望使用的是 [ID3D11Device1](https://learn.microsoft.com/zh-tw/windows/win32/api/d3d11_1/nn-d3d11_1-id3d11device1) 接口，按照惯例，从 `d3D11Device` 获取

```csharp
        // 大部分情况下，用的是 ID3D11Device1 和 ID3D11DeviceContext1 类型
        // 从 ID3D11Device 转换为 ID3D11Device1 类型
        var d3D11Device1 = d3D11Device.QueryInterface<D3D11.ID3D11Device1>();
```

理论上当前能运行 dotnet 6 的 Windows 系统，都是支持 ID3D11Device1 的

同理，获取 ID3D11DeviceContext1 接口

```csharp
        var d3D11DeviceContext1 = d3D11DeviceContext.QueryInterface<D3D11.ID3D11DeviceContext1>();
```

获取到了新的两个接口，就可以减少 `d3D11Device` 和 `d3D11DeviceContext` 的引用计数。调用 Dispose 不会释放掉刚才申请的 D3D 资源，只是减少引用计数

```csharp
        d3D11Device.Dispose();
        d3D11DeviceContext.Dispose();
```

创建设备完成之后，接下来就是创建交换链和关联窗口。创建交换链需要很多参数，在 DX 的设计上，将参数放入到 SwapChainDescription 类型里面。和 DX 的接口设计一样，也有多个 SwapChainDescription 版本

创建 SwapChainDescription1 参数的代码如下

```csharp
        // 颜色格式，如果后续准备接入 WPF 那推荐使用此格式
        DXGI.Format colorFormat = DXGI.Format.B8G8R8A8_UNorm;

        // 缓存的数量，包括前缓存。大部分应用来说，至少需要两个缓存，这个玩过游戏的伙伴都知道
        const int FrameCount = 2;

        DXGI.SwapChainDescription1 swapChainDescription = new()
        {
            Width = clientSize.Width,
            Height = clientSize.Height,
            Format = colorFormat,
            BufferCount = FrameCount,
            BufferUsage = DXGI.Usage.RenderTargetOutput,
            SampleDescription = DXGI.SampleDescription.Default,
            Scaling = DXGI.Scaling.Stretch,
            SwapEffect = DXGI.SwapEffect.FlipDiscard,
            AlphaMode = AlphaMode.Ignore
        };
```

参数上面的各个参数的排列组合可以实现很多不同的功能，但是 DX 有一个坑的地方在于，参数是不正交的，有些参数设置不对，将会在后续创建失败

再设置是否进入全屏模式，对于现在很多游戏和应用，都可以使用设置窗口进入最大化的全屏模式，这里就设置不进入全屏

```csharp
        // 设置是否全屏
        DXGI.SwapChainFullscreenDescription fullscreenDescription = new DXGI.SwapChainFullscreenDescription
        {
            Windowed = true
        };
```

设置了参数，就可以创建交换链。可以通过 HWnd 窗口句柄创建，也可以创建和 UWP 对接的 CreateSwapChainForCoreWindow 方式，也可以通过 DirectComposition 的 CreateSwapChainForComposition 创建。本文这里采用 CreateSwapChainForHwnd 创建，关联窗口

```csharp
  DXGI.IDXGISwapChain1 swapChain =
            dxgiFactory2.CreateSwapChainForHwnd(d3D11Device1, hWnd, swapChainDescription, fullscreenDescription);
```

附带禁止按下 alt+enter 进入全屏，这是可选的

```csharp
        // 不要被按下 alt+enter 进入全屏
        dxgiFactory2.MakeWindowAssociation(hWnd, DXGI.WindowAssociationFlags.IgnoreAltEnter);
```

这就完成了最重要的交换链的创建，以上完成之后，即可让 D3D 的内容绘制在窗口上。接下来准备再加上 D2D 的绘制

## 创建 D2D 绘制

如下图，通过 D3D 承载 D2D 的内容。以上完成了 D3D 的初始化，接下来可以通过 DXGI 辅助创建 D2D 的 [ID2D1RenderTarget](https://learn.microsoft.com/en-us/windows/win32/api/d2d1/nn-d2d1-id2d1rendertarget) 画布

![](images/img-modify-b70ee69337843b5fe7fadc903c9a801e.jpg)

如上图的框架，想要使用 D2D 之前，需要先解决让 D2D 绘制到哪。让 D2D 绘制的输出，可以是一个 IDXGISurface 对象。通过 CreateDxgiSurfaceRenderTarget 方法既可以在 IDXGISurface 创建 ID2D1RenderTarget 对象，让绘制可以输出。而 IDXGISurface 可以从 ID3D11Texture2D 获取到。通过交换链的 GetBuffer 方法可以获取到 ID3D11Texture2D 对象

本文将按照这个步骤，创建 ID2D1RenderTarget 画布。除了以上步骤之外，还有其他的方法，详细还请看[官方文档](https://learn.microsoft.com/en-us/windows/win32/direct2d/interoperability-overview)的转换框架

按照惯例创建 D2D 需要先创建工厂

```csharp
        // 对接 D2D 需要创建工厂
        D2D.ID2D1Factory1 d2DFactory = D2D.D2D1.D2D1CreateFactory<D2D.ID2D1Factory1>();
```

先从交换链获取到 ID3D11Texture2D 对象，通过 IDXGISwapChain1 的 GetBuffer 获取交换链的一个后台缓存

```csharp
        D3D11.ID3D11Texture2D backBufferTexture = swapChain.GetBuffer<D3D11.ID3D11Texture2D>(0);
```

接着使用 QueryInterface 将 ID3D11Texture2D 转换为 IDXGISurface 对象

```csharp
        DXGI.IDXGISurface dxgiSurface = backBufferTexture.QueryInterface<DXGI.IDXGISurface>();
```

获取到 IDXGISurface 即可通过 D2D 工厂创建 ID2D1RenderTarget 画布

```csharp
        var renderTargetProperties = new D2D.RenderTargetProperties(PixelFormat.Premultiplied);

        D2D.ID2D1RenderTarget d2D1RenderTarget =
            d2DFactory.CreateDxgiSurfaceRenderTarget(dxgiSurface, renderTargetProperties);
```

这里获取到的 [ID2D1RenderTarget](https://learn.microsoft.com/en-us/windows/win32/api/d2d1/nn-d2d1-id2d1rendertarget) 就是可以用来方便绘制 2D 的画布

## 修改颜色

最简单的绘制方式就是使用 Clear 方法修改颜色。本文只是告诉大家如何进行初始化，不会涉及到如何使用 D2D 绘制的内容

在开始调用 Clear 方法之前，需要先调用 BeginDraw 方法，告诉 DX 开始绘制。完成绘制，需要调用 EndDraw 方法告诉 DX 绘制完成。这里必须明确的是，在对 [ID2D1RenderTarget](https://learn.microsoft.com/en-us/windows/win32/api/d2d1/nn-d2d1-id2d1rendertarget) 调用各个绘制方法时，不是方法调用完成就渲染完成的，这些方法只是收集绘制指令，而不是立刻进行渲染

```csharp
        var renderTarget = d2D1RenderTarget;
        // 开始绘制逻辑
        renderTarget.BeginDraw();

        // 随意创建颜色
        var color = new Color4((byte)Random.Shared.Next(255), (byte)Random.Shared.Next(255),
            (byte)Random.Shared.Next(255));
        renderTarget.Clear(color);

        renderTarget.EndDraw();
```

以上代码使用随意的颜色清理，调用 Clear 时，将会让整个 [ID2D1RenderTarget](https://learn.microsoft.com/en-us/windows/win32/api/d2d1/nn-d2d1-id2d1rendertarget) 使用给定的颜色清理，也就是修改颜色

在完成之后，调用一下交换链的 Present 和等待刷新

```csharp
        swapChain.Present(1, DXGI.PresentFlags.None);
        // 等待刷新
        d3D11DeviceContext1.Flush();
```

调用交换链的 `Present` 函数在屏幕上显示渲染缓冲区的内容 `swapChain.Present(1, PresentFlags.None);` 是等待垂直同步，在刷新完成在完成这个方法，第一个参数是同步间隔，第二个参数是演示的标志

尝试运行一下代码，就可以看到创建出了一个窗口，窗口的设置了一个诡异的颜色

这就是入门级的使用 Vortice 从零开始控制台创建窗口，在窗口上使用 D2D 绘制的方法

在完成初始化的逻辑之后，就可以使用 D2D 绘制复杂的界面了。 在 [ID2D1RenderTarget](https://learn.microsoft.com/en-us/windows/win32/api/d2d1/nn-d2d1-id2d1rendertarget) 可以方便调用各个方法进行绘制，如绘制矩形，画圆等。详细请看 [C# 从零开始写 SharpDx 应用 绘制基础图形](https://blog.lindexi.com/post/C-%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E5%86%99-SharpDx-%E5%BA%94%E7%94%A8-%E7%BB%98%E5%88%B6%E5%9F%BA%E7%A1%80%E5%9B%BE%E5%BD%A2.html )

本文有部分代码没有贴出，可以通过以下方法获取本文使用的项目。如果发现自己照着写，跑不起来，推荐使用本文的项目跑一下对比代码

## 代码

本文的代码放在[github](https://github.com/lindexi/lindexi_gd/tree/162977106065bd3cf7bfbed0a87828c992b8df3d/WakolerwhaKanicabirem) 和 [gitee](https://gitee.com/lindexi/lindexi_gd/tree/162977106065bd3cf7bfbed0a87828c992b8df3d/WakolerwhaKanicabirem) 欢迎访问

可以通过如下方式获取本文的源代码，先创建一个空文件夹，接着使用命令行 cd 命令进入此空文件夹，在命令行里面输入以下代码，即可获取到本文的代码

```
git init
git remote add origin https://gitee.com/lindexi/lindexi_gd.git
git pull origin 162977106065bd3cf7bfbed0a87828c992b8df3d
```

以上使用的是 gitee 的源，如果 gitee 不能访问，请替换为 github 的源。请在命令行继续输入以下代码

```
git remote remove origin
git remote add origin https://github.com/lindexi/lindexi_gd.git
git pull origin 162977106065bd3cf7bfbed0a87828c992b8df3d
```

获取代码之后，进入 WakolerwhaKanicabirem 文件夹

## 更多博客

渲染部分，关于 SharpDx 使用，包括入门级教程，请参阅：

- [WPF 使用 SharpDx 渲染博客导航](https://blog.lindexi.com/post/WPF-%E4%BD%BF%E7%94%A8-SharpDx-%E6%B8%B2%E6%9F%93%E5%8D%9A%E5%AE%A2%E5%AF%BC%E8%88%AA.html )
- [SharpDX 系列](https://blog.lindexi.com/post/sharpdx.html )

在 WPF 框架的渲染部分，请参阅： [WPF 底层渲染_lindexi_gd的博客-CSDN博客](https://blog.csdn.net/lindexi_gd/category_9276313.html?spm=1001.2014.3001.5482 )

更多关于我博客请参阅 [博客导航](https://blog.lindexi.com/post/%E5%8D%9A%E5%AE%A2%E5%AF%BC%E8%88%AA.html )

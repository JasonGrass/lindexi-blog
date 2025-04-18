---
title: "Notes on Migrating from WPF to UNO under UOS"
pubDatetime: 2023-11-26 03:17:24
modDatetime: 2024-08-06 12:43:32
slug: Notes-on-Migrating-from-WPF-to-UNO-under-UOS
description: "Notes on Migrating from WPF to UNO under UOS"
tags:
  - WPF
  - UNO
---




This article documents my experience in migrating a small WPF application to the UNO framework for support on the UOS(统信).

<!--more-->


<!-- CreateTime:2023/11/26 11:17:24 -->

<!-- 发布 -->

Before I begin, let me explain my requirements. I currently have [a small WPF application](https://github.com/dotnet-campus/dotnetCampus.Ipc/blob/100ac217ef8e570c0fc263db251bf9fc35bcf8cb/demo/dotnetCampus.Ipc.WpfDemo/) that I need to run on both the UnionTech OS and Windows.

As we all know, there are many multi-platform development frameworks available in the current dotnet system. This time, I decided to try developing with the UNO/MAUI approach. The overall technical architecture is shown in the diagram below.

<!-- ![](images/img-Notes on Migrating from WPF to UNO under UOS0.png) -->
![](images/img-modify-1f308c273df7b735476340969de34b4d.jpg)

As shown in the diagram, I still use the WPF framework on Windows. However, this time the WPF framework is used as the underlying framework. Most of the business code will not directly touch the WPF framework, only some platform compatibility adaptation code will. The rest of the business code will indirectly use the WPF framework through the UNO and MAUI frameworks. On the UOS, the GTK application framework is used. Similarly, only platform compatibility adaptation code will touch the GTK application framework, and most business code will not directly interact with it.

The overall rendering layer uses SKIA to ensure consistent rendering effects across multiple platforms.

## Daily Development

When creating a new project, remember to check the Windows project option. This will generate a WinUI3 project. When writing code, choose the WinUI 3 project to get XAML code intelligent prompts. When debugging, prioritize using the WinUI 3 project to debug the interface layout. You can directly use Visual Studio's hot reload support for WinUI 3, which works better.

I recommend also adding the Skia.WPF and Skia.GTK projects. GTK can run on both Windows and Linux systems, but GTK may have some strange issues on Windows. In this case, switch to Skia.WPF. After all, those really released on the Windows platform won't be so desperate to use GTK as the underlying layer.

## Text

### Flickering Black Screen on UOS

This is an OpenGL issue. For the fix, please see [https://github.com/unoplatform/uno/issues/13530](https://github.com/unoplatform/uno/issues/13530).

### Chinese Text Garbled

Chinese text garbled is due to the incorrect loading of Chinese fonts. This problem also applies to languages such as Korean or Japanese. UOS has the Source Han Sans font by default, and GTK will automatically roll back the font. All you need to do is set the application to use Microsoft YaHei. Setting it to Microsoft YaHei will allow the application to display normal sans-serif fonts on both Windows and UOS systems.

The setting method is as follows:

```xml
<TextBlock Text="解决 UOS 中文乱码" FontFamily="Microsoft YaHei UI"/>
```

Remember to use the `Microsoft YaHei UI` font on the interface, the font with `UI`. Otherwise, you will see some strange font layouts.

Addition: [Uno with Wpf Chinese code display messy code · Issue #6973 · unoplatform/uno](https://github.com/unoplatform/uno/issues/6973 )

### TextBox Stretching Space

If there is content that depends on the space stretched by the measurement during the TextBox input process, then the stretched space may be incorrect, such as the following code:

```xml
      <TextBox HorizontalAlignment="Center" FontSize="50"></TextBox>
```

With this logic, you will see the text content being clipped during the input process. Basically, you can see the text content being clipped under the Skia.WPF and Skia.GTK projects.

<!-- ![](images/img-从 WPF 搬迁到 UOS 下的 UNO 的笔记1.png) -->
![](images/img-modify-1dc8a2942a36774cc165496b1d82484c.jpg)

<!-- ![](images/img-从 WPF 搬迁到 UOS 下的 UNO 的笔记2.png) -->
![](images/img-modify-fed3763196f826ccfcceba18962bcff2.jpg)

For now, the only workaround is to modify the interface design.

### TextBox's Minimum Height

The minimum height will still be higher than expected, so you can only modify the interface design to work around it.

### TextBox's Scroll Bar

For example, to scroll to the bottom, you can use the following code:

```csharp
        private void ScrollToBottom(TextBox textBox)
        {
            //textBox.Spy();
            if(textBox.VisualDescendant<ScrollViewer>() is { } scrollViewer)
            {
                scrollViewer.ChangeView(0.0f, scrollViewer.ExtentHeight, 1.0f, true);
            }
        }
```

This VisualDescendant method is an auxiliary method, the code is as follows:

```csharp
    static class TreeExtensions
    {
        public static T? VisualDescendant<T>(this UIElement element) where T : DependencyObject
            => VisualDescendant<T>((DependencyObject) element);

        public static T? VisualDescendant<T>(DependencyObject element) where T : DependencyObject
        {
            if (element is T)
            {
                return (T) element;
            }

            T? foundElement = default;
            for (var i = 0; i < VisualTreeHelper.GetChildrenCount(element); i++)
            {
                var child = VisualTreeHelper.GetChild(element, i);
                foundElement = VisualDescendant<T>(child);
                if (foundElement != null)
                {
                    break;
                }
            }

            return foundElement;
        }
    }
```

This method is also useful for ListView and others. The core is to find the ScrollViewer object through the visual tree and control the scrolling through the ScrollViewer.

## StreamGeometry Resources for Geometric Shapes

In WPF, icons often use Path geometric paths as vector icons, which are put into StreamGeometry resources. StreamGeometry resources made from a single Path can be replaced in UNO with `x:String`, as the following code shows an icon originally placed in WPF resources:

```xml
    <StreamGeometry x:Key="Geometry.Close">
        M18.363961,5.63603897 C18.7544853,6.02656326 18.7544853,6.65972824 18.363961,7.05025253 L13.4142136,12 L18.363961,16.9497475 C18.7544853,17.3402718 18.7544853,17.9734367 18.363961,18.363961 C17.9734367,18.7544853 17.3402718,18.7544853 16.9497475,18.363961 L12,13.4142136 L7.05025253,18.363961 C6.65972824,18.7544853 6.02656326,18.7544853 5.63603897,18.363961 C5.24551468,17.9734367 5.24551468,17.3402718 5.63603897,16.9497475 L10.5857864,12 L5.63603897,7.05025253 C5.24551468,6.65972824 5.24551468,6.02656326 5.63603897,5.63603897 C6.02656326,5.24551468 6.65972824,5.24551468 7.05025253,5.63603897 L12,10.5857864 L16.9497475,5.63603897 C17.3402718,5.24551468 17.9734367,5.24551468 18.363961,5.63603897 Z
    </StreamGeometry>
```

In WPF, suppose it is set on a button as an icon button, you can define a style, the content is roughly as follows:

```xml
    <Style x:Key="Style.TitlebarButton" TargetType="Button">
        <Setter Property="Background" Value="Transparent" />
        <Setter Property="Foreground" Value="#808080" />
        <Setter Property="Width" Value="24"/>
        <Setter Property="Height" Value="24"/>
        <Setter Property="Template">
            <Setter.Value>
                <ControlTemplate TargetType="{x:Type ButtonBase}">
                    <Grid Background="{TemplateBinding Background}" UseLayoutRounding="True">
                        <Path Fill="{TemplateBinding Foreground}"
                              Data="{Binding Path=Content, RelativeSource={RelativeSource TemplatedParent}}">
                        </Path>
                    </Grid>
                </ControlTemplate>
            </Setter.Value>
        </Setter>
```

The code used in the specific business is roughly as follows:

```xml
<Button Style="{StaticResource Style.TitlebarButton}" Content="{StaticResource Geometry.Close}"/>
```

After moving to UNO, change the StreamGeometry type resource to an `x:String` resource, as in the following code:

```xml
<x:String x:Key="Geometry.Close">M18.363961,5.63603897 C18.7544853,6.02656326 18.7544853,6.65972824 18.363961,7.05025253 L13.4142136,12 L18.363961,16.9497475 C18.7544853,17.3402718 18.7544853,17.9734367 18.363961,18.363961 C17.9734367,18.7544853 17.3402718,18.7544853 16.9497475,18.363961 L12,13.4142136 L7.05025253,18.363961 C6.65972824,18.7544853 6.02656326,18.7544853 5.63603897,18.363961 C5.24551468,17.9734367 5.24551468,17.3402718 5.63603897,16.9497475 L10.5857864,12 L5.63603897,7.05025253 C5.24551468,6.65972824 5.24551468,6.02656326 5.63603897,5.63603897 C6.02656326,5.24551468 6.65972824,5.24551468 7.05025253,5.63603897 L12,10.5857864 L16.9497475,5.63603897 C17.3402718,5.24551468 17.9734367,5.24551468 18.363961,5.63603897 Z</x:String>
```

The rest of the code is basically the same as WPF, as in the following UNO button style

```xml
        <Style x:Key="Style.TitlebarButton" TargetType="Button">
            <Setter Property="Background" Value="Transparent" />
            <Setter Property="Foreground" Value="#808080" />
            <Setter Property="Width" Value="24"/>
            <Setter Property="Height" Value="24"/>
            <Setter Property="Template">
                <Setter.Value>
                    <ControlTemplate TargetType="ButtonBase">
                        <Grid Background="{TemplateBinding Background}">
                            <Path Fill="{TemplateBinding Foreground}" Data="{TemplateBinding Content}"></Path>
                        </Grid>
                    </ControlTemplate>
                </Setter.Value>
            </Setter>
        </Style>
```

Then you can see the button code define is same as the WPF code:

```xml
<Button Style="{StaticResource Style.TitlebarButton}" Content="{StaticResource Geometry.Close}"/>
```

## PathGeometry

Some parts are not supported, so multi-platform testing is required. You may need to find a workaround.

## x:Static

Static binding is not supported, so a workaround is necessary. For example, you can redefine an instance property that references the static value, and then bind to the instance property.

Alternatively, you can move some static properties to the resource dictionary.

For instance, in WPF, you would write it like this:

```csharp
    public static class BooleanToVisibility
    {
        public static IValueConverter CollapsedWhenTrue { get; private set; } = new VisibilityConverter
        {
            Visible = false,
            Collapsed = true
        };
    }

    <Border Visibility="{Binding Foo, Converter={x:Static uiConverters:BooleanToVisibility.CollapsedWhenTrue}}"/>
```

In UNO, you would modify it to use the resource dictionary:

```xml
    <UserControl.Resources>
        <uiConverters:VisibilityConverter x:Key="CollapsedWhenTrue" Visible="False" Collapsed="True"/>
    </UserControl.Resources>

    <Border Visibility="{Binding Foo, Converter={StaticResource CollapsedWhenTrue}}">
```

## Image Resources

Image resources can use relative or absolute paths. The format for absolute paths in UNO is as follows:

```xml
<Image Source="ms-appx:///[MyApp]/Assets/MyImage.png" />
```

The `[MyApp]` in the above code is optional, but I recommend including it. This `[MyApp]` corresponds to the assembly name.

By default, all images are referenced as `Content`. You can see the following code in the csproj project file:

```xml
<Content Include="Assets\**;**/*.png;**/*.bmp;**/*.jpg;**/*.dds;**/*.tif;**/*.tga;**/*.gif" Exclude="bin\**;obj\**;**\*.svg" />
```

Newly added image files do not require any modifications by default. However, for platform compatibility, I recommend using png, jpg, and bmp formats, as all platforms support these formats. If your image does not display, please follow these steps:

- Check if you have modified the csproj and inadvertently ignored your image.
- Try using an absolute path for the resource.
- Compare the absolute path character by character to ensure it is correct.
- Verify that the path starts with the string `ms-appx:///`. You need to use three `/` characters.
- If you still can't see the image, try regenerating it.
- If it still doesn't work, check if the image format is unusual, such as changing the webp image extension to png, etc.

Images can be used as content in the resource dictionary. You can use the BitmapImage type, which is the same as in WPF. However, the content of the Source needs to be changed under the absolute path, as shown in the following example:

```xml
<BitmapImage x:Key="Image.Logo.Size24" UriSource="ms-appx:///[MyApp]/Assets/Logo/logo24x24.png"></BitmapImage>
```

For more information, please refer to the official documentation [Assets and image display](https://platform.uno/docs/articles/features/working-with-assets.html )

## ContentControl

The functionality aligns with WPF, but the default style behavior is different. The default HorizontalContentAlignment and VerticalContentAlignment are in the top left corner. You need to set them to Stretch to align with WPF.

```xml
<ContentControl HorizontalAlignment="Stretch" VerticalAlignment="Stretch"
                HorizontalContentAlignment="Stretch" VerticalContentAlignment="Stretch"></ContentControl>
```

## Default Control Properties

Most control default properties are the same as in WPF. However, a few layout properties are different. For example, many controls' HorizontalAlignment and VerticalAlignment are in the top left corner. You need to set them to Stretch to align with WPF.

## Changes to csproj

Due to some conflicts between UNO and VisualStudio, creating a new file may cause UNO's csproj to add unnecessary code. During the development process, before uploading to git, check whether the changes to csproj are necessary. If the changes are unnecessary, please revert them. Generally, you need to revert the changes to csproj after creating a new file, such as creating a new type or user control.

## Dispatcher

The Dispatcher in UNO is weaker than that in WPF, but some replacements can be made. The logic of obtaining the Dispatcher from the original interface elements remains unchanged.

The logic of obtaining it statically, such as the following WPF code, needs to be replaced.

```csharp
System.Windows.Application.Current.Dispatcher.InvokeAsync
```

The method of obtaining the static main thread dispatcher from UNO is the same as that of UWP or WinUI 3, as shown in the following code.

```csharp
                    await CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                    {
                        // Write the dispatch implementation code here
                    });
```

Unlike WPF's Dispatcher scheduling level, UNO's schedulable level is very limited, with only the following schedulable levels.

```
High    1   High priority. Delegates for all synchronous requests are called immediately. Asynchronous requests are queued and processed before any other type of request.
Idle    -2  Lowest priority. Use this priority for background tasks. Delegates are processed when the main thread of the window is idle and there are no pending inputs in the queue.
Low     -1  Low priority. Delegates are processed if there are no higher priority events pending in the queue.
Normal  0   Normal priority. Delegates are processed in the order scheduled.
```

In most cases, the Normal priority is used.

However, when running WinUI 3, the acquisition of the `CoreApplication.MainView.CoreWindow` property may throw an exception that it cannot be created repeatedly. If you try to get the CoreApplicationView object indirectly from `CoreApplication.GetCurrentView()` to get the Dispatcher, it may still fail, because this method will throw a System.Runtime.InteropServices.COMException: "Element not found" exception.

A more secure way is to store the Microsoft.UI.Dispatching.DispatcherQueue in the App yourself, so that you can get the same DispatcherQueue object obtained from the main UI thread and use it on WinUI 3, WPF and GTK projects. In the WinUI 3 project, the MainWindow.Dispatcher property is still null, which is why the DispatcherQueue is used.

```csharp
    public class App : EmbeddingApplication
    {
        protected async override void OnLaunched(LaunchActivatedEventArgs args)
        {
            // 忽略其他代码
            MainWindow = builder.Window;

#if DEBUG
            MainWindow.EnableHotReload();
#endif
            
            Dispatcher = MainWindow.DispatcherQueue;
            Host = await builder.NavigateAsync<Shell>();
        }

        public Microsoft.UI.Dispatching.DispatcherQueue Dispatcher { private set; get; } = null!;
    }
```

## Missing Mechanisms

### Visibility.Hidden

There is no hidden option, instead, you can set the opacity to 0. Setting `Opacity="0"` has a similar effect to WPF's `Visibility.Hidden`.

### MultiBinding

MultiBinding is not supported, so you have to find a workaround and write the interface with only single binding.

### ControlTemplate.Triggers

This is not supported, a workaround is needed.

### Use of x:Name attribute in Resources

The use of x:Name in resources is not supported. This is because x:Name must be assigned a property or field when it is generated, but resources can be created multiple times, which the generated code cannot handle. This issue was previously raised by Avalonia's XAML creator, and now WinUI 3, UNO, and MAUI all have this problem.

The simplest reproduction code is as follows:

```xml
    <Page.Resources>
        <ResourceDictionary>
            <SolidColorBrush x:Name="MyBrush" Color="Blue"/>
        </ResourceDictionary>
    </Page.Resources>
```

In this case, you should use `x:Key` instead of `x:Name` to meet the expectation.

In addition, for the binding logic within resources, such as the following code, you can only find a workaround for this kind of code:

```xml
    <Page.Resources>
        <ControlTemplate x:Key="Template.Loading" TargetType="ContentControl">
            <Grid x:Name="RootGrid" />
        </ControlTemplate>
    </Page.Resources>
```

The error message for the above code is `error CS0103: The name "_RootGrid" does not exist in the current context`.

For more information, please see [Adding Name to a Resource fails on build · Issue #1427 · unoplatform/uno](https://github.com/unoplatform/uno/issues/1427).

## IPC

Known issue: [https://github.com/dotnet-campus/dotnetCampus.Ipc/issues/139](https://github.com/dotnet-campus/dotnetCampus.Ipc/issues/139)

## References

[【Chinese Blog】 WPF uses MAUI's custom drawing logic](https://blog.lindexi.com/post/WPF-%E4%BD%BF%E7%94%A8-MAUI-%E7%9A%84%E8%87%AA%E7%BB%98%E5%88%B6%E9%80%BB%E8%BE%91.html)

[【Chinese Blog】 dotnet uses Xamarin Forms to create a GTK application with a xaml interface on the UOS domestic system](https://blog.lindexi.com/post/dotnet-%E5%9C%A8-UOS-%E5%9B%BD%E4%BA%A7%E7%B3%BB%E7%BB%9F%E4%B8%8A%E4%BD%BF%E7%94%A8-Xamarin-Forms-%E5%88%9B%E5%BB%BA-xaml-%E7%95%8C%E9%9D%A2%E7%9A%84-GTK-%E5%BA%94%E7%94%A8.html)

[【Chinese Blog】 Running dotnet programs on UOS Unity prompts that it cannot run without passing system security verification](https://blog.lindexi.com/post/%E5%9C%A8-UOS-%E7%BB%9F%E4%BF%A1%E8%BF%90%E8%A1%8C-dotnet-%E7%A8%8B%E5%BA%8F%E6%8F%90%E7%A4%BA%E6%B2%A1%E6%9C%89%E9%80%9A%E8%BF%87%E7%B3%BB%E7%BB%9F%E5%AE%89%E5%85%A8%E9%AA%8C%E8%AF%81%E6%97%A0%E6%B3%95%E8%BF%90%E8%A1%8C.html)

[【Chinese Blog】 dotnet runs UNO programs on the UOS Unity system and flickers to a black screen when inputting](https://blog.lindexi.com/post/dotnet-%E5%9C%A8-UOS-%E7%BB%9F%E4%BF%A1%E7%B3%BB%E7%BB%9F%E4%B8%8A%E8%BF%90%E8%A1%8C-UNO-%E7%A8%8B%E5%BA%8F%E8%BE%93%E5%85%A5%E6%97%B6%E9%97%AA%E7%83%81%E9%BB%91%E5%B1%8F%E9%97%AE%E9%A2%98.html)

[【Chinese Blog】 dotnet Unity UOS runs UNO FrameBuffer application error Failed to open FrameBuffer device](https://blog.lindexi.com/post/dotnet-%E7%BB%9F%E4%BF%A1-UOS-%E8%BF%90%E8%A1%8C-UNO-FrameBuffer-%E5%BA%94%E7%94%A8%E9%94%99%E8%AF%AF-Failed-to-open-FrameBuffer-device.html )

[I share a video of an app which created with uno · unoplatform/uno · Discussion #4962](https://github.com/unoplatform/uno/discussions/4962 )

[A Journey of Migrating a WPF Project to UNO Framework: Triumphs and Challenges · unoplatform/uno · Discussion #14548](https://github.com/unoplatform/uno/discussions/14548 )

<!-- 

请将我的博客翻译为英文，你可以修改写作的风格，以及调整语句让文章总体更具备可读性

标题：从 WPF 搬迁到 UOS 下的 UNO 的笔记
内容：
本文记录我将一个小 WPF 应用搬迁到 UNO 框架，用于支持统信 UOS 系统时开发经验

开始之前先说一下我的需求，我现在有一个小的 WPF 应用。现在我需要在统信 UOS 系统和 Windows 系统上都能够运行这个 WPF 应用

众所周知当前的 dotnet 系可选的多平台开发框架有很多，这一次我准备尝试使用 UNO/MAUI 的方式进行开发，大的技术架构如下图

[TheImage0]

如上图，在 Windows 上依然采用 WPF 框架，只是这时的 WPF 框架是作为底层框架使用，业务代码大部分不会直接接触 WPF 框架，只有部分平台兼容适配代码才会接触 WPF 框架。其他的业务代码都是通过 UNO 和 MAUI 框架间接使用到 WPF 框架。在 UOS 系统上，是采用 GTK 应用框架进行承载，同理也只有平台兼容适配代码才会接触 GTK 应用框架，大部分业务代码不会直接碰到

然后总的渲染层使用 SKIA 来保证多个平台的渲染效果一致

## 日常开发

新建项目的时候记得勾选 Windows 项目，如此将可以生成 WinUI3 项目。通过编写代码的时候选用 WinUI 3 项目，即可获取 XAML 代码智能提示。调试的时候优先选用 WinUI 3 项目调试界面布局，可以直接使用 Visual Studio 对 WinUI 3 的热重载支持，效果更好

推荐同步也加上 Skia.WPF 和 Skia.GTK 项目，其中 GTK 可以同时在 Windows 和 Linux 系统上跑，但 GTK 在 Windows 上可能有一些奇奇怪怪的问题，此时换成 Skia.WPF 好了，毕竟真的发布在 Windows 平台的也不会那么想不开用 GTK 做底层

## 文本

### 在 UOS 闪烁黑屏问题

这是 OpenGL 的问题，修复方法请看 [The Link1]

### 中文文本乱码

中文文本乱码是因为中文字体没有正确加载，在 UOS 默认有思源黑体字体，在 GTK 会自动做字体回滚，只需要应用设置为微软雅黑即可。设置为微软雅黑可以让应用在 Windows 系统和 UOS 系统上都能显示正常的黑体字体

设置方法如下

```xml
<TextBlock Text="解决 UOS 中文乱码" FontFamily="Microsoft YaHei UI"/>
```

微软雅黑在界面上记得使用 `Microsoft YaHei UI` 字体，带 `UI` 的字体。否则你将会看到一些字体布局有些奇怪

### TextBox 撑开空间

如果有内容是依赖 TextBox 的输入过程时的测量撑开的空间的，那撑开的空间将可能不对，比如以下代码

```xml
      <TextBox HorizontalAlignment="Center" FontSize="50"></TextBox>
```

如此的逻辑将会在输入的过程看到文本内容被裁剪，基本在 Skia.WPF 和 Skia.GTK 项目下可以看到文本内容被裁剪

[TheImage1]
[TheImage2]

暂时只能绕路，现在是 UNO 5.0 版本，依然难以修复此问题

### TextBox 的最小高度

最小高度依然会比预期的更高一些，只能修改界面设计，绕路

### TextBox 的滚动条

比如滚动最底，可以使用如下代码

```
Code
```

这个 VisualDescendant 方法是辅助方法，代码如下

```
Code
```

此方法对于 ListView 等也一样有用。核心就是通过爬视觉树找到 ScrollViewer 对象，通过 ScrollViewer 控制滚动

## 几何图形 StreamGeometry 资源

在 WPF 里面，经常有图标使用的是 Path 几何路径，作为矢量图标，放入到 StreamGeometry 资源里面。由单个 Path 制作的 StreamGeometry 资源可以通过 `x:String` 的方式在 UNO 里替换，如下面代码是一个原先放在 WPF 资源里的图标

```
Code
```

在 WPF 里面，假定是设置在按钮上，作为图标按钮的，可以定义一个样式，大概内容如下

```
Code
```

具体的业务代码使用的代码大概如下

```
Code
```

搬运到 UNO 之后，将 StreamGeometry 类型的资源修改为 `x:String` 资源，如以下代码

```
Code
```

其他的代码基本都和 WPF 相同，如下面的 UNO 的按钮样式，可以看到和 WPF 的相同。实际应用里面，可能需要去掉一些 WPF 专有的属性，比如 FocusVisualStyle 属性，以及为了界面效果更好添加一些 UNO 的属性

```
Code
```

具体的业务使用方代码不变，以下是 UNO 的按钮，可以看到和 WPF 的按钮的代码是相同的

```
Code
```

-->

<!-- 

请将我的技术博客翻译为英文，你可以修改写作的风格，以及调整语句让文章总体更具备可读性

内容：

## PathGeometry

有部分不受支持，请进行多平台测试，需要绕路

## x:Static

静态绑定不受支持，只能绕路，比如使用再定义一个实例属性，让这个实例属性引用静态量，再绑定到实例属性

或者是有一些从静态属性搬到资源字典

比如原本在 WPF 是这样写的

```
Code
```

在 UNO 更改使用资源字典

```
Code
```

## 图片资源

图片资源可以使用相对路径或绝对路径，在UNO的绝对路径的格式如下

```
Code
```

以上代码的 `[MyApp]` 是可选的，但是我推荐加上，这个 `[MyApp]` 对应的是程序集名

默认的图片都是被作为 `Content` 引用的，可以在 csproj 项目文件看到如下代码

```
Code
```

新添加的图片文件，默认是不需要做什么修改的，但为了兼容平台考虑，推荐使用 png 和 jpg 和 bmp 格式，这几个格式所有平台都支持。如果发现自己的图片没有显示，请按照如下顺序定位

- 先看看是否改了 csproj 将自己的图片忽略掉
- 尝试写资源使用绝对路径
- 逐字符对比绝对路径是否正确
- 逐字符对比是否写的是 `ms-appx:///` 字符串开始，需要使用的是三个 `/` 字符
- 如果依然看不到图片，再看看是不是没有生成试试重新生成
- 依然不行再看看是不是图片格式比较诡异，比如将 webp 图片后缀名改为 png 等

图片当成资源字典的内容，可以使用 BitmapImage 类型，和 WPF 相同，只是 Source 的内容在绝对路径下需要更改，如以下例子

```
Code
```

更多请参阅官方文档 [Assets and image display](https://platform.uno/docs/articles/features/working-with-assets.html )

## ContentControl

功能上和 WPF 对齐，只是样式默认行为不相同。默认的 HorizontalContentAlignment 和 VerticalContentAlignment 是左上角，需要设置为 Stretch 才和 WPF 相同

```
Code
```

## 控件默认属性

大部分的控件的默认属性都和 WPF 相同，但也有少部分布局属性和 WPF 不相同，比如大量控件的 HorizontalAlignment 和 VerticalAlignment 都是左上角，需要设置为 Stretch 才和 WPF 相同

-->

<!-- 

请将我的技术博客翻译为英文，你可以修改写作的风格，以及调整语句让文章总体更具备可读性

内容：

## csproj 的变更

由于现在 UNO 和 VisualStduio 存在一些冲突，导致了新建文件可能让 UNO 的 csproj 添加了不需要的代码。需要在开发的过程中，在进行 git 上传之前，看一下 csproj 的变更是否必要，如果是不必要的改动，请直接撤销。一般需要在新建文件，比如新建类型或新建用户控件这些动作之后，撤销 csproj 的更改

## Dispatcher

调度上 UNO 的 Dispatcher 要比 WPF 的弱，但可以进行一些平替。从原本的界面元素上获取 Dispatcher 的逻辑，依然不变

从静态获取的逻辑，如以下的 WPF 代码，则需要进行替换

```
Code
```

从 UNO 获取静态的主线程调度器和 UWP 或 WinUI 3 的获取方法是相同的，代码如下

```csharp
                    await CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                    {
                        // 在这里编写调度实现代码
                    });
```

和 WPF 的 Dispatcher 调度等级不相同的是 UNO 的可调度等级非常少，只有如下的可调度等级

```
High    1   高优先级。 将立即为所有同步请求调用委托。 异步请求将在任何其他请求类型之前排队和处理。
Idle    -2  最低优先级。 将此优先级用于后台任务。 当窗口的main线程空闲且队列中没有挂起的输入时，将处理委托。
Low     -1  低优先级。 如果队列中没有更高的优先级事件挂起，则处理委托。
Normal  0   正常优先级。 委托按计划的顺序进行处理。
```

大部分情况下使用的都是 Normal 优先级

但是在 WinUI 3 运行的时候，可能 `CoreApplication.MainView.CoreWindow` 属性的获取会抛出不能重复创建的异常。而如果尝试通过 `CoreApplication.GetCurrentView()` 获取 CoreApplicationView 类型的对象从而间接拿到 Dispatcher 则依然可能失败，因为此方法将会抛出 System.Runtime.InteropServices.COMException:“Element not found” 异常

比较稳妥的方式就是自己在 App 里面将 Microsoft.UI.Dispatching.DispatcherQueue 存起来，如此获取到相同的从主 UI 线程获取的 DispatcherQueue 对象即可同时在 WinUI 3 以及 WPF 和 GTK 项目上使用。在 WinUI 3 项目里 MainWindow.Dispatcher 属性当前依然是 null 值，这就是为什么拿的是 DispatcherQueue 的原因

```
Code
```

-->

<!-- 
请将我的技术博客翻译为英文，你可以修改写作的风格，以及调整语句让文章总体更具备可读性

内容：

## 缺乏的机制

### Visibility.Hidden

没有隐藏的选项，换成设置透明度为 0 代替。设置 `Opacity="0"` 效果和 WPF 的 `Visibility.Hidden` 相似

### MultiBinding

多绑定不受支持，只能绕路，让界面编写只有单绑定

### ControlTemplate.Triggers

不支持，需要绕路

### 在 Resources 的资源使用了 x:Name 特性

在资源里面带了 x:Name 是不受支持的，由于 x:Name 在生成的时候必须分配给他属性或字段，但是资源可以被多次创建，导致了生成的代码无法处理这个情况。之前 Avalonia 的 XAML 创建器就提了这个问题，现在 WinUI 3 和 UNO 和 MAUI 都有这个问题

最简复现代码如下

```
Code
```

此时应该是使用 `x:Key` 代替 `x:Name` 才符合预期

另外的是为了资源内的绑定逻辑，如以下代码，这样的代码只能绕路

```
Code
```

以上代码错误提示是 `error CS0103: 当前上下文中不存在名称“_RootGrid”` 信息

更多请看 [Adding Name to a Resource fails on build · Issue #1427 · unoplatform/uno](https://github.com/unoplatform/uno/issues/1427 )

## IPC

已知问题： [TheLink]

## 参考文档

【中文博客】 WPF 使用 MAUI 的自绘制逻辑
【中文博客】 dotnet 在 UOS 国产系统上使用 Xamarin Forms 创建 xaml 界面的 GTK 应用
【中文博客】 在 UOS 统信运行 dotnet 程序提示没有通过系统安全验证无法运行
【中文博客】 dotnet 在 UOS 统信系统上运行 UNO 程序输入时闪烁黑屏问题
【中文博客】 dotnet 统信 UOS 运行 UNO FrameBuffer 应用错误 Failed to open FrameBuffer device

-->

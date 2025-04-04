---
title: "如何在 UWP 使用 wpf 的 Trigger "
pubDatetime: 2018-08-10 11:16:51
modDatetime: 2024-08-06 12:43:44
slug: 如何在-UWP-使用-wpf-的-Trigger-
description: "如何在 UWP 使用 wpf 的 Trigger "
tags:
  - WPF
  - UWP
---




本文需要告诉大家，如何使用 Behaviors 做出 WPF 的 Trigger ，需要知道 UWP 不支持 WPF 的 Trigger 。

<!--more-->


<!-- CreateTime:2018/8/10 19:16:51 -->


## 安装 Behaviors

请使用 Nuget 安装，可以输入下面的代码进行安装

```csharp
Install-Package Microsoft.Xaml.Behaviors.Uwp.Managed 

```

或者搜索 `Microsoft.Xaml.Behaviors` 下载

他的官网在 [Behaviors](https://github.com/Microsoft/XamlBehaviors)

## 以前的代码

在 WPF 开发，可以写出下面代码

```csharp
<Button>
  <Image>
    <Image.Style>
      <Style TargetType="Image">
       <Style.Triggers Property="IsEnabled" Value="False">
         <Setter Property="Opacity" Value="0.5"></Setter>
        </Style.Triggers>
      </Style>
    <Image.Style/>
  </Image>
</Button>
```

在 Button IsEnabled 设置图片的透明，但是 UWP 不支持，所以需要使用别的方法。

## UWP 使用 Trigger

上面的代码可以很简单用 DataTriggerBehavior 来做。需要知道的是 DataTriggerBehavior 是 Behaviors 的一个东西，所以需要安装之后才可以使用。请看下面的代码。

```csharp
     <Button x:Name="MyButton" Margin="10,10,10,10" Width="140" Height="80">
            <Image x:Name="MyImage" Source="Assets/动漫.jpg">
                <interactivity:Interaction.Behaviors>
                        <core:DataTriggerBehavior Binding="{Binding IsEnabled, ElementName=MyButton}" Value="False">
                            <core:ChangePropertyAction TargetObject="{Binding ElementName=MyImage}" PropertyName="Opacity" Value="0.5" />
                        </core:DataTriggerBehavior>
                </interactivity:Interaction.Behaviors>
            </Image>
        </Button>
```

这里的代码不能直接复制使用，需要先添加命名空间和寻找一张图片，因为图片使用的是`Assets/动漫.jpg` ，所以需要把他修改为你的图片的所在，如何写参见[win10 uwp 访问解决方案文件](https://blog.lindexi.com/post/win10-uwp-%E8%AE%BF%E9%97%AE%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%E6%96%87%E4%BB%B6.html)

```csharp
命名空间

 xmlns:Interactivity="using:Microsoft.Xaml.Interactivity"
 xmlns:core="using:Microsoft.Xaml.Interactions.Core" 
```

不需要在后台写什么，直接运行可以看到在
按钮可以使用时的图片

![](images/img-modify-b8f146407a1dea341f2892c47dea6a48.jpg)

按钮无法使用时的图片

![](images/img-modify-6ea27827524742cb41ea55ea4ce69933.jpg)


请使用 DataTriggerBehavior 的Binding 连到需要修改的属性，在 Value 判断他的值。

然后可以在得到的值判断，修改透明

可以看到使用方法和动画一样

如果使用 MVVM 的话，可以把透明绑到一个属性，通过返回来设置，如果按钮有 `IsMyButtonEnabled` 那么可以使用下面的代码绑定透明，因为很简单我就不说啦。

```csharp
return IsMyButtonEnabled ? 1.0 : 0.5;
```

参见：[Trigger element (XAML) is not supported in a UWP project ](https://stackoverflow.com/questions/31929071/trigger-element-xaml-is-not-supported-in-a-uwp-project)


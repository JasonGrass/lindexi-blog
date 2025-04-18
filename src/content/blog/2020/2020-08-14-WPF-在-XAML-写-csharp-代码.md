---
title: "WPF 在 XAML 写 C# 代码"
pubDatetime: 2020-08-14 09:09:49
modDatetime: 2024-05-20 08:22:03
slug: WPF-在-XAML-写-C-代码
description: "WPF 在 XAML 写 C# 代码"
tags:
  - WPF
  - C#
---




本文告诉大家如何扔掉 cs 文件，在 xaml 写 C# 代码，将 xaml 和 C# 代码写在一个文件

<!--more-->


<!-- CreateTime:2020/8/14 17:09:49 -->



在 WPF 的 XAMl 有一个小伙伴也许看到但是忽略的特性就是 `x:Code` 特性，这个特性在 UWP 版本被干掉了，因为太好用了

其实小伙伴忽略这个特性也是对的，因为从设计上这不是一个好的方案，将 XAML 和业务逻辑 C# 代码放在一个文件里面

但是可以用来做和界面十分相关的逻辑，此时放在 XAML 文件的 C# 代码会提高代码的相关性

请看下面代码

```xml
    <Grid>
        <Button Name="Button" HorizontalAlignment="Center" VerticalAlignment="Center"
                Click="Button_OnClick">按钮</Button>
        <x:Code>
            <![CDATA[
    void Button_OnClick(object sender, RoutedEventArgs e)
    {
        Button.Content = "欢迎访问我博客 https://blog.lindexi.com 里面有大量 UWP WPF 博客";
    }
  ]]>
        </x:Code>
    </Grid>
```

此时不需要在 xaml.cs 文件里面添加按钮点击的事件的方法

本文代码放在 [github](https://github.com/lindexi/lindexi_gd/tree/e0643fc53fa07b404bbb3da8aeae5ff02ef8a3c8/JabalcheargelberechelFawhairharkere ) 欢迎小伙伴访问

但是这个方法有限制的是，因为无法添加using语句，因此限制了很多功能

不过其实这个是可以优化的，也许可以设计为 `@code` 的写法

```xml
    <Grid>
        <Button Name="Button" HorizontalAlignment="Center" VerticalAlignment="Center"
                Click="Button_OnClick">按钮</Button>
    @code
    {
        void Button_OnClick(object sender, RoutedEventArgs e)
        {
            Button.Content = "欢迎访问我博客 https://blog.lindexi.com 里面有大量 UWP WPF 博客";
        }
    }
    </Grid>
```

然后构建的时候将 `@code` 替换为 `x:Code` 的写法，这个方法也是可以的

现在 WPF 开源了，小伙伴可以进行随意的更改，如果构建自己的私有的 WPF 框架版本，请看 [手把手教你构建 WPF 框架的私有版本](https://blog.lindexi.com/post/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E6%9E%84%E5%BB%BA-WPF-%E6%A1%86%E6%9E%B6%E7%9A%84%E7%A7%81%E6%9C%89%E7%89%88%E6%9C%AC.html)


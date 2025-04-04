---
title: "win10 uwp 使用 Geometry resources 在 xaml"
pubDatetime: 2018-08-10 11:17:19
modDatetime: 2024-08-06 12:43:36
slug: win10-uwp-使用-Geometry-resources-在-xaml
description: "win10 uwp 使用 Geometry resources 在 xaml"
tags:
  - Win10
  - UWP
---




经常会遇到在 xaml 使用矢量图，对于 svg 的矢量图，一般都可以拿出来写在 Path 的 Data ，所以可以写为资源，但是写出来的是字符串，如何绑定 Geometry 到字符串资源？

<!--more-->


<!-- CreateTime:2018/8/10 19:17:19 -->


假如在资源写一个图片，看起来就是下面的代码

```csharp
<Page.Resources>
    <x:String x:Key="HomeIconGeometry">F1 M 24.0033,56.0078L 24.0033,38.0053L 22.0031,40.0056L 19.0027,35.0049L 38.0053,20.0028L 45.0063,25.5299L 45.0063,21.753L 49.0068,21.0029L 49.0068,28.6882L 57.008,35.0049L 54.0075,40.0056L 52.0073,38.0053L 52.0073,56.0078L 24.0033,56.0078 Z M 38.0053,26.9204L 27.0038,36.005L 27.0038,53.0074L 33.0046,53.0074L 33.0046,42.006L 43.006,42.006L 43.006,53.0074L 49.0068,53.0074L 49.0068,36.005L 38.0053,26.9204 Z</x:String>
</Page.Resources>
```

然后发现使用的是 string ，如果这时创建了一个用户控件，里面写了一个属性，请看代码

```csharp
public Geometry IconData
{
    get { return (Geometry)GetValue(IconDataProperty); }
    set { SetValue(IconDataProperty, value); }
}

public static readonly DependencyProperty IconDataProperty = 
    DependencyProperty.Register(nameof(IconData), typeof(Geometry), typeof(Header), new PropertyMetadata(null);
```

界面直接使用代码

```csharp
<local:Header x:Name="HeaderPanel" IconData="{StaticResource HomeIconGeometry}" />
```

就会在运行出现无法从string转换，但是如何把用户控件改为 Path ，就可以运行

![](images/img-modify-ff7ceb56ab9725e72bdfcd68b14334e9.jpg)

那么如何在用户控件使用资源的字符串

可以使用绑定，如果无法转换，可以写一个转换

先创建一个转换类

```csharp
public class GeometryConvert : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if (value is string str)
        {
            var geometry = (Geometry) XamlReader.Load(
                "<Geometry xmlns='http://schemas.microsoft.com/winfx/2006/xaml/presentation'>"
                + str + "</Geometry>");
            return geometry;
        }
        return null;
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        throw new NotImplementedException();
    }
}
```

然后在使用绑定的地方使用转换

```csharp
<local:GeometryConvert x:Key="GeometryConvert"></local:GeometryConvert>

<local:Header x:Name="HeaderPanel" IconData="{Binding Source={StaticResource HomeIconGeometry},Converter={StaticResource GeometryConvert}}" />
```

可以看到，这个方法可以显示图片

![](images/img-modify-7d4888ee1d17d9b72279dd0655424552.jpg)

所以，需要绑定字符串，可以使用这个方法。

有人说，绑定到字符串可以不使用转换，他可以做到，直接使用绑定，但是我暂时没法

[https://stackoverflow.com/a/45142555/6116637](https://stackoverflow.com/a/45142555/6116637)


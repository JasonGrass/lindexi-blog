---
title: "win10 uwp 在 ItemsPanelTemplate 里面通过样式绑定 Orientation 显示方向"
pubDatetime: 2019-03-16 02:28:44
modDatetime: 2024-08-06 12:43:37
slug: win10-uwp-在-ItemsPanelTemplate-里面通过样式绑定-Orientation-显示方向
description: "win10 uwp 在 ItemsPanelTemplate 里面通过样式绑定 Orientation 显示方向"
tags:
  - Win10
  - UWP
---




在 UWP 是不支持在 Setter 里面的 Value 进行绑定，如果想要在 ItemsPanelTemplate 里面绑定显示方向，那么需要通过附加属性的方法绑定。如果在后台代码定义了 Orientation 属性想要在 xaml 绑定到 ListView 的样式，可以尝试多创建一个帮助属性，用于在里面绑定

<!--more-->


<!-- CreateTime:2019/3/16 10:28:44 -->

<!-- csdn -->
<div id="toc"></div>

我在后台代码定义了属性 Orientation 请看代码

```csharp
        public static readonly DependencyProperty OrientationProperty = DependencyProperty.Register(
            "Orientation", typeof(Orientation), typeof(MainPage), new PropertyMetadata(default(Orientation)));

        public Orientation Orientation
        {
            get { return (Orientation) GetValue(OrientationProperty); }
            set { SetValue(OrientationProperty, value); }
        }
```

我在 xaml 有一个 ListView 准备将 Orientation 绑定到 ListView 的 ItemsPanel 通过一个样式

```csharp
<Setter Property="ItemsPanel">
    <Setter.Value>
        <ItemsPanelTemplate>
            <ItemsStackPanel Orientation="{Binding Orientation, RelativeSource={RelativeSource Mode=TemplatedParent}}"/>
        </ItemsPanelTemplate>
    </Setter.Value>
</Setter>
```

在开始绑定的时候，没有提示任何信息，也没有绑定成功

因为在 [Setter Class (Windows.UI.Xaml) - Windows UWP applications](https://docs.microsoft.com/en-us/uwp/api/Windows.UI.Xaml.Setter#Windows_UI_Xaml_Setter_Value ) 说到在 UWP 是不支持在 Setting 的 Value 绑定，这个和 WPF 不相同，建议使用静态的资源

> Windows Presentation Foundation (WPF) and Microsoft Silverlight supported the ability to use a Binding expression to supply the Value for a Setter in a Style. The Windows Runtime doesn't support a Binding usage for Setter.Value (the Binding won't evaluate and the Setter has no effect, you won't get errors, but you won't get the desired result either). When you convert XAML styles from Windows Presentation Foundation (WPF) or Microsoft Silverlight XAML, replace any Binding expression usages with strings or objects that set values, or refactor the values as shared {StaticResource} markup extension values rather than Binding -obtained values.

在这里是几乎无法通过静态资源做到绑定的，那么如何让在后台代码修改的时候，可以修改 xaml 里面的 ListView 的列表显示方向绑定到后台的属性？

在后台代码创建一个帮助绑定的类，这个类里面包含了一个附加属性，将会在这个附加属性里面尝试绑定

```csharp
    public class BindingHelper
    {
        public static readonly DependencyProperty ItemsPanelOrientationProperty = DependencyProperty.RegisterAttached(
            "ItemsPanelOrientation", typeof(bool), typeof(BindingHelper),
            new PropertyMetadata(default(bool), ItemsPanelOrientation_OnPropertyChanged));

    }
```

核心就在 `ItemsPanelOrientation_OnPropertyChanged` 方法，在这个方法里面找到 ItemsStackPanel 然后设置绑定

```csharp
        private static async void ItemsPanelOrientation_OnPropertyChanged(DependencyObject d,
            DependencyPropertyChangedEventArgs e)
        {
            if (d is ListView listView)
            {
                await listView.Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                {
                    if (listView.ItemsPanelRoot is ItemsStackPanel stackPanel)
                    {
                        BindingOperations.SetBinding(stackPanel, ItemsStackPanel.OrientationProperty, new Binding()
                        {
                            Path = new PropertyPath("Orientation"),
                            Mode = BindingMode.OneWay
                        });
                    }
                });
            }
        }
```

那么为什么需要在 `listView.Dispatcher.RunAsync` 里面绑定？因为初始的时候 `listView.ItemsPanelRoot` 是没有值的，需要等待创建完成这个属性

上面的代码是直接绑定，绑定到 DataContext 也就是需要在 ListView 指定 DataContext 才可以绑定

指定当前的 Page 作为 ListView 的 DataContext 请看代码

```csharp
<Page x:Name="Page1">
        <ListView DataContext="{x:Bind Page1}">
```

在样式里面多设置一个附加属性，这里的 Orientation 绑定是不会绑定的

```csharp
                <Style TargetType="ListView">
                    <Setter Property="ItemsPanel">
                        <Setter.Value>
                            <ItemsPanelTemplate>
                                <ItemsStackPanel Orientation="{Binding Orientation, RelativeSource={RelativeSource Mode=TemplatedParent}}"/>
                            </ItemsPanelTemplate>
                        </Setter.Value>
                    </Setter>
                    <Setter Property="local:BindingHelper.ItemsPanelOrientation" Value="True"></Setter>
                </Style>
```

添加一些元素用于 ListView 进行测试

```csharp
<Page
    x:Class="KeejemairbouLirallpurpallnasfakaw.MainPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="using:KeejemairbouLirallpurpallnasfakaw"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d"
    x:Name="Page1"
    Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">

    <Grid>
        <ListView DataContext="{x:Bind Page1}">
            <ListView.Style>
                <Style TargetType="ListView">
                    <Setter Property="ItemsPanel">
                        <Setter.Value>
                            <ItemsPanelTemplate>
                                <ItemsStackPanel />
                            </ItemsPanelTemplate>
                        </Setter.Value>
                    </Setter>
                    <Setter Property="local:BindingHelper.ItemsPanelOrientation" Value="True"></Setter>
                </Style>
            </ListView.Style>
            <ListView.Items>
                <TextBlock Text="1"></TextBlock>
                <TextBlock Text="2"></TextBlock>
                <TextBlock Text="3"></TextBlock>
            </ListView.Items>
        </ListView>
    </Grid>
</Page>

```

在后台代码的构造函数写一个循环，定时修改后台属性的方向的大小请看代码

```csharp
        public MainPage()
        {
            this.InitializeComponent();

            Task.Run(async () =>
            {
                while (true)
                {
                    await Dispatcher.RunAsync(CoreDispatcherPriority.Normal,
                        () => { Orientation = Orientation.Horizontal; });

                    await Task.Delay(TimeSpan.FromSeconds(5));

                    await Dispatcher.RunAsync(CoreDispatcherPriority.Normal,
                        () => { Orientation = Orientation.Vertical; });

                    await Task.Delay(TimeSpan.FromSeconds(5));
                }
            });
        }
```

现在看起来的界面是

![](images/img-modify-acdee12e45c23738a28e977c4eb50e4f.png)

写到这里的代码请看 [https://github.com/lindexi/lindexi_gd/tree/43ee46e847179b61157c5bfbbdec0382ccc97268/KeejemairbouLirallpurpallnasfakaw](https://github.com/lindexi/lindexi_gd/tree/43ee46e847179b61157c5bfbbdec0382ccc97268/KeejemairbouLirallpurpallnasfakaw)

不过附加属性里面使用延迟还是不靠谱，可能延迟拿到的 ListView 的数据是空，所以建议的方法是修改附加属性

```csharp
    public class BindingHelper
    {
        public static readonly DependencyProperty ItemsPanelOrientationProperty = DependencyProperty.RegisterAttached(
            "ItemsPanelOrientation", typeof(bool), typeof(BindingHelper),
            new PropertyMetadata(default(bool), ItemsPanelOrientation_OnPropertyChanged));

        private static void ItemsPanelOrientation_OnPropertyChanged(DependencyObject d,
            DependencyPropertyChangedEventArgs e)
        {
            if (d is ListView listView)
            {
                if (listView.IsLoaded)
                {
                    SetBind(listView);
                }
                else
                {
                    listView.Loaded += ListView_Loaded;
                }
            }
        }

        private static void ListView_Loaded(object sender, RoutedEventArgs e)
        {
            SetBind((ListView) sender);
        }

        private static void SetBind(ListView listView)
        {
            if (listView.ItemsPanelRoot is ItemsStackPanel stackPanel)
            {
                BindingOperations.SetBinding(stackPanel, ItemsStackPanel.OrientationProperty, new Binding()
                {
                    Path = new PropertyPath("Orientation"),
                    Mode = BindingMode.OneWay
                });
            }
        }

        public static void SetItemsPanelOrientation(DependencyObject element, bool value)
        {
            element.SetValue(ItemsPanelOrientationProperty, value);
        }

        public static bool GetItemsPanelOrientation(DependencyObject element)
        {
            return (bool) element.GetValue(ItemsPanelOrientationProperty);
        }
    }
```


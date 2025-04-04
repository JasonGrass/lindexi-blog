---
title: "C# dotnet 高性能多线程工具 ExecuteOnceAwaiter 只执行一次的任务"
pubDatetime: 2020-09-25 01:20:45
modDatetime: 2024-08-06 12:43:24
slug: C-dotnet-高性能多线程工具-ExecuteOnceAwaiter-只执行一次的任务
description: "C# dotnet 高性能多线程工具 ExecuteOnceAwaiter 只执行一次的任务"
tags:
  - dotnet
  - C#
---




本文将安利大家一个好用的工具，用来解决这样的问题，我有一个任务，要求这个任务在执行过程中不能被重入，只有在任务执行完成之后才能重置状态重新执行一次。换句话说就是在此任务正在执行过程中，不能重复进入此任务。同时在任务执行过程中，不能重置任务状态。在任务执行完成之后，可以保存任务的状态，直接返回任务结果。在任务执行完成之后，可以调用重置状态方法，让任务可以再次重新调用

<!--more-->


<!-- CreateTime:2020/9/25 9:20:45 -->




本文的这个 ExecuteOnceAwaiter 是放在 [dotnetCampus.AsyncWorkerCollection](https://www.nuget.org/packages/dotnetCampus.AsyncWorkerCollection) 库的工具，此项目在 [github](https://github.com/dotnet-campus/AsyncWorkerCollection) 开源，开源地址请看 [https://github.com/dotnet-campus/AsyncWorkerCollection](https://github.com/dotnet-campus/AsyncWorkerCollection)

## 适用

支持本机内多线程调用某一确定的任务的执行，任务仅执行一次，多次调用均返回相同结果

在任务执行完成之后，可以重置任务状态，让任务再次执行

如用来作为执行 同步 这个业务的工具。也就是在 同步 这个业务执行过程中，不允许再次执行 同步 这个业务。同时只要同步过了，那么再次调用只是返回同步结果。只有在同步之后状态发生变更之后，才能再次同步

## 使用方法

通过 NuGet 安装 [dotnetCampus.AsyncWorkerCollection](https://www.nuget.org/packages/dotnetCampus.AsyncWorkerCollection) 库

使用 ExecuteOnceAwaiter 需要创建传入执行的任务，传入任务支持给定任务返回值的泛形

```csharp
        public ExecuteOnceAwaiter<FooInfo> ExecuteOnceAwaiter { get; set; }

            var executeOnceAwaiter = new ExecuteOnceAwaiter<FooInfo>(AsyncAction);
            ExecuteOnceAwaiter = executeOnceAwaiter;
```

上面代码的 AsyncAction 可以是委托或本地方法，要求此方法返回值是 `Task<FooInfo>` 而此返回值 `FooInfo` 是自定义的类型，用于替换 ExecuteOnceAwaiter 的泛形

```csharp
        private async Task<FooInfo> AsyncAction()
        {
            // 忽略代码
        }
```

调用 ExecuteOnceAwaiter 的方法只有两个，一个是 ExecuteAsync 另一个是 ResetWhileCompleted 方法

调用 ExecuteAsync 的方法可以执行任务，如果任务的状态是没有执行，那么任务将执行。如果任务正在执行，或执行完成，那么将不会再次执行任务，而是返回 Task 用于等待获取任务执行结果

调用 ResetWhileCompleted 方法可以用来重置任务的状态，可以让任务支持再次被调用。重置任务状态仅在任务没有执行或任务执行完成之后才能生效。如果此时任务正在执行，那么调用 ResetWhileCompleted 方法 将什么都不做

## 例子

本文使用一个简单的 WPF 作为例子，这个界面很简单，就两个按钮，一个是启动任务，另一个是重置任务

<!-- ![](images/img-C# dotnet 高性能多线程工具 ExecuteOnceAwaiter 只执行一次的任务0.png) -->

![](images/img-modify-e7b8b7f7515f204d45b7d07454a542f1.jpg)

<!-- ![](images/img-C# dotnet 高性能多线程工具 ExecuteOnceAwaiter 只执行一次的任务1.gif) -->

执行的效果如下图，在点击启动任务多次的时候，只有一个任务在执行。在任务执行过程点击重置任务是啥都不做。在任务执行完成之后，点击重置任务，可以重新运行任务

![](images/img-modify-55a09eed222af2659aee252ef63c9752.gif)

界面代码如下

```xml
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition></RowDefinition>
            <RowDefinition Height="Auto"></RowDefinition>
        </Grid.RowDefinitions>
        <Grid>
            <TextBlock x:Name="LogTextBlock" Margin="10,10,10,10" TextWrapping="Wrap" VerticalAlignment="Bottom"></TextBlock>
        </Grid>
        <StackPanel Grid.Row="1" Margin="10,10,10,10"
                    Orientation="Horizontal" >
            <Button Margin="10,10,10,10" Content="启动任务" Click="StartTaskButton_OnClick"></Button>
            <Button Margin="10,10,10,10" Content="重置任务" Click="ResetTaskButton_OnClick"></Button>
        </StackPanel>
    </Grid>
```

后台代码如下

```csharp
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public ExecuteOnceAwaiter<FooInfo> ExecuteOnceAwaiter { get; set; }

        public MainWindow()
        {
            InitializeComponent();

            var executeOnceAwaiter = new ExecuteOnceAwaiter<FooInfo>(AsyncAction);
            ExecuteOnceAwaiter = executeOnceAwaiter;
        }

        private async Task<FooInfo> AsyncAction()
        {
            for (int i = 0; i < 10; i++)
            {
                await Dispatcher.InvokeAsync(() =>
                {
                    LogTextBlock.Text += $"执行任务 {i+1}/10\r\n";
                });

                await Task.Delay(TimeSpan.FromMilliseconds(500));
            }
         
            return new FooInfo();
        }

        private void StartTaskButton_OnClick(object sender, RoutedEventArgs e)
        {
            LogTextBlock.Text += $"点击启动任务按钮\r\n";

            ExecuteOnceAwaiter.ExecuteAsync();
        }

        private void ResetTaskButton_OnClick(object sender, RoutedEventArgs e)
        {
            LogTextBlock.Text += $"点击重置任务按钮\r\n";

            ExecuteOnceAwaiter.ResetWhileCompleted();
        }
    }

    public class FooInfo
    {

    }
```

代码放在[github](https://github.com/lindexi/lindexi_gd/tree/84ea6d8eaa7cdf4cbef9e1782d04e6f8590ea939/NedairkaweeBiheefallbahejay)欢迎小伙伴访问


## 感谢

此库 [dotnet-campus/AsyncWorkerCollection: 多线程异步工具](https://github.com/dotnet-campus/AsyncWorkerCollection ) 由多线程砖家[头像](https://xinyuehtx.github.io/ ) 用了一年的时间写的。在我所在团队的各大项目使用，经过两年时间大概 200 万台设备的测试是稳的。但是多线程很复杂，因为自己业务使用也许没有测试出坑，于是开源出来，请小伙伴协助测试


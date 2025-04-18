---
title: "win10 uwp Window.Current.Dispatcher中Current为null"
pubDatetime: 2018-08-10 11:16:53
modDatetime: 2024-08-06 12:43:38
slug: win10-uwp-Window.Current.Dispatcher中Current为null
description: "win10 uwp Window.Current.Dispatcher中Current为null"
tags:
  - Win10
  - UWP
---




本文说的是进行网络中异步界面出现的错误，可能带有一定的主观性和局限性，说的东西可能不对或者不符合每个人的预期。如果觉得我有讲的不对的，就多多包含，或者直接关掉这篇文章，但是请勿生气或者发怒吐槽，可以在我博客评论 http://blog.csdn.net/lindexi_gd

<!--more-->


<!-- CreateTime:2018/8/10 19:16:53 -->


<div id="toc"></div>

我们可以在修改属性使用

```csharp
    public abstract class NotifyPropertyChangedBase : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        protected async void OnPropertyChanged([CallerMemberName] string propName = "")
        {
            await Window.Current.Dispatcher.RunAsync(CoreDispatcherPriority.High,
                () =>
                {
                    PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propName));
                });
        }
    }
 ```

在老周博客：http://www.cnblogs.com/tcjiaan/p/5511419.html

但是我发现在 HttpRequest 中的函数出发了 OnPropertyChanged，这时发现 Current is null
 
并且：public event PropertyChangedEventHandler PropertyChanged;中 PropertyChanged 也是null

老周：由于线程出现嵌套，在Get请求回调的时候，窗口线程已由系统调整。就按你的做法，用主视图层上的调度对象来调用，应用程序级别的视图线程一般不会改变。

要么改用HttpClient类的异步方法来请求，是Windows.Web.Http下面的类，非.net core类型


![](images/img-modify-5ef24da17513dcef983d4f6449017fd2.jpg)

![](images/img-modify-55b84aa8d8f4af85cb67b6741e5690fa.jpg)

![](images/img-modify-06035307b27fe570fb7ec8aa7a6735d3.jpg)

简单方法：

```
await CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () => {  });
```



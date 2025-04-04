---
title: "dotnet 读 WPF 源代码笔记 AppDomainShutdownMonitor 的设计"
pubDatetime: 2020-12-21 13:08:30
modDatetime: 2024-05-20 08:22:04
slug: dotnet-读-WPF-源代码笔记-AppDomainShutdownMonitor-的设计
description: "dotnet 读 WPF 源代码笔记 AppDomainShutdownMonitor 的设计"
tags:
  - WPF
  - WPF源代码
---




本文是我在读 WPF 源代码做的笔记。在 WPF 中的 AppDomainShutdownMonitor 类是一个不开放的类，这个类当前只是给 D3DImage 类使用。在 AppDomainShutdownMonitor 提供了在应用的进程或程序域关闭的时候，进行一次通知，当前是用来清理 D3DImage 类的资源

<!--more-->


<!-- CreateTime:2020/12/21 21:08:30 -->


<!-- 标签：WPF，WPF源代码 -->
<!-- 发布 -->

在 WPF 中的 D3DImage 类是一个充满黑科技的类，这个类因为黑科技而有这样的要求，在进程退出或程序域关闭的时候，需要调用特别的逻辑进行释放资源。同时在 D3DImage 类被回收的时候，就不需要订阅进程退出或程序域关闭的时候的清理逻辑，因为在 D3DImage 回收的时候，将会自动执行清理逻辑

如果让 D3DImage 类去关注进程退出等，那么将会让 D3DImage 类更加复杂，因此在 WPF 里面加入了一个叫 IAppDomainShutdownListener 的接口，定义如下

```csharp
    internal interface IAppDomainShutdownListener
    {
        void NotifyShutdown();
    }
```

这是一个不开放的接口，继承这个接口的类可以获得在 AppDomain 退出的时候的通知

为了实现这个接口的调用功能，在 WPF 中定义了静态类 AppDomainShutdownMonitor 类，这个类里面将会提供注入 IAppDomainShutdownListener 对象，在 AppDomain 退出的时候调用 IAppDomainShutdownListener 对象的 NotifyShutdown 方法，大概逻辑如下

```csharp
        static AppDomainShutdownMonitor()
        {
            AppDomain.CurrentDomain.DomainUnload += OnShutdown;
            AppDomain.CurrentDomain.ProcessExit += OnShutdown;
        }

        public static void Add(IAppDomainShutdownListener listener)
        {
        	// 忽略代码
        }

        private static void OnShutdown(object sender, EventArgs e)
        {
        	// 忽略代码
        	listener.NotifyShutdown();
        }
```

如果只是这样的实现将会存在问题，因为 AppDomainShutdownMonitor 是静态类，如果在 Add 方法传入的是对象，被 AppDomainShutdownMonitor 的静态字段保存了，那么将无法释放 IAppDomainShutdownListener 对象。因此在 WPF 中的实际实现是采用一个 WeakReference 来实现

在当时的 WPF 开发的时候，还没有 `WeakReference<>` 类型

更改之后的逻辑大概如下

```csharp
        public static void Add(WeakReference listener)
        {
            Debug.Assert(listener.Target != null);
            Debug.Assert(listener.Target is IAppDomainShutdownListener);

            lock (_dictionary)
            {
                if (!_shuttingDown)
                {
                    _dictionary.Add(listener, listener);
                }
            }
        }

        private static Dictionary<WeakReference, WeakReference> _dictionary;
```

为什么上面的存放 listener 对象的容器是 Dictionary 而不是 List 呢？因为还有这样的需求，在 D3DImage 类被回收的时候，就不需要订阅进程退出或程序域关闭的时候的清理逻辑，因此还有一个 Remove 方法

```csharp
        public static void Remove(WeakReference listener)
        {
            Debug.Assert(listener.Target == null || listener.Target is IAppDomainShutdownListener);

            lock (_dictionary)
            {
                if (!_shuttingDown)
                {
                    _dictionary.Remove(listener);
                }
            }
        }
```

调用 Add 和 Remove 的代码分别如下

```csharp
        public D3DImage(double dpiX, double dpiY)
        {
            // 忽略代码
            _listener = new WeakReference(this);
            AppDomainShutdownMonitor.Add(_listener);
        }

        ~D3DImage()
        {
            // 忽略代码
            AppDomainShutdownMonitor.Remove(_listener);
        }
```

为了能更快的调用 Remove 方法，也就将存放的容器设计为 Dictionary 了，但实际上没有使用链表快，想不开的话，我会去优化一下这个逻辑

然而经过了测试，发现了实际上在 .NET 5 里面的字典在加元素和删除元素还是完虐链表的，我写了简单的性能测试项目，代码放在[github](https://github.com/lindexi/lindexi_gd/tree/b63ba44c2077bcc4136455f16b309fe74a288dcc/HurnabahearwhawJehearhefena)欢迎小伙伴访问。因为在这个类里面不需要用到字典，只需要 HashSet 就可以，于是我优化了一个版本，放在 [Replace the Dictionary with HashSet in AppDomainShutdownMonitor by lindexi · Pull Request #3932 · dotnet/wpf](https://github.com/dotnet/wpf/pull/3932) 这个更改内容我也放在 [bilibili](https://www.bilibili.com/video/BV1fK4y1L74G/) 上

通过上面的逻辑，相信大家也了解到如何写出在应用退出的时候的逻辑，以及编写的时候可以参阅 WPF 的设计，尽管因为 WPF 写这段逻辑的时候很多好用的特性还没开发出来，但是需要稍微做一点改动，就可以用上新特性加上这个设计方式做到在应用退出的时候执行一些逻辑的清理


当前的 WPF 在 [https://github.com/dotnet/wpf](https://github.com/dotnet/wpf) 完全开源，使用友好的 MIT 协议，意味着允许任何人任何组织和企业任意处置，包括使用，复制，修改，合并，发表，分发，再授权，或者销售。在仓库里面包含了完全的构建逻辑，只需要本地的网络足够好（因为需要下载一堆构建工具），即可进行本地构建



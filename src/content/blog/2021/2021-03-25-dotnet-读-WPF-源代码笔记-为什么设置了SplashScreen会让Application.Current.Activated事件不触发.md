---
title: "dotnet 读 WPF 源代码笔记 为什么设置了SplashScreen会让Application.Current.Activated事件不触发"
pubDatetime: 2021-03-25 00:55:32
modDatetime: 2024-05-20 08:22:04
slug: dotnet-读-WPF-源代码笔记-为什么设置了SplashScreen会让Application.Current.Activated事件不触发
description: "dotnet 读 WPF 源代码笔记 为什么设置了SplashScreen会让Application.Current.Activated事件不触发"
tags:
  - WPF
  - WPF源代码
---




在 WPF 应用中，可以非常方便将一张图片设置为 SplashScreen 启动界面欢迎图，但是如果有设置了启动界面欢迎界面，那么 Application.Current.Activated 事件就不会被触发。本文通过 WPF 框架开源的代码告诉大家这个原因

<!--more-->


<!-- CreateTime:2021/3/25 8:55:32 -->

<!-- 发布 -->
<!-- 标签：WPF，WPF源代码 -->

这是在 GitHub 上，一个小伙伴问的问题，详细请看 [After adding a splashscreen Application.Current.Activated event is no longer fired · Issue #4316 · dotnet/wpf](https://github.com/dotnet/wpf/issues/4316 )

设置某个图片作为 SplashScreen 启动图的方式很简单，只需要右击图片，设置属性，选择 SplashScreen 就可以。也可以在 csproj 中添加如下代码设置

```xml
  <ItemGroup>
    <SplashScreen Include="SplashScreen.png" />
  </ItemGroup>
```

尝试在 App 的构造函数里面添加如下代码用来监听 Activated 事件

```csharp
    public partial class App : Application
    {
        public App()
        {
            Current.Activated += Current_Activated;
        }

        private void Current_Activated(object sender, EventArgs e)
        {
        }
    }
```

在没有设置 SplashScreen 时，你可以发现 `Current_Activated` 函数将会进入，而在设置 SplashScreen 之后，将不会进入此方法

原因是在设置 SplashScreen 启动界面，那么在生成的 App.g.cs 文件里面将会包含下面代码

```csharp
        [System.STAThreadAttribute()]
        [System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [System.CodeDom.Compiler.GeneratedCodeAttribute("PresentationBuildTasks", "5.0.1.0")]
        public static void Main() 
        {
            SplashScreen splashScreen = new SplashScreen("SplashScreen.png");
            splashScreen.Show(true);
            App app = new App();
            app.InitializeComponent();
            app.Run();
        }
```

也就是说 SplashScreen 将会在 Main 函数里面最开始就执行，因此启动图显示的速度也比较快。在 SplashScreen 显示完成之后，再创建 App 出来，也就是说监听 Activated 事件是在启动图之后

那么 Activated 事件是由谁分发的？在 `src\Microsoft.DotNet.Wpf\src\PresentationFramework\System\Windows\Application.cs` 的 EnsureHwndSource 函数里面将是入口代码，而在 WmActivateApp 函数就是触发的逻辑，先看一下 WmActivateApp 的代码

```csharp
        private bool WmActivateApp(Int32 wParam)
        {
            int temp = wParam;
            bool isActivated = (temp == 0? false : true);

            // Event handler exception continuality: if exception occurs in Activate/Deactivate event handlers, our state would not
            // be corrupted because no internal state are affected by Activate/Deactivate. Please check Event handler exception continuality
            // if a state depending on those events is added.
            if (isActivated == true)
            {
                OnActivated(EventArgs.Empty);
            }
            else
            {
                OnDeactivated(EventArgs.Empty);
            }
            return false;
        }
```

也就是说调用进入 WmActivateApp 的参数将决定是否调用 OnActivated 函数，在 OnActivated 函数里面就是事件触发

```csharp
        protected virtual void OnActivated(EventArgs e)
        {
            VerifyAccess();
            if (Activated != null)
            {
                Activated(this, e);
            }
        }
```

而 WmActivateApp 从函数名就可以看出，这是一个由 Win32 的 Windows 消息触发的方法，在 AppFilterMessage 函数里面将会调用到 WmActivateApp 方法。而 AppFilterMessage 函数的命名意思是 `App` 类的 FilterMessage 方法，也就是说这是一个处理应用级的 Windows 消息的函数，代码如下

```csharp
        private IntPtr AppFilterMessage(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
        {
            IntPtr retInt = IntPtr.Zero;
            switch ((WindowMessage)msg)
            {
                case WindowMessage.WM_ACTIVATEAPP:
                    handled = WmActivateApp(NativeMethods.IntPtrToInt32(wParam));
                    break;
                case WindowMessage.WM_QUERYENDSESSION :
                    handled = WmQueryEndSession(lParam, ref retInt);
                    break;
                default:
                    handled = false;
                    break;
            }
            return retInt;
        }
```

这个 AppFilterMessage 方法是在 EnsureHwndSource 函数里面注册消息的，请看代码

```csharp
        private void EnsureHwndSource()
        {
            if (_parkingHwnd == null)
            {
                // _appFilterHook needs to be member variable otherwise
                // it is GC'ed and we don't get messages from HwndWrapper
                // (HwndWrapper keeps a WeakReference to the hook)

                _appFilterHook = new HwndWrapperHook(AppFilterMessage);
                HwndWrapperHook[] wrapperHooks = {_appFilterHook};

                _parkingHwnd = new HwndWrapper(
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                "",
                                IntPtr.Zero,
                                wrapperHooks);
            }
        }
```

也就是说 Activated 事件的触发就是依靠 WindowMessage.WM_ACTIVATEAPP 消息的，这个消息详细请看 [WM_ACTIVATEAPP 官方文档](https://docs.microsoft.com/zh-cn/windows/win32/winmsg/wm-activateapp?WT.mc_id=WD-MVP-5003260 )

因为 SplashScreen 本身将会创建窗口，也因为 SplashScreen 的速度足够快，因此在 Application 的 EnsureHwndSource 函数调用之前，系统发送了 WM_ACTIVATEAPP 消息给到应用了

所以在 App 的构造函数监听 Activated 事件将不会收到触发

如果想要使用欢迎界面，也想收到系统的消息，可以在创建 Application 之后，手动创建 SplashScreen 类，或者可以使用 lsj 提供的 [kkwpsv/SplashImage: Fast splash Image with GDI+ in C#](https://github.com/kkwpsv/SplashImage) 库，当然了，这个库代码量特别少，我推荐大家可以抄抄代码。这个库提供的是高性能的版本，可以在另一个线程中执行，换句话说，就是使用 [kkwpsv/SplashImage](https://github.com/kkwpsv/SplashImage) 作为欢迎界面，是可以做到不占用 WPF 主线程时间的，性能比 WPF 提供的好

我尝试修改 WPF 框架代码来支持在设置 SplashScreen 还能在构造函数添加事件，收到触发，请看 [Try to create application before show SplashScreen by lindexi · Pull Request #4340 · dotnet/wpf](https://github.com/dotnet/wpf/pull/4340 )

更多请看 [dotnet 读 WPF 源代码笔记 启动欢迎界面 SplashScreen 的原理](https://blog.lindexi.com/post/dotnet-%E8%AF%BB-WPF-%E6%BA%90%E4%BB%A3%E7%A0%81%E7%AC%94%E8%AE%B0-%E5%90%AF%E5%8A%A8%E6%AC%A2%E8%BF%8E%E7%95%8C%E9%9D%A2-SplashScreen-%E7%9A%84%E5%8E%9F%E7%90%86.html )

当前的 WPF 在 [https://github.com/dotnet/wpf](https://github.com/dotnet/wpf) 完全开源，使用友好的 MIT 协议，意味着允许任何人任何组织和企业任意处置，包括使用，复制，修改，合并，发表，分发，再授权，或者销售。在仓库里面包含了完全的构建逻辑，只需要本地的网络足够好（因为需要下载一堆构建工具），即可进行本地构建


<!-- 
Why the Application.Current.Activated event is no longer fired?
因为 Activated 是在 Application 类的 WmActivateApp 方法里面触发的
Because Activated is fired in the WmActivateApp method of the Application class. 
而 WmActivateApp 方法是依靠 Windows 消息触发的
The WmActivateApp method is fired by Windows messages. See [WM_ACTIVATEAPP](https://docs.microsoft.com/zh-cn/windows/win32/winmsg/wm-activateapp?WT.mc_id=WD-MVP-5003260 )

```csharp
        private void EnsureHwndSource()
        {
            if (_parkingHwnd == null)
            {
                // _appFilterHook needs to be member variable otherwise
                // it is GC'ed and we don't get messages from HwndWrapper
                // (HwndWrapper keeps a WeakReference to the hook)

                _appFilterHook = new HwndWrapperHook(AppFilterMessage);
                HwndWrapperHook[] wrapperHooks = {_appFilterHook};

                _parkingHwnd = new HwndWrapper(
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                "",
                                IntPtr.Zero,
                                wrapperHooks);
            }
        }

        private IntPtr AppFilterMessage(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
        {
            IntPtr retInt = IntPtr.Zero;
            switch ((WindowMessage)msg)
            {
                case WindowMessage.WM_ACTIVATEAPP:
                    handled = WmActivateApp(NativeMethods.IntPtrToInt32(wParam));
                    break;
                case WindowMessage.WM_QUERYENDSESSION :
                    handled = WmQueryEndSession(lParam, ref retInt);
                    break;
                default:
                    handled = false;
                    break;
            }
            return retInt;
        }

        private bool WmActivateApp(Int32 wParam)
        {
            int temp = wParam;
            bool isActivated = (temp == 0? false : true);

            // Event handler exception continuality: if exception occurs in Activate/Deactivate event handlers, our state would not
            // be corrupted because no internal state are affected by Activate/Deactivate. Please check Event handler exception continuality
            // if a state depending on those events is added.
            if (isActivated == true)
            {
                OnActivated(EventArgs.Empty);
            }
            else
            {
                OnDeactivated(EventArgs.Empty);
            }
            return false;
        }
```

但是在设置 SplashScreen 之后，WPF将会在生成的 App.g.cs 文件里面创建代码
But after setting SplashScreen, WPF will create the code in the generated App.g.cs file.

```csharp
        [System.STAThreadAttribute()]
        [System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [System.CodeDom.Compiler.GeneratedCodeAttribute("PresentationBuildTasks", "5.0.1.0")]
        public static void Main() 
        {
            SplashScreen splashScreen = new SplashScreen("SplashScreen.png");
            splashScreen.Show(true);
            App app = new App();
            app.InitializeComponent();
            app.Run();
        }
```

就如你所见到一样，在 Main 函数里面将会先调用 SplashScreen 然后再创建 App 对象
As you can see, in the Main function, SplashScreen will be called first and then the App object will be created.
但是 SplashScreen 将会创建窗口，而且 SplashScreen 创建的速度非常快。在 SplashScreen 创建窗口完成之后，系统将会发送 WM_ACTIVATEAPP 消息给到应用。但此时的 App 对象还没有创建完成。
And SplashScreen will create windows very fast. After the SplashScreen creates the window, the system will send the WM_ACTIVATEAPP message to the application. But at this time the App object has not been created yet. 
因此在 Application 的 EnsureHwndSource 函数被调用之前，系统已经发送过了WM_ACTIVATEAPP消息给到应用
Therefore, before EnsureHwndSource method in Application is called, the system has already sent the WM_ACTIVATEAPP message to the application.
所以 Application 的 AppFilterMessage 方法将不会收到 WM_ACTIVATEAPP 消息，并且不会触发 Activated 事件
So AppFilterMessage method in Application will not receive WM_ACTIVATEAPP message, and will not trigger the Activated event 
 -->

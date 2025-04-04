---
title: "WPF 弹出 popup 里面的 TextBox 无法输入汉字"
pubDatetime: 2018-12-21 10:10:30
modDatetime: 2024-11-20 06:11:29
slug: WPF-弹出-popup-里面的-TextBox-无法输入汉字
description: "WPF 弹出 popup 里面的 TextBox 无法输入汉字"
tags:
  - WPF
---




这是一个 wpf 的bug，在弹出Popup之后，如果 Popup 里面有 TextBox ，这时无法在里面输入文字。

<!--more-->


<!-- CreateTime:2018/12/21 18:10:30 -->

<!-- csdn -->

因为 Popup 的句柄具有 WS_EX_NOACTIVATE 的特性，所以 Popup 是无法获得焦点。在微软的系统，所有的窗口、控件都是有句柄，句柄就是一个指针，获得他才知道是哪个控件。

古老的输入法就是通过判断获得焦点的句柄是支持输入和判断他需要什么输入，如果在 win7 的搜狗，就是这样判断，于是搜狗很难在 Popup 的 TextBox 输入文字。

这个问题实际很好解决，最简单的方法是把程序修改为 .net 4.6.2 以上，这个 bug 已经在 .net 4.6.2 修复了。或者升级到 win10 系统。如果刚好两个方法都不能使用，那么通过代码也可以解决。

解决的方法是让输入法知道控件的句柄，这需要一个 win32 的 dll ，传说中的 User32.dll ，这个dll有`SetFocus`这个方法，请通过下面的代码在Popup打开时调用。代码的 ThePopup 就是需要打开的。

```csharp
[DllImport("User32.dll")]
public static extern IntPtr SetFocus(IntPtr hWnd);

IntPtr GetHwnd(Popup popup)
{
    HwndSource source = (HwndSource)PresentationSource.FromVisual(popup.Child);
    return source.Handle;
}

private void ShowPopupButtonClick(object sender, RoutedEventArgs e)
{
    ThePopup.IsOpen = true;
    IntPtr handle = GetHwnd(ThePopup);
    SetFocus(handle);
}

```

这是一个简单的方法。当然还有另一个方法，使用`SetForegroundWindow`方法，将 Popup 设置到前台获取焦点

```csharp
[DllImport("USER32.DLL")]
[return: MarshalAs(UnmanagedType.Bool)]
public static extern bool SetForegroundWindow(IntPtr hWnd);
 
public static void ActivatePopup(Popup popup)
{
    HwndSource source = (HwndSource)PresentationSource.FromVisual(popup.Child);
    IntPtr handle = source.Handle;
 
    SetForegroundWindow(handle);
}
```

参见：https://www.codeproject.com/Questions/184429/Text-box-is-not-working-in-WPF-Popup

使用 `SetForegroundWindow` 方法的例子代码放在[github](https://github.com/lindexi/lindexi_gd/tree/1666e742fbd5ebda36e840a8e5f4b866251b3004/GakelfojeNairwogewerwhiheecem) 和 [gitee](https://gitee.com/lindexi/lindexi_gd/tree/1666e742fbd5ebda36e840a8e5f4b866251b3004/GakelfojeNairwogewerwhiheecem) 欢迎访问

可以通过如下方式获取本文的源代码，先创建一个空文件夹，接着使用命令行 cd 命令进入此空文件夹，在命令行里面输入以下代码，即可获取到本文的代码

```
git init
git remote add origin https://gitee.com/lindexi/lindexi_gd.git
git pull origin 1666e742fbd5ebda36e840a8e5f4b866251b3004
```

以上使用的是 gitee 的源，如果 gitee 不能访问，请替换为 github 的源。请在命令行继续输入以下代码

```
git remote remove origin
git remote add origin https://github.com/lindexi/lindexi_gd.git
git pull origin 1666e742fbd5ebda36e840a8e5f4b866251b3004
```

获取代码之后，进入 GakelfojeNairwogewerwhiheecem 文件夹

如果发现使用了我的方法还是无法输入，那么需要看一下 TextBox 是否禁用输入法，全局搜项目是否调用了如下代码

```csharp
 InputMethod.SetIsInputMethodSuspended
```

如果发现设置了，那就尝试先注释掉代码，试试是否能输入。如果可以输入，再到开发者确认是否可以修改需求

这个问题已经反馈给微软，微软已经修复，详细请看: [https://connect.microsoft.com/VisualStudio/feedback/details/389998/wpf-popup-messes-with-ime-switching](https://connect.microsoft.com/VisualStudio/feedback/details/389998/wpf-popup-messes-with-ime-switching)

## 修复在 Popup 输入法不跟随

在 Popup 里的 TextBox 输入可能出现输入法未跟随编辑框，这时需要调用 Win32 的方法，将 Popup 窗口设置焦点。在 WPF 里面，和其他的正常 Win32 应用一样，采用窗口来承载 Popup 内容。也就是说，创建显示一个 Popup 等于创建显示一个 Win32 窗口。有时候会影响复杂的逻辑导致 Popup 所在窗口没有获取到正确的焦点，从而让输入法没有跟随

```csharp
[DllImport("User32.dll")]
public static extern IntPtr SetFocus(IntPtr hWnd);

public IntPtr GetHwnd(Popup popup)
{
    HwndSource source = (HwndSource)PresentationSource.FromVisual(popup.Child);
    return source.Handle;
}
```

在 TextBox 获得焦点的时候调用下面代码

```csharp
xxPopup.GotFocus += Popup_GotFocus;

        private void Popup_GotFocus(object sender, RoutedEventArgs e)
        {
            // WPF BUG Fix：TextBox 在 Popup 中，IME 备选框不跟随
            Win32.SetFocus(GetHwnd(RenamePopup.Child));
        }
```

此问题报告最多的是搜狗的输入法，且不是所有用户都能遇到

## 在 WinForms 弹出的 WPF 的 TextBox 无法输入问题

刚刚 Siberia 问了我一个问题，为什么 WinForms 弹出的 WPF 的文本框无法输入数字，但是可以输入其他的内容

一开始我认为的是绑定的问题，如果一个控件绑定了另一个控件，或者有后台代码绑定，有另一个控件绑定了输入框都有方法让用户输入的数字不显示

如果是我在调试，我会先拿到 TextChanged 事件，看是不显示还是没有接收到输入

另外需要判断当前的焦点是否在 TextBox 上

按照这个方法会发现有焦点，但是没有 TextChanged 收到输入，这时因为 WinForms 弹出的 WPF 程序消息循环的键盘事件的问题，对于中文的输入，有输入法在 HasKeyboardFocusCore 拿到输入，但是如果数字不经过输入法就在 WinForms 收到数字

解决的方法是调用 EnableModelessKeyboardInterop 传入 WPF 就可以

```csharp
Window winWPF = new Window();  //WinWPF为想要显示的WPF窗体。
System.Windows.Forms.Integration.ElementHost.EnableModelessKeyboardInterop(winWPF);
winWPF.Show(); 
```

[WPF 禁用TextBox的触摸后自动弹出虚拟键盘 - 唐宋元明清2188 - 博客园](https://www.cnblogs.com/kybs0/archive/2018/12/21/10154433.html )

[解决Winform中弹出WPF窗体不能在文本框中输入的问题 - 飞鹰的专栏 - CSDN博客](https://blog.csdn.net/feiying008/article/details/9928441 )

[Windows 窗体和 WPF 互操作性输入 - 小而美 - CSDN博客](https://blog.csdn.net/lovexiaoxiao/article/details/8862334 )

[ElementHost.EnableModelessKeyboardInterop(Window) Method (System.Windows.Forms.Integration)](https://docs.microsoft.com/en-us/dotnet/api/system.windows.forms.integration.elementhost.enablemodelesskeyboardinterop?view=netframework-4.7.2 )

## 相关博客

[将 WPF 嵌入到 MFC 中，无法响应键盘输入 - J.晒太阳的猫 - 博客园](https://www.cnblogs.com/jasongrass/p/18555472 )

[WPF 让窗口激活作为前台最上层窗口的方法](https://blog.lindexi.com/post/WPF-%E8%AE%A9%E7%AA%97%E5%8F%A3%E6%BF%80%E6%B4%BB%E4%BD%9C%E4%B8%BA%E5%89%8D%E5%8F%B0%E6%9C%80%E4%B8%8A%E5%B1%82%E7%AA%97%E5%8F%A3%E7%9A%84%E6%96%B9%E6%B3%95.html )

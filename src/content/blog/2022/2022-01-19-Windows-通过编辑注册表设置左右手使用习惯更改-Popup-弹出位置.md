---
title: "Windows 通过编辑注册表设置左右手使用习惯更改 Popup 弹出位置"
pubDatetime: 2022-01-19 00:40:14
modDatetime: 2024-08-06 12:43:39
slug: Windows-通过编辑注册表设置左右手使用习惯更改-Popup-弹出位置
description: "Windows 通过编辑注册表设置左右手使用习惯更改 Popup 弹出位置"
---




本文告诉大家如何在通过更改注册表的设置，从而更改平板电脑设置 Tablet PC Settings 的左右手使用习惯 Handedness 的惯用左手和惯用右手选项

<!--more-->


<!-- CreateTime:2022/1/19 8:40:14 -->
<!-- 发布 -->

在用户端，可以通过在运行里面，输入 `shell:::{80F3F1D5-FECA-45F3-BC32-752C152E456E}` 按下回车，可以进入平板电脑设置界面，中文版和英文版界面分别如下

<!-- ![](images/img-Windows 通过编辑注册表设置左右手使用习惯更改 Popup 弹出位置0.png) -->
![](images/img-modify-6ee22fa3dc0760cee2643806723d4c9a.jpg)

<!-- ![](images/img-Windows 通过编辑注册表设置左右手使用习惯更改 Popup 弹出位置1.png) -->
![](images/img-modify-7a1d1c7a80927526be43276239d0ca46.jpg)

这个选项将会影响 WPF 的 Popup 弹出的默认方向位置，以及所有的菜单的弹出方向位置

设置惯用左手时的 Popup 弹出行为如下：

<!-- ![](images/img-Windows 通过编辑注册表设置左右手使用习惯更改 Popup 弹出位置3.png) -->
![](images/img-modify-7ed377a233464319b92829be6fd79088.jpg)

设置惯用右手时的 Popup 弹出行为如下：

<!-- ![](images/img-Windows 通过编辑注册表设置左右手使用习惯更改 Popup 弹出位置2.png) -->
![](images/img-modify-c0f7ba3e50516f087b9bcf202bbd9012.jpg)

通过注册表修改设置的方式是在运行里输入 `regedit` 打开注册表编辑，进入 `HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Windows` 路径，修改 `MenuDropAlignment` 选项。默认的 `MenuDropAlignment` 选项是 0 的值，不同的值对应如下

- 0 ： 默认值，惯用左手
- 1 ： 惯用右手

可通过更改 `HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Windows\MenuDropAlignment` 项从而修改用户设置，修改之后，需要重启才能生效

在 WPF 忽略此属性影响，可以使用如下方法

```csharp
    public static class PopupHacks
    {
        private static FieldInfo? _menuDropAlignmentField;

        /// <summary>
        /// 禁用系统的菜单弹出方向设置，取消对应用程序的Popup弹出方向的影响
        /// </summary>
        public static void DisableSystemMenuPopupAlignment()
        {
            _menuDropAlignmentField = typeof(SystemParameters).GetField("_menuDropAlignment", BindingFlags.NonPublic | BindingFlags.Static);
            System.Diagnostics.Debug.Assert(_menuDropAlignmentField != null);

            EnsureStandardPopupAlignment();
            SystemParameters.StaticPropertyChanged -= SystemParameters_StaticPropertyChanged;
            SystemParameters.StaticPropertyChanged += SystemParameters_StaticPropertyChanged;
        }

        private static void SystemParameters_StaticPropertyChanged(object? sender, PropertyChangedEventArgs e)
        {
            EnsureStandardPopupAlignment();
        }

        private static void EnsureStandardPopupAlignment()
        {
            if (SystemParameters.MenuDropAlignment)
            {
                _menuDropAlignmentField?.SetValue(null, false);
            }
        }
    }
```

更多请看 [Popup element are reversed left and right in Windows 11 · Issue #5944 · dotnet/wpf](https://github.com/dotnet/wpf/issues/5944 )


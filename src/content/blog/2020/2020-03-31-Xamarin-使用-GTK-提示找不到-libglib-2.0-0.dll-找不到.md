---
title: "Xamarin 使用 GTK 提示找不到 libglib-2.0-0.dll 找不到"
pubDatetime: 2020-03-30 21:26:58
modDatetime: 2024-05-20 08:22:03
slug: Xamarin-使用-GTK-提示找不到-libglib-2.0-0.dll-找不到
description: "Xamarin 使用 GTK 提示找不到 libglib-2.0-0.dll 找不到"
tags:
  - Xamarin
  - GTK
---




在使用 Xamarin 开发 Linux 应用的时候，刚开始如果没有弄好 libglib-2.0-0.dll 的依赖库，那么将会在运行的时候，在 Gtk.Application.Init() 这句代码提示找不到这个库

<!--more-->


<!-- CreateTime:3/31/2020 5:26:58 PM -->

<!-- 标签：Xamarin, GTK -->


解决方法是先到[官网](https://www.monodevelop.com/download/#fndtn-download-win) 下载 `GTK#` 安装包或 mono x86 的应用

安装到默认路径，也就是在 `C:\Program Files (x86)\GtkSharp\2.12\bin` 路径，默认安装的时候会加入到环境变量

接下来到 `C:\Program Files (x86)\GtkSharp\2.12\bin` 复制 libglib-2.0-0.dll 文件到 xamarin 的输出文件夹，如 `D:\lindexi\t\Xamarin\Cla\bin\x86\Debug\net47` 文件夹里面，此时尝试运行，应该就不会存在这个提示

注意现在 GTK# 仅支持 x86 应用

[DllNotFoundException: Unable to load DLL 'libgtk-win32-2.0-0.dll · Issue #937 · mono/xwt](https://github.com/mono/xwt/issues/937 )

[Unable to load DLL 'libgtk-win32-2.0-0.dll' — Xamarin Community Forums](https://forums.xamarin.com/discussion/15568/unable-to-load-dll-libgtk-win32-2-0-0-dll )

[Gnome - Tomboy - Unable to load DLL 'libgtk-win 32-2.0-0.dll'](http://gnome-tomboy.1788872.n4.nabble.com/Unable-to-load-DLL-libgtk-win-32-2-0-0-dll-td4654493.html )

[Index of /sources/gtk-sharp212](https://download.mono-project.com/sources/gtk-sharp212/ )

[Xamarin.Forms/Xamarin.Forms.Platform.GTK at master · xamarin/Xamarin.Forms](https://github.com/xamarin/Xamarin.Forms/tree/master/Xamarin.Forms.Platform.GTK )

[jsuarezruiz/xamarin-forms-gtk-weather-sample: Xamarin.Forms GTK Backend Weather Sample](https://github.com/jsuarezruiz/xamarin-forms-gtk-weather-sample )

[windows - Xamarin Studio, GTK 2.0 C# application, runtime error, can't load libglib-2.0-0.dll - Stack Overflow](https://stackoverflow.com/questions/34279001/xamarin-studio-gtk-2-0-c-sharp-application-runtime-error-cant-load-libglib-2 )


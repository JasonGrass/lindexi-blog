---
title: "resharper 跳转到源代码"
pubDatetime: 2018-08-10 11:16:52
modDatetime: 2024-08-06 12:43:33
slug: resharper-跳转到源代码
description: "resharper 跳转到源代码"
tags:
  - ReSharper
---




resharper 可以使用 ctrl+b 跳转到源代码，但是如果使用库的源代码，那么如何跳转，会显示对象管理器，那么如何让resarper 跳转到源代码

<!--more-->


<!-- CreateTime:2018/8/10 19:16:52 -->

<!-- csdn -->

打开 resharper 选择设置。

打开 tool->External xx 

![](images/img-modify-2980c3d4ccc6c167b58f38c4e2ebefb1.jpg)

选择跳转到源代码，点击确定，这样就可以让他跳转到源代码

自动可以让他反编译库，resharper很是厉害，有了他，我打码速度加了几十倍

参见：

[resharper 自定义代码片](https://blog.lindexi.com/post/resharper-%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BB%A3%E7%A0%81%E7%89%87.html )

[Resharper 如何把类里的类移动到其他文件](https://blog.lindexi.com/post/Resharper-%E5%A6%82%E4%BD%95%E6%8A%8A%E7%B1%BB%E9%87%8C%E7%9A%84%E7%B1%BB%E7%A7%BB%E5%8A%A8%E5%88%B0%E5%85%B6%E4%BB%96%E6%96%87%E4%BB%B6.html )

如果需要设置 Resharper 的快捷键，可以到 VisualStudio 的工具 设置，键盘，搜索对应的 Resharper 的快捷键设置。

关于如何获得 Resharper 快捷键，请看[Default Keyboard Shortcut Schemes](https://www.jetbrains.com/help/resharper/Reference__Keyboard_Shortcuts.html#navigation_and_search)


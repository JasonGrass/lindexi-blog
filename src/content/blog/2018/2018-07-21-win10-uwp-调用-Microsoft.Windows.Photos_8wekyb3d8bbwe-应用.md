---
title: "win10 uwp 调用 Microsoft.Windows.Photos_8wekyb3d8bbwe 应用"
pubDatetime: 2018-07-21 01:48:45
modDatetime: 2024-05-20 08:22:05
slug: win10-uwp-调用-Microsoft.Windows.Photos_8wekyb3d8bbwe-应用
description: "win10 uwp 调用 Microsoft.Windows.Photos_8wekyb3d8bbwe 应用"
tags:
  - Win10
  - UWP
---




本文告诉大家调用的 Microsoft.Windows.Photos_8wekyb3d8bbwe 是什么应用

<!--more-->


<!-- CreateTime:2018/7/21 9:48:45 -->

<!-- csdn -->
<div id="toc"></div>

在看到这两篇博客 [UWP 浏览本地图片及对图片的裁剪 - CSDN博客](https://blog.csdn.net/github_36704374/article/details/60334156 ) ，[uwp圆形头像以及选取本地图片当作头像 - CSDN博客](https://blog.csdn.net/c1518589418/article/details/80102264#commentsedit )都使用到 Launcher 启动 `Microsoft.Windows.Photos_8wekyb3d8bbwe` 传入参数处理图，但是这里的 `Microsoft.Windows.Photos_8wekyb3d8bbwe` 是什么？

这个就是系统预装的 照片 应用，这个应用提供简单的图片处理，但是不是在所有的系统都能正确调用这个照片。

如果想要对图片做处理，还是使用 WriteableBitmap 处理图片比较好

例如做保存一个圆形头像，可以使用[UWP xaml 圆形头像 - CSDN博客]([图片]https://blog.csdn.net/lindexi_gd/article/details/49757187 ) 获得一个圆形头像控件，然后使用[win10 uwp 截图 获取屏幕显示界面保存图片]([图片]https://lindexi.gitee.io/post/win10-uwp-%E6%88%AA%E5%9B%BE-%E8%8E%B7%E5%8F%96%E5%B1%8F%E5%B9%95%E6%98%BE%E7%A4%BA%E7%95%8C%E9%9D%A2%E4%BF%9D%E5%AD%98%E5%9B%BE%E7%89%87.html )拿到控件图片

其他调用 `Microsoft.Windows.Photos_8wekyb3d8bbwe` 裁剪图片请看 [CropImage](https://gist.github.com/FrayxRulez/c2f1bbfa996ad5751b87 )


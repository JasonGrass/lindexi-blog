---
title: "win10 uwp 在 VisualStudio 部署失败，找不到 Windows Phone 可能的原因"
pubDatetime: 2019-03-01 01:23:04
modDatetime: 2024-05-20 08:22:05
slug: win10-uwp-在-VisualStudio-部署失败，找不到-Windows-Phone-可能的原因
description: "win10 uwp 在 VisualStudio 部署失败，找不到 Windows Phone 可能的原因"
tags:
  - VisualStudio
  - Win10
  - UWP
---




在我使用 VisualStudio 调试的时候，发现我插入了手机，但是 VisualStudio 在部署的时候找不到手机。
可能的原因是 手机禁用了连接，第二个原因是可能手机驱动没正确让 VisualStudio 找到手机

<!--more-->


<!-- CreateTime:2019/3/1 9:23:04 -->


要在 VisualStudio 调试自己的设备，需要自己的手机开启开发者模式，第二手机是自己的。

如果不是自己的手机，怎么可以用来调试？所以最重要的还是最后条件

在使用 usb 连接进行调试的时候，使用 VisualStudio 部署需要手机没有进入锁屏，需要手机开着

## 手机更新

如果遇到这个问题，第一个时间应该看资源管理器是否存在手机的图标，如果没有存在手机图标，证明手机没有链接。

手机没有连接拔出手机数据线重新插入可能就可以。

如果发现资源管理器已经存在手机图标了，那么这时还不可以，尝试看手机是否是锁屏。如果发现都不是，看一下手机是不是正在更新，点击手机的设置，如果发现在更新，需要更新之后重启才可以使用。

## usb 驱动

最近听火火说他的手机无法部署，因为手机驱动无法使用。

解决方法是在 右击计算机->管理->设备管理器->便携设备，卸载已经链接手机

然后在 计算机->管理->设备管理器->通用串行总线设备，删除和手机连接相关的

拔下 USB 重新插入就可以了。

[UWP 部署失败，因为未检测到任何Windows Phone （ARM->Device） - syj52417的个人空间 - 开源中国](https://my.oschina.net/u/2319177/blog/668659 )


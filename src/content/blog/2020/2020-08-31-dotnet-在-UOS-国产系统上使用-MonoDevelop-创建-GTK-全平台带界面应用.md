---
title: "dotnet 在 UOS 国产系统上使用 MonoDevelop 创建 GTK 全平台带界面应用"
pubDatetime: 2020-08-31 12:10:00
modDatetime: 2024-08-06 12:43:30
slug: dotnet-在-UOS-国产系统上使用-MonoDevelop-创建-GTK-全平台带界面应用
description: "dotnet 在 UOS 国产系统上使用 MonoDevelop 创建 GTK 全平台带界面应用"
tags:
  - dotnet
---




本文告诉大家如何在 UOS 国产系统上开始使用 MonoDevelop 开发，通过创建 GTK# 应用，进入界面开发的第一步

<!--more-->


<!-- CreateTime:2020/8/31 20:10:00 -->



在开始之前需要小伙伴先安装好 MonoDevelop 工具

安装完成之后，可以在开始菜单找到这个 MonoDevelop 工具

<!-- ![](images/img-dotnet 在 UOS 国产系统上安装 MonoDevelop 开发工具0.png) -->

![](images/img-modify-2c8cabc94fd91fb7f573c6e727b8381a.jpg)

打开之后，点击新建项目

<!-- ![](images/img-dotnet 在 UOS 国产系统上使用 MonoDevelop 创建 GTK 全平台带界面应用0.png) -->

![](images/img-modify-c765a77b7e965f7359b1d40386b8c526.jpg)

选择新建 GTK# 2.0 的项目，点击下一步，选择路径，加上项目名

请小伙伴记录这个路径，因为 UOS 的资源管理器做的比较弱，需要咱自己通过控制台去找到这个路径

其实MonoDevelop就是基于 GTK# 作为底层渲染的，因此能做到啥小伙伴大家看这个 IDE 也就有底了，有趣的是这个工具也是完全开源的

<!-- ![](images/img-dotnet 在 UOS 国产系统上使用 MonoDevelop 创建 GTK 全平台带界面应用1.png) -->

![](images/img-modify-7629f9aa4a55931185ae09d19817ef2a.jpg)

新建的项目默认啥都没有，可以按下 F5 开始执行

此时就完成了构建逻辑了

可以在命令行里面通过 `mono xx.exe` 执行构建出来的工具，当前只有一个空白窗口啥都没有，但是这是一个好的开始


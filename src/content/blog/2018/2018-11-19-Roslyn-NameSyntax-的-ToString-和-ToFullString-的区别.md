---
title: "Roslyn NameSyntax 的 ToString 和 ToFullString 的区别"
pubDatetime: 2018-11-19 07:22:23
modDatetime: 2024-08-06 12:43:33
slug: Roslyn-NameSyntax-的-ToString-和-ToFullString-的区别
description: "Roslyn NameSyntax 的 ToString 和 ToFullString 的区别"
tags:
  - Roslyn
  - MSBuild
  - 编译器
---




本文告诉大家经常使用的 NameSyntax 拿到值的 ToString 和 ToFullString 方法的区别

<!--more-->


<!-- CreateTime:2018/11/19 15:22:23 -->

<!-- 标签：Roslyn,MSBuild,编译器 -->

从代码可以看到 NameSyntax 的 ToString 和 ToFullString 方法是调用 Green 的 ToString 和 ToFullString ，所以具体还需要进入 Green 看是如何写

![](images/img-modify-c3fb61d042d629d8a75841774db46466.jpg)

<!-- ![](images/img-Roslyn NameSyntax 的 ToString 和 ToFullString 的区别0.png) -->

这里 NameSyntax 的 Green 是 GreenNode ，从 代码可以看到两个方法的区别

![](images/img-modify-bafb8051825e7059ec915b9047f4fee7.jpg)

<!-- ![](images/img-Roslyn NameSyntax 的 ToString 和 ToFullString 的区别1.png) -->

使用 ToFullString 会添加前后的空白代码，使用 ToString 的就会去掉前后空白代码，如获取 `using lindexi.wpf.Framework` 的代码，使用两个不同的函数可以获得不同的值

![](images/img-modify-c4dc8b129c31f28cb7650c85b2a0a905.jpg)

<!-- ![](images/img-Roslyn NameSyntax 的 ToString 和 ToFullString 的区别2.png) -->

![](images/img-modify-e0e7bd177ecbf130cdabe0e1679a27e0.jpg)

<!-- ![](images/img-Roslyn NameSyntax 的 ToString 和 ToFullString 的区别3.png) -->

除了空白，使用 ToFullString 可以拿到换行，如获得类的基类，使用 `TypeSyntax` 拿到的可能包含换行。

如类型 `class lindexi : doubi` ，使用两个不同的函数可以看到不同的变量

![](images/img-modify-7ffeacecae72b62687983984d918cebd.jpg)

<!-- ![](images/img-Roslyn NameSyntax 的 ToString 和 ToFullString 的区别4.png) -->

![](images/img-modify-08f079518857e8fb99e4afc0522f165e.jpg)

<!-- ![](images/img-Roslyn NameSyntax 的 ToString 和 ToFullString 的区别5.png) -->

所以 ToFullString 拿到的变量使用 Trim 就是 ToString 拿到的变量

如果好奇本文开始说的  Green 是什么，请看 [理解 Roslyn 中的红绿树（Red-Green Trees） - walterlv](https://walterlv.github.io/post/the-red-green-tree-of-roslyn.html )


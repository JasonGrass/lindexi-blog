---
title: "WPF DelegateCommand 出现Specified cast is not valid"
pubDatetime: 2018-02-13 09:23:03
modDatetime: 2024-05-20 08:22:03
slug: WPF-DelegateCommand-出现Specified-cast-is-not-valid
description: "WPF DelegateCommand 出现Specified cast is not valid"
tags:
  - WPF
---




使用 DelegateCommand 出现 Specified cast is not valid

<!--more-->


<!-- CreateTime:2018/2/13 17:23:03 -->


最近写快捷键需要 DelegateCommand ，于是用了 `DelegateCommand<double> ` ，运行时出现 Specified cast is not valid 

原因是 DelegateCommand 传入的 Object 是可空的，如果使用 Double ，那么是不可空的，就出现错误

简单的方法是用 double?

于是就可以啦

如果遇到 DelegateCommand 出现这个错误，一般就是使用不可空的类型，只要让他可空就好。


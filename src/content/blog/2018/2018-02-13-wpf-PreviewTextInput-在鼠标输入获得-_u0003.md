---
title: "wpf PreviewTextInput 在鼠标输入获得 \u0003"
pubDatetime: 2018-02-13 09:23:03
modDatetime: 2024-05-20 08:22:06
slug: wpf-PreviewTextInput-在鼠标输入获得-_u0003
description: "wpf PreviewTextInput 在鼠标输入获得 \u0003"
tags:
  - WPF
---




我的小伙伴在写一个功能，需要获得输入的时候，判断是键盘输入或鼠标输入，通过 PreviewTextInput 获得键盘输入就做一些输出。
但是他发现，在使用鼠标书写的时候，获得 PreviewTextInput ，而且值是 \u0003 ，他换了一个电脑就好了。

<!--more-->


<!-- CreateTime:2018/2/13 17:23:03 -->


<!-- csdn -->

在[头像](https://huangtengxiao.gitee.io/)大神的研究下，发现有道词典会拿到输入框的事件，在鼠标指向的词进行翻译。所以他就给TextBox 发送了`\u0003`。

解决方法是去掉 `\u0003` 或者关闭有道词典。

如果你发现这个问题，那么尝试关闭有道词典和其他的软件，如果已经解决，就是他们的坑。但是从我国的法律规定，是不可以在软件把其他软件干掉。

所以网易太厉害了，现在也没有什么方法。或者检测到有道词典就告诉用户，因为技术有限，不能在开启有道词典使用软件。

在这之前需要说的，因为我的这个鼠标被windows识别为键盘，于是就找了很久，都在想如何判断一个键盘是什么设备，所以，如果发现自己的软件出现意外的输入，那么先关闭有道。

参见：[意外的键盘输入 ](https://huangtengxiao.gitee.io/post/%E7%A8%8B%E5%BA%8F%E5%91%98%E7%9A%84%E4%B8%96%E7%95%8C%E7%9C%9F%E5%A5%87%E5%A6%99.html )


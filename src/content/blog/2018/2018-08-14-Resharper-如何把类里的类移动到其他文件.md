---
title: "Resharper 如何把类里的类移动到其他文件"
pubDatetime: 2018-08-14 09:34:39
modDatetime: 2024-08-06 12:43:33
slug: Resharper-如何把类里的类移动到其他文件
description: "Resharper 如何把类里的类移动到其他文件"
tags:
  - Resharper
---




有时候，看到一个类里有很多类，需要把他移动其他文件

<!--more-->


<!-- CreateTime:2018/8/14 17:34:39 -->


<div id="toc"></div>

<!-- 标签：Resharper -->

假如有一个类


```csharp
    class A
    {
        class B
        {

        }
       
    }
```

如何把 B 移动文件 B里？

一般使用 快捷键是 Resharper 的快捷键，如果不是的话，打开设置选择快捷键是 Resharper

然后选择 B ，按 ctrl+shift+R

![](images/img-modify-7d1e5ba7a9e79b9ebc0f12a65166aec5.jpg)

移动到其他文件，第一个

这样输入文件名称就可以移动类到其他文件

这个快捷键可以把类移到其他命名空间，安全删除，提取属性做接口

如果需要Resharper多行注释，请用`ctrl+shift+/`


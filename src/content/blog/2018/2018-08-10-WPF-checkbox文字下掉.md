---
title: "WPF checkbox文字下掉"
pubDatetime: 2018-08-10 11:16:53
modDatetime: 2024-08-06 12:43:39
slug: WPF-checkbox文字下掉
description: "WPF checkbox文字下掉"
tags:
  - WPF
---





<!--more-->


<!-- CreateTime:2018/8/10 19:16:53 -->


<div id="toc"></div>

![](images/img-2af64c0d-f144-4f44-985d-3e155a8209532016121185647.jpg)

可以使用

```xml
<Style TargetType="CheckBox">
            <Setter Property="Margin" Value="10,10,10,10"></Setter>
            <Setter Property="VerticalAlignment" Value="Center" />
            <Setter Property="FontSize" Value="10" />
        </Style>
        <Style TargetType="{x:Type TextBlock}">
            <Setter Property="Margin" Value="1,1,1,1" />
        </Style>
                <CheckBox Grid.Row="0" Grid.Column="1"  >
                    <TextBlock Text="内容" />
                </CheckBox>
```

https://dotblogs.com.tw/v6610688/2014/04/21/xaml_checkbox_content_alignment&prev=searc

博客blog.csdn.net/lindexi_gd



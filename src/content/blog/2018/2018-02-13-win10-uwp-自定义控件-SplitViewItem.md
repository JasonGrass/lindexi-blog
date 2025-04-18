---
title: "win10 uwp 自定义控件 SplitViewItem"
pubDatetime: 2018-02-13 09:23:03
modDatetime: 2024-05-20 08:22:06
slug: win10-uwp-自定义控件-SplitViewItem
description: "win10 uwp 自定义控件 SplitViewItem"
tags:
  - Win10
  - UWP
---




本文主要是因为汉堡菜单里面列出的菜单很多重复的图标和文字，我把它作为控件，因为是随便写，可能存在错误，如果发现了，请和我说或关掉浏览器，请不要发不良言论。

<!--more-->


<!-- CreateTime:2018/2/13 17:23:03 -->


<div id="toc"></div>

我们使用汉堡菜单，经常需要一个
![这里写图片描述](http://img.blog.csdn.net/20160624111821645)
需要一个图标和一个文字

我开始写一个TextBlock做图标，一个写文字

```xml
                            <ListViewItem.Content>
                                <StackPanel Orientation="Horizontal">
                                    <TextBlock Margin="10,10,10,10" FontFamily="Segoe MDL2 Assets"
                                         Text="&#xE77B;"></TextBlock>
                                    <TextBlock Margin="10,10,10,10" Text="登录"></TextBlock>
                                </StackPanel>
                            </ListViewItem.Content>
```

因为需要写3个地方是不一样，一个是文字、一个图标还有一次复制，我觉得复制不好，因为我还有很多软件，如果每个都这样，那么在TextBlock使用
![这里写图片描述](http://img.blog.csdn.net/20160624112019381)
很多都是一样的

一个方法是自己创建控件，我们右击View文件夹添加控件

在控件写两个TextBlock，一个做图标，一个写文字

```xml
    <Grid>
        <StackPanel Orientation="Horizontal">
            <TextBlock Margin="10,10,10,10" FontFamily="Segoe MDL2 Assets"
                       Text="{x:Bind IconString}"></TextBlock>
            <TextBlock Margin="10,10,10,10" Text="{x:Bind Text}"></TextBlock>
        </StackPanel>
    </Grid>
```

然后在`SplitViewItem.xaml.cs`

属性IconString，Text

```csharp
        public static readonly DependencyProperty IconStringProperty = DependencyProperty.Register(
            "IconString", typeof(string), typeof(SplitViewItem), new PropertyMetadata(default(string)));

        public string IconString
        {
            set
            {
                SetValue(IconStringProperty, value);
            }
            get
            {
                return (string) GetValue(IconStringProperty);
            }
        }

        public static readonly DependencyProperty TextProperty = DependencyProperty.Register(
            "Text", typeof(string), typeof(SplitViewItem), new PropertyMetadata(default(string)));

        public string Text
        {
            set
            {
                SetValue(TextProperty, value);
            }
            get
            {
                return (string) GetValue(TextProperty);
            }
        }
```

我把SplitViewItem扔View文件夹，在命名空间使用`EncryptionSyncFolder.View`

`    xmlns:view="using:EncryptionSyncFolder.View"`

本来需要很长的代码，现在修改成为一点点，其实就是导入我的自定义控件，首先在上面的代码是把view用作我的控件所在文件夹，反人类的Segoe MDL2 Assets 可以在http://modernicons.io/segoe-mdl2/cheatsheet/，找到你要的图标

```xml
                        <ListViewItem>
                            <ListViewItem.Content>
                               <Grid>
                                    <view:SplitViewItem IconString="&#xE713;" Text="设置"></view:SplitViewItem>
                               </Grid>
                            </ListViewItem.Content>
                        </ListViewItem>
```

## SplitView 从右划出

修改PanelPlacement。

多谢[Script](http://i.hexun.com/bzlbsd/default.html)



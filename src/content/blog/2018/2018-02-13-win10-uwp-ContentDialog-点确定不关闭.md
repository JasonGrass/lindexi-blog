---
title: "win10 uwp ContentDialog 点确定不关闭"
pubDatetime: 2018-02-13 09:23:03
modDatetime: 2024-05-20 08:22:06
slug: win10-uwp-ContentDialog-点确定不关闭
description: "win10 uwp ContentDialog 点确定不关闭"
tags:
  - Win10
  - UWP
---




微软的ContentDialog不是一直有，而是UWP新的，可以使用Content放用户控件，使用很好，但是一点不好的是，默认的一点击下面按钮就会退出。

<!--more-->


<!-- CreateTime:2018/2/13 17:23:03 -->


<div id="toc"></div>

我们有时候需要ContentDialog用户输入，而用户没有输入我们想要的，给用户提示，不退出

那么要解决ContentDialog自动退出有两个方法：

第一个很简单，第二个更简单

简单的方法，做一个类继承ContentDialog，然后加一个属性

```csharp
        /// <summary>
        /// 对话完成，如果没有完成会继续显示
        /// </summary>
        public bool Complete
        {
            set;
            get;
        }
```

在Closing判断他是不是为false，如果是，那么取消，取消在e那里

这个简单，就不放代码。

第二个方法，为什么我们要使用自带的按钮？其实可以在我们的控件自己写按钮

那么有新的问题，自己写按钮，那么怎么退出，其实我们可以使用ContentDialog的Hide()方法，这个方法可以让ContentDialog退出，是默认关闭。


我做到这发现，自己做的控件按钮实在有点麻烦，不如用一个简单的方法，我们在我们控件加个属性

```csharp
        /// <summary>
        /// 对话完成，如果没有完成会继续显示
        /// </summary>
        public bool Complete
        {
            set;
            get;
        }
```

当然在PrimaryButtonClick，如果输入和我们要的一样，`Complete = true;` SecondaryButtonClick就不需要判断`Complete = true;`

在最后

```csharp
            while (!控件.Complete)
            {
                await contentDialog.ShowAsync();
            }
```








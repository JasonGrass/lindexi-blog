---
title: "Unity3D 2019 设置的 Playmode tint 有何作用"
pubDatetime: 2020-06-16 00:25:22
modDatetime: 2024-05-20 08:22:03
slug: Unity3D-2019-设置的-Playmode-tint-有何作用
description: "Unity3D 2019 设置的 Playmode tint 有何作用"
---




在 Unity3D 编辑器点击运行的时候，此时对整个面板修改的值仅在本次运行生效，当运行结束之后就会回到原来的值。因此为了避免调了半天实际上是在运行模式调的值，咱可以修改 Unity3D 编辑器的界面，让咱可以知道当前是 Unity3D 运行模式

<!--more-->


<!-- CreateTime:6/16/2020 8:25:22 AM -->



点击 Edit 的 Preferences 然后进入 Colors 界面

此时可以看到 General 的 PlayMode tine 选项

这个选项可以选择一个颜色，这个颜色指的是 Unity3D 在运行模式时编辑器显示的主题颜色

修改这个颜色，然后关闭 Perferences 窗口，回到 Unity3D 编辑器，尝试点击运行

此时就可以看到编辑器的颜色都更改了，这样就比较方便解决了没有意识到当前 Unity3d 进入了运行模式

如果调残了怎么办？在 Perferences 的最下方有个 Use Defaults 按钮，点击这个按钮就会还原为默认的配色

有了这个还原功能，小伙伴就能随意的修改颜色


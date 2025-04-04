---
title: "Unity3D OpenVR SteamVR 点击菜单切换场景"
pubDatetime: 2021-05-31 00:47:48
modDatetime: 2024-08-06 12:43:34
slug: Unity3D-OpenVR-SteamVR-点击菜单切换场景
description: "Unity3D OpenVR SteamVR 点击菜单切换场景"
---




本文来告诉大家如何在基于 SteamVR 的 Unity3D 里面在用户点击菜单的时候，切换到新的场景的方法

<!--more-->


<!-- CreateTime:2021/5/31 8:47:48 -->

<!-- 发布 -->

在开始之前，期望大家已阅读过基于 SteamVR 的 Unity3D 相关博客，如果还没了解相关知识，请参阅如下博客

- [Unity OpenVR 虚拟现实入门一：安装配置 Unity + OpenVR 环境](https://blog.walterlv.com/post/unity-openvr-starting-1.html)
- [Unity OpenVR 虚拟现实入门二：一个最简单的虚拟现实游戏/程序](https://blog.walterlv.com/post/unity-openvr-starting-2.html)
- [Unity OpenVR 虚拟现实入门三：最简单的五指交互](https://blog.walterlv.com/post/unity-openvr-starting-3.html)
- [Unity OpenVR 虚拟现实入门四：通过脚本控制手与控制器](https://blog.walterlv.com/post/unity-openvr-starting-4.html)
- [Unity OpenVR 虚拟现实入门五：通过传送控制玩家移动](https://blog.walterlv.com/post/unity-openvr-starting-5.html)
- [Unity OpenVR 虚拟现实入门六：通过摇杆控制玩家移动](https://blog.walterlv.com/post/unity-openvr-starting-6.html)

如系列博客的内容，咱通过加入 SteamVR SDK 然后将 Player 拖入到咱的场景中，如下图

![](images/img-modify-3f683ae7b57e45a46ce269b307aef705.jpg)

如上图，为了演示如何切换场景，咱创建了两个场景，分别是 MainMenuScene 主菜单场景和 Challenge1-1 关卡1场景。下面咱将要在 MainMenuScene 主菜单点击一个叫 Chloroplast 的物体，从 MainMenuScene 切换 Challenge1-1 关卡

如上图，咱给 Chloroplast 物体绑定了 MainMenuNewGameScript 的脚本，为了实现让用户碰触到 Chloroplast 物体就跳转到新的场景功能，咱需要让脚本继承 Interactable 类，如下图代码

![](images/img-modify-37527f93792462bb420345c36c9a6dc2.jpg)

```csharp
var player = GameObject.Find("Player");
GameObject.Destroy(player);

SteamVR_LoadLevel.Begin("Challenge1-1");
```

上面代码有两个细节部分，第一个是通过 SteamVR_loadLevel 的 Begin 方法切换场景，其次是删除在 MainMenuScene 里面的 Player 对象。如果没有删除 Player 对象，那么在进入到新的场景将会发现自己的手将会两份

接下来咱还需要在游戏的生成里面，将 MainMenuScene 主菜单场景和 Challenge1-1 关卡1场景加入到生成

点击 Unity3D 的文件生成设置

![](images/img-modify-24e319771c155c91c98a23c2e6093ff0.jpg)

在打开的界面里面添加 MainMenuScene 主菜单场景和 Challenge1-1 关卡1场景，如下图

![](images/img-modify-99f8249aa6cc5b53493b63d9406448f2.jpg)

添加之后可以关闭此窗口，关闭窗口将会自动保存

接下来还需要在 Challenge1-1 关卡1场景里面，将 SteamVR 里面的 Player 加入，否则进入到 Challenge1-1 关卡1场景将会啥都看不见

![](images/img-modify-a92795fad19f6cd4d06dcedc6a04d41f.jpg)

另外，如果在实现切换场景，发现切换到新的场景时，界面是黑色，啥都看不见，那么请确定你在 场景 里面是否加入了 Player 游戏对象，以及是否在生成设置里面将场景进入到生成

如果前一个场景的 Player 还没销毁，进入新的场景，而新的场景没有定义 Player 那么将会让你的测试工具人很快就晕了，原因是将会在很远处看到手，画面很像在做梦


---
title: "win10 uwp 使用 AppCenter 自动构建"
pubDatetime: 2018-11-19 07:29:34
modDatetime: 2024-08-06 12:43:36
slug: win10-uwp-使用-AppCenter-自动构建
description: "win10 uwp 使用 AppCenter 自动构建"
tags:
  - UWP
  - DevOps
  - AzureDevOps
---




微软在今年7月上线 appcenter.ms 这个网站，通过 App Center 可以自动对数千种设备进行适配测试、快速将应用发送给测试者或者直接发布到应用商店。做到开发的构建和快速测试，产品的遥测分发合并到一个网站
本文以 UWP 图床为例告诉大家如何在 AppCenter 上部署自动构建。

<!--more-->


<!-- CreateTime:2018/11/19 15:29:34 -->

<!-- 标签：uwp,DevOps,AzureDevOps -->

首先打开 [https://appcenter.ms/](https://appcenter.ms/) 使用微软的账号或 github 账号登陆

<!-- ![](images/img-win10 uwp 使用 AppCenter 自动构建0.png) -->

![](images/img-modify-1f6ae4f63da72a99b7d0d0c07df08dcb.png)

点击 add new 添加一个 UWP 程序，需要写出 app 的命名和选择是哪个平台

没想到这个 AppCenter 默认选的是 IOS 差评，需要自己点击一个 Windows 然后点击 UWP 才可以

<!-- ![](images/img-win10 uwp 使用 AppCenter 自动构建1.png) -->

![](images/img-modify-97bd90109514eacec57ac1613874acb2.png)

创建完成之后可以看到下面的界面

<!-- ![](images/img-win10 uwp 使用 AppCenter 自动构建2.png) -->

![](images/img-modify-33e634dcf1e37a965cbd367e293808f4.png)

点击 Build 标签，可以看到配置自动构建的界面

<!-- ![](images/img-win10 uwp 使用 AppCenter 自动构建3.png) -->

![](images/img-modify-6e07eaf19fa003db6cd931b6940a3b0e.png)

因为 UWP 图床是放在 [github](https://github.com/lindexi/uwp) 所以这里选择 github 在弹出的页面选择 UWP 项目

<!-- ![](images/img-win10 uwp 使用 AppCenter 自动构建4.png) -->

![](images/img-modify-6849485387f8da4fef529506bfbabab8.png)

点击选择之后可以看到当前的分支，这里选择 master 分支

<!-- ![](images/img-win10 uwp 使用 AppCenter 自动构建5.png) -->

![](images/img-modify-21586e3b84e6e670027cf9904a796101.png)

然后点击配置编译

<!-- ![](images/img-win10 uwp 使用 AppCenter 自动构建6.png) -->

![](images/img-modify-7c2fea17d5d2bbe122f0816e6424b510.png)

在这个网站比较好的是会将所有的 sln 文件列出来，让大家选自己需要编译的文件，同时还可以设置编译的平台

<!-- ![](images/img-win10 uwp 使用 AppCenter 自动构建7.png) -->

![](images/img-modify-c6932d44185d5d251751c6054cbe1cdb.png)

只需要设置需要编译哪个项目就可以啦，其他的东西都是自动配置的

设置完成就可以点击一下保存，尝试再次在本地推送一个提交就可以看到自动构建在进行编译了

设置这里有一个高级的选项，这个选项可以将编译成功或失败的标识放在了 github 上，这里会生成一个图片

<!-- ![](images/img-win10 uwp 使用 AppCenter 自动构建8.png) -->

![](images/img-modify-6a6b52d0771d938471da088df02b235f.png)

将内容复制出来，大概就是这样

```csharp
[![Build status](https://build.appcenter.ms/v0.1/apps/26ecccfd-d147-4189-93ea-3d765a276176/branches/master/badge)](https://appcenter.ms)
```

放在自己的项目首页可以看到这个效果

[![Build status](https://build.appcenter.ms/v0.1/apps/ac2f6c8e-9024-48be-9451-b1ca9c4949d0/branches/master/badge)](https://appcenter.ms)


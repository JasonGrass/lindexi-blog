---
title: "win10 uwp 使用 Azure DevOps 自动构建"
pubDatetime: 2018-11-19 07:26:04
modDatetime: 2024-08-06 12:43:36
slug: win10-uwp-使用-Azure-DevOps-自动构建
description: "win10 uwp 使用 Azure DevOps 自动构建"
tags:
  - UWP
  - DevOps
  - AzureDevOps
---




通过 Azure DevOps 可以做到自动构建程序，覆盖计划、创建、编程、测试、部署、发布、托管、共享等各个环节，适用于大多数的语言、平台。
本文继续使用图床为例告诉大家如何使用 Azure DevOps 自动构建

<!--more-->


<!-- CreateTime:2018/11/19 15:26:04 -->


<!-- 标签：uwp,DevOps,AzureDevOps -->

从谷歌搜 Azure DevOps 即可找到 Azure DevOps 的网站 [https://dev.azure.com](https://dev.azure.com)，这里支持使用微软的账号或 github 的账号登陆。

假设已经登陆了账号，首先点击创建一个项目

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建0.png) -->

![](images/img-modify-dbe3f9cdddbf36dbd1c9169217c9c3ad.png)

创建的时候需要等待很久，创建之后点击 Repos 导入 github 的仓库作为代码库，或者自己使用创建的项目提交代码

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建1.png) -->

![](images/img-modify-ae336b0502e28afdb0e2170118fd07ef.png)

本文是导入开源在 github 的 uwp 图床项目，点击导入

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建2.png) -->

![](images/img-modify-30a6c6f30bb2ee0c692c337e52d54fc5.png)

输入自己的仓库地址

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建3.png) -->

![](images/img-modify-54b76bdcffaeb3ed8a5283de8ae514c1.png)

点击 Pipelines 点击 Build 配置自动构建

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建4.png) -->

![](images/img-modify-0738e7c3accf7f94ca70ce0201db87aa.png)

创建新的构建

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建5.png) -->

![](images/img-modify-b0b93e6fa23a93efa17ab99dcb63750f.png)

因为刚才已经导入代码，现在就可以直接导入代码

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建6.png) -->

![](images/img-modify-b02213e3037a67124450c4ff26feb14d.png)

直接点击下一步就可以

这时可以选择自己需要的构建方式，有预定了很多构建的方式，通过寻找 UWP 的构建点击

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建7.png) -->

![](images/img-modify-fb82da655f80f2586e1c23cc8861d0c1.png)

点击应用

然后选择需要编译哪个 sln 文件

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建9.png) -->

![](images/img-modify-84002cd5f272f8e951a9cf9ea76fc229.png)

这里选择项目之后点击保存

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建10.png) -->

![](images/img-modify-031ea300c576cdd6934f4d49652e73cf.png)

点击队列按钮就可以进行构建

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建11.png) -->

![](images/img-modify-2c11f1b53d54886c83f83eb892a56323.png)

这样就设置好了构建的方法，点击 Triggers 设置触发，可以设置有 push 上去就进行构建，也可以设置在某个时间进行构建

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建12.png) -->

![](images/img-modify-b979925e1c130c46b95b7c75f341c98d.png)

点击添加任务，可以设置在某一天的时间构建

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建13.png) -->

![](images/img-modify-c5e49f7e6739f052f1c9cc898021848e.png)

设置完成点击保存就可以

如果需要构建 WPF 程序，实际上和上面的步骤很多都是相同，只是在选择构建的预定义方法的时候选择的是桌面

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建8.png) -->

![](images/img-modify-6944d40ff478913a28c02fc166c8824e.png)

选择需要编译的项目，如果有单元测试项目就设置单元测试项目

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建14.png) -->

![](images/img-modify-22eccdeedfb9d7a5e5a593f51bec390c.png)

如果没有单元测试项目就点击移除单元测试项目

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建15.png) -->

![](images/img-modify-9c1d14630329786ffa3cce564145455b.png)

设置完成之后点击保存

设置自动构建的方法和 UWP 的方法相同

手动构建的方法是点击 Queue 加入构建

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建16.png) -->

![](images/img-modify-0f196fa11d45a71fd07a338febd34fb2.png)

直接点击队列按钮就可以

可以看到点击的任务加入构建

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建17.png) -->

![](images/img-modify-ef60d3a5bec19a90141c990e37be9dcc.png)

再次点击 Build 就可以看到当前的构建

<!-- ![](images/img-win10 uwp 使用 Azure DevOps 自动构建18.png) -->

![](images/img-modify-dcd0d78c2ff2070c825f8c0e0cc36648.png)

点击 Option 可以将构建是否成功的图标复制出来

```csharp
[![Build status](https://dev.azure.com/lindexigd/BitStamp/_apis/build/status/BitStamp-Universal%20Windows%20Platform-CI)](https://dev.azure.com/lindexigd/BitStamp/_build/latest?definitionId=3)
```

放在自己的项目首页就可以看到下面的效果

[![Build status](https://dev.azure.com/lindexigd/PandocMarkdown2Docx/_apis/build/status/PandocMarkdown2Docx-.NET%20Desktop-CI)](https://dev.azure.com/lindexigd/PandocMarkdown2Docx/_build/latest?definitionId=4)

通过这个方式可以做到自动的构建项目

通过这个网站可以做到发布管理任务，自动构建开发，代码审查，提交测试申请，自动发布，一个网站可以做到整个软件的开发管理


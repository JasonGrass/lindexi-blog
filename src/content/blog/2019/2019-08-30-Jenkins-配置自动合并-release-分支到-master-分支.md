---
title: "Jenkins 配置自动合并 release 分支到 master 分支"
pubDatetime: 2019-08-30 00:54:58
modDatetime: 2024-08-06 12:43:32
slug: Jenkins-配置自动合并-release-分支到-master-分支
description: "Jenkins 配置自动合并 release 分支到 master 分支"
tags:
  - Jenkins
---




本文告诉大家如何在 Jenkins 配置合并到 release 的内容自动合并到 gitlab 的 master 分支

<!--more-->


<!-- CreateTime:2019/8/30 8:54:58 -->

<!-- 标签：Jenkins -->

首先需要两个仓库，一个是 gitlab 的仓库，另一个是 Jenkins 的仓库

先在 Jenkins 仓库做配置，首先设置 Source Code Management 选择自己需要的仓库和设置好的账号

<!-- ![](images/img-Jenkins 配置自动合并 release 分支到 master 分支0.png) -->

![](images/img-modify-29ca98522f6767dfdf716b9a115bee61.png)

然后在 Branches to build 添加分支，这里需要将 release 合 master 所以就填写 release 就可以

<!-- ![](images/img-Jenkins 配置自动合并 release 分支到 master 分支1.png) -->

![](images/img-modify-6f53a95f4c16f5e26db65b1832041a67.png)

在 Additional Behaviours 添加三个值，一个是 Clean before checkout 这样可以清空仓库，第二个是 Prune stale remote-tracking branches 让本地和远程同步。

注意，第二个 Prune stale remote-tracking branches 很重要，如果有小伙伴上传了这样两个分支

```csharp
t/lindexi
t/lindexi/github
```

那么即使小伙伴在上传第一个分支之后，删除了第一个分支再上传第二个分支，可能 Jenkins 也无法加载

第三个就是 Merge before build 请看图片，设置仓库是哪个，设置推送的分支

<!-- ![](images/img-Jenkins 配置自动合并 release 分支到 master 分支2.png) -->

![](images/img-modify-311575e7cb6d52216b657638250a4266.png)

为了在用户推送的时候合并，就需要在 Build Triggers 添加 Build when a change is pushed to GitLab. 这样就可以添加 web hook 在打钩之后可以看到下面有一个链接，如下面是我的链接，这个链接会在之后设置到 gitlab 所以暂时需要记下

https://newci.gz.lindexi.cn/project/lindexi/github_merge_release_to_dev

这里可以通过很多个设置，在 `Push Events` 执行这个仓库或者在 `Accepted Merge Request Events` 执行，可以全部打钩

<!-- ![](images/img-Jenkins 配置自动合并 release 分支到 master 分支3.png) -->

![](images/img-modify-b5c27e5a1996d0c6a4e2d9631a04e9c4.png)

下面就是 Build 这里可以写编译的内容，我下面执行了一些代码

<!-- ![](images/img-Jenkins 配置自动合并 release 分支到 master 分支4.png) -->

![](images/img-modify-f0c62ca559f52239d56ffe90d67abdc3.png)

只有在编译成功我才可以让 release 合并到 master 分支，如果编译不成功就不能合并

在 Post-build Actions 添加 Git Publisher 功能，第一个是 Push Only If Build Succeeds 也就是在上面的 Build 编译成功之后才会执行

点击 Add Branch 添加一个新的合并分支，需要从 release 合并到 master 就可以和我下面一样写，如果是从 release 合并到 dev 分支就自己在下面写 dev 就可以

<!-- ![](images/img-Jenkins 配置自动合并 release 分支到 master 分支5.png)  -->

![](images/img-modify-de0aa8869fe4073c70b3b3da33725884.png)

点击保存就设置完成，下面就是设置 gitlab 让 gitlab 可以支持 Jenkins 推送

点击设置成员，添加 Jenkins 成员

<!-- ![](images/img-Jenkins 配置自动合并 release 分支到 master 分支6.png) -->

![](images/img-modify-9a2ba6cb1e6fb5c4ecf92857553094ea.png)

点击 Integrations 添加 webhook 这里需要填写刚才 Jenkins 的链接，我的链接是 https://newci.gz.lindexi.cn/project/lindexi/github_merge_release_to_dev 大家可不要没事就来攻击我的服务器

填写之后需要勾选 Push events 这样有人上传就可以自动合并 release 到 master 而不需要自己手动合并

<!-- ![](images/img-Jenkins 配置自动合并 release 分支到 master 分支7.png) -->

![](images/img-modify-bca2abc1a9a9bcc3ee7cdfa047ee1c5a.png)

在添加之后可以看到有 Test 按钮，点击可以模拟一个 push 的测试

<!-- ![](images/img-Jenkins 配置自动合并 release 分支到 master 分支8.png) -->

![](images/img-modify-6a39f3f877e64225a51a50792c65039e.png)

点击测试看 Jenkins 是否自动执行，如果有就是设置成功

可能因为合并的 master 分支没有推送，需要点击 repository 设置 Protected Branches 允许 maintainers 推送，设置 Jenkins 的账号是 maintainers 这样就可以推送

可能这时会发现没有 `GitLab: This deploy key does not have write access to this project` 可以在 repository 设置 Deploy Keys 请看下面

<!-- ![](images/img-Jenkins 配置自动合并 release 分支到 master 分支9.png) -->

![](images/img-modify-8d5704083151080383a700bb135b0ffb.png)

具体设置请看 [Using GIT deploy key in Jenkins](https://blogs.perficient.com/2014/03/26/using-git-deploy-key-in-jenkins-written-by-tom-tang/ )

[使用jenkins+gitlab进行CI - haungtengxiao](https://huangtengxiao.gitee.io/post/%E4%BD%BF%E7%94%A8jenkins+gitlab%E8%BF%9B%E8%A1%8CCI.html )

![](images/img-5b9a46e200df2.jpg)


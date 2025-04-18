---
title: "VisualStudio 编码规范工具 2.6 修改当前文件编码"
pubDatetime: 2019-04-06 07:31:53
modDatetime: 2024-08-06 12:43:35
slug: VisualStudio-编码规范工具-2.6-修改当前文件编码
description: "VisualStudio 编码规范工具 2.6 修改当前文件编码"
tags:
  - VisualStudio
---




我的 VisualStudio 插件工具支持修改文件编码，在开发的时候会遇到有逗比小伙伴上传文件使用的是 GBK 编码，他在代码里面使用字符串作为界面显示，于是在用户看到就是乱码
在 VisualStudio 2015 可以另存文件指定编码，而在 VisualStudio 2019 的时候就需要借助外部工具才能转换文件编码

<!--more-->


<!-- CreateTime:2019/4/6 15:31:53 -->

<!-- csdn -->

## 编码检测和修改工具

### 插件使用

请到[VisualStudio 插件商店](https://marketplace.visualstudio.com/items?itemName=lindexigd.vs-extension-18109) 下载最新版本的[编码检测和修改工具](https://marketplace.visualstudio.com/items?itemName=lindexigd.vs-extension-18109) 或通过 VisualStudio 的插件安装

![](images/img-modify-a414ce72c46aae50dcc146a03f94a319.png)

<!-- ![](images/img-VisualStudio 编码规范工具 2.6 修改当前文件编码0.png) -->

双击下载的插件进行安装，安装完成之后，如果是 VisualStudio 2017 可以在菜单栏看到菜单

![](images/img-modify-92009abe7d1312ccdb6c3193f73d3e78.png)

如果是 VisualStudio 2019 需要在二级菜单才能看到菜单

<!-- ![](images/img-VisualStudio 编码规范工具 2.6 修改当前文件编码4.png) -->

![](images/img-modify-80c857381202e021956b8475a4ac7de2.png)

### 修改当前文件编码

在 2.6 版本新添加的功能是修改当前打开的文件的编码，即使这个文件不在当前的项目里面

因为现在没有一个方法可以知道一个文件是什么编码，所以可以在插件自己手动选当前文件的编码，这样可以解决识别编码错误

选择当前的文件的编码，和需要转换的文件的编码，然后点击 Convert 就可以转换了

<!-- ![](images/img-VisualStudio 编码规范工具 2.6 修改当前文件编码5.png) -->

![](images/img-modify-664e2eb657a59700fd7b22f4bc9127e5.png)

现在能支持的转换的编码是带符号的 Utf-8 和 GBK 编码

### 设置

点击菜单 EncodingNormailzer ，选择 Setting 可以看到下面界面

<!-- ![](images/img-VisualStudio 编码规范工具 2.6 修改当前文件编码1.png) -->

![](images/img-modify-31e8ad41fda8c83487051f22d5fd0d38.png)

首先是可以忽略一些文件或文件夹，默认是忽略一些不是文本的文件和 bin、obj、git文件夹，注意，千万不要去转换 git 文件夹的代码。

然后我们可以设置编码，现在做的是 Utf8 、GBK、Unicode的编码，如果检测工程存在文件的编码和我们设置的不一样，就会提示去转换。

因为 Ascii 的文件，存放为 GBK 和 UTF8不带签名是无法区分的，所以忽略 ASCII 编码文件。

因为对 Unicode-16 的文件是无法使用判断存在 '\0' 来区分文件是不是文本，所以，对于某些文件还是自己手动添加是否一定检测，对于没有被添加到一定需要检测的文件，先判断他是不是文本，如果是的话，就检测。

设置保存在 `我的文档\EncodingNormalizer\Account.json` 文件

### 检查编码

然后在打开完工程，注意要加载完成才使用。

点击 Conform solution encoding ，自动检测方案所有工程的文件编码，如果发现所有的编码都符合规范，那么弹出窗口说所有文件都符合规范。如果有文件不符合规范，那么提示用户是否转换。

<!-- ![](images/img-VisualStudio 编码规范工具 2.6 修改当前文件编码2.png) -->

![](images/img-modify-db5a972be3edb69916806e7e768aac37.png)

找到所有不符合规范的文件，可以一键点击转换

![](images/img-modify-015855b003114593dbffbed6200ec53c.png)

<!-- ![](images/img-VisualStudio 编码规范工具 2.6 修改当前文件编码3.png) -->

## 一起开发

欢迎在 [github](https://github.com/dotnet-campus/EncodingNormalior) 一起开发这个工具

有任何建议和吐槽欢迎在 github 评论


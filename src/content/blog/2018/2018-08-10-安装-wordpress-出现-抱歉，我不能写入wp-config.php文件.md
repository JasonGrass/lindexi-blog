---
title: "安装 wordpress 出现 抱歉，我不能写入wp-config.php文件"
pubDatetime: 2018-08-10 11:16:51
modDatetime: 2024-08-06 12:43:44
slug: 安装-wordpress-出现-抱歉，我不能写入wp-config.php文件
description: "安装 wordpress 出现 抱歉，我不能写入wp-config.php文件"
---




本文告诉大家如何安装  wordpress ，在安装过程出现 `抱歉，我不能写入wp-config.php文件`如何解决

<!--more-->


<!-- CreateTime:2018/8/10 19:16:51 -->


## 下载 wordpress

[China 简体中文 — WordPress](https://cn.wordpress.org/ )

## 安装

在安装之前，肯定已经安装好 lnmp ，安装方法请看[搭建 WordPress 博客教程](https://www.jianshu.com/p/56750622cac9 )

打开自己的网站就可以看到安装页面。

写入自己的数据库、账号、密码

如果安装过程出现下面的图片

```csharp
抱歉，我不能写入wp-config.php文件
```

![](images/img-modify-7c6691897b079561f1437719b72cd539.jpg)

那么需要拷贝这个内容，注意在文件最后添加 `?>`

先查看一下文件，注意就在下面的文件夹里创建

```csharp
[root@host default]# ls
index.php    wp-activate.php     wp-comments-post.php  wp-cron.php        wp-load.php   wp-settings.php   xmlrpc.php
license.txt  wp-admin            wp-config-sample.php  wp-includes        wp-login.php  wp-signup.php
readme.html  wp-blog-header.php  wp-content            wp-links-opml.php  wp-mail.php   wp-trackback.php
[root@host default]#

```

创建文件 wp-config.php 然后粘贴上面复制的内容，注意添加`?>`，默认的 wordpress 的内容最后面是没有添加`?>`，我尝试直接复制，结果页面打开无法使用。创建文件的方法是使用下面代码。

```csharp
vi  wp-config.php

```

可以看到输入上面命令就是进入了传说的 Linux 最好的编辑器，这个编辑器开始是不能做输入，直到按下`i`才可以进行输入。

所以在进入之后按`i`，然后右击粘贴，因为 Linux 的 `ctrl`+`v` 不是粘贴，所以需要自己手动右击粘贴。

这个编辑器的保存不是 `ctrl`+`v`而是输入`:wq`才是保存。w就是写入，q是保存。输入之前需要按`esc`，所以保存退出就是
按`esc`然后按`:wq`退出

这样设置就完成了，只需要返回页面点现在安装。

这时可以看到一些奇怪的代码，不过直接返回安装的页面，也就是`http://你的网站/` 就可以看到这个页面

![](images/img-modify-3dbb2f5a893e7155267563318b36a09c.jpg)

写自己的账号密码就好

欢迎大家来我的博客[lindexi ](http://lindexi.ml/ )，多谢 翰斌 大神给我的域名


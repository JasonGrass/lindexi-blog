---
title: "jekyll 添加 Valine 评论"
pubDatetime: 2018-10-19 01:10:40
modDatetime: 2024-08-06 12:43:32
slug: jekyll-添加-Valine-评论
description: "jekyll 添加 Valine 评论"
tags:
  - jekyll
---




本文告诉大家如何在自己搭建的静态博客添加 Valine 评论。在这前，我基本都是使用 多说，但是多说gg啦，所以就在找一个可以替换的评论。

<!--more-->


<!-- CreateTime:2018/10/19 9:10:40 -->


本来 [Disqus ](https://disqus.com/ )是很好的，但是在国内很难打开，所以我就需要一个可以在国内打开的静态评论。我找到了网易云评论，但是他需要自己的域名，所以我就不要他了。最后找到了 Valine ，感觉还不错。

首先打开自己的博客页面，如果你用的是 [我的主题](https://lindexi.oschina.io/lindexi/post/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8%E6%9C%AC%E6%A8%A1%E6%9D%BF%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2.html )搭建的博客，那么就可以按照我说的来做，如果使用的是自己的主题，那么需要把代码放到自己主题的地方。

我的博客页面是 `post.html`文件，但是我把评论写在 `include\comment.html` 文件，所以打开`comment.html`文件添加下面代码

```csharp
   <script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
    <script src='//unpkg.com/valine/dist/Valine.min.js'></script>
    <div id="comment"></div>
```

然后打开[LeanCloud](https://leancloud.cn/ )注册获得appid

注册之后创建应用

![](images/img-modify-f5f271e0f4dea2da0af6e13e91c5ee32.jpg)

点击设置

![](images/img-modify-3757da3e082a983ddd38090d8352092c.jpg)

点击key可以看到自己的 appid

![](images/img-modify-7e9daaeeb2f8bf39e608c0220c546162.jpg)

然后复制自己的App ID、App Key，下面我代码的App ID、App Key就用自己的替换

```csharp
<script>
    var valine = new Valine();
    valine.init({
        el:'#comment',
        appId:'App ID',
        appKey:'App Key',
        notify:true,
        path: '{{ page.url }}',
        placeholder:'在这里写评论——林德熙'
    })
</script>
```

现在就可以试试自己的博客是否开了评论

![](images/img-modify-039cdb9d5996e666042a5e7d9e7bcdbc.jpg)


[Valine -- 一款极简的评论系统 ](https://ioliu.cn/2017/add-valine-comments-to-your-blog/ )


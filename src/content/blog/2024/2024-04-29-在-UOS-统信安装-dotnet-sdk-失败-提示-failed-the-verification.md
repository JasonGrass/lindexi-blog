---
title: "在 UOS 统信安装 dotnet sdk 失败 提示 failed the verification"
pubDatetime: 2024-04-28 23:20:03
modDatetime: 2024-08-06 12:43:44
slug: 在-UOS-统信安装-dotnet-sdk-失败-提示-failed-the-verification
description: "在 UOS 统信安装 dotnet sdk 失败 提示 failed the verification"
tags:
  - dotnet
---




在 UOS 统信安装 dotnet sdk 失败 提示 You cannot install '/home/lindexi/packages-microsoft-prod.deb' that failed the verification, please go to Security Center - Security Tools - Application Security to adjust

<!--more-->


<!-- CreateTime:2024/04/29 07:20:03 -->

<!-- 发布 -->
<!-- 博客 -->

这是群里的伙伴报告的问题，从错误提示看需要在安全工具里面配置允许任意应用安装。这是因为安装的 packages-microsoft-prod.deb 没有带 UOS 的签名，开启配置允许任意应用安装的方法如下

先开启开发者模式

<!-- ![](images/img-在 UOS 统信安装 dotnet sdk 失败 提示 failed the verification0-modify-937390d8c597445b1571a9a4701cab37.png) -->
![](images/img-modify-a15bb1730ff5df5d59fbd6319ccb8983.jpg)

再点击 “如需安装和运行未签名应用，前往安全中心进行设置” 里面的“安全中心”超链接，即可进入下面界面

<!-- ![](images/img-在 UOS 统信安装 dotnet sdk 失败 提示 failed the verification1-modify-00f99943d43ed3af3ed67533cb02fd31.png) -->
![](images/img-modify-47919b28eb3185a23fdf54f63a4bd58b.jpg)

点击切换到允许任意应用即可

相关的可能错误是 ca-certificates 导致的问题，解决方法请参阅  [修复 Debian 安装 dotnet 失败 depends on ca-certificates](https://blog.lindexi.com/post/%E4%BF%AE%E5%A4%8D-Debian-%E5%AE%89%E8%A3%85-dotnet-%E5%A4%B1%E8%B4%A5-depends-on-ca-certificates.html )

如提示 没有通过系统安全验证无法运行，请参阅 [在 UOS 统信运行 dotnet 程序提示没有通过系统安全验证无法运行](https://blog.lindexi.com/post/%E5%9C%A8-UOS-%E7%BB%9F%E4%BF%A1%E8%BF%90%E8%A1%8C-dotnet-%E7%A8%8B%E5%BA%8F%E6%8F%90%E7%A4%BA%E6%B2%A1%E6%9C%89%E9%80%9A%E8%BF%87%E7%B3%BB%E7%BB%9F%E5%AE%89%E5%85%A8%E9%AA%8C%E8%AF%81%E6%97%A0%E6%B3%95%E8%BF%90%E8%A1%8C.html )

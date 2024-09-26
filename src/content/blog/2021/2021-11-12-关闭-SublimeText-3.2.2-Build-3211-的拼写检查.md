---
title: "关闭 SublimeText 3.2.2 Build 3211 的拼写检查"
pubDatetime: 2021-11-12 11:20:18
modDatetime: 2024-05-20 08:22:06
slug: 关闭-SublimeText-3.2.2-Build-3211-的拼写检查
description: "关闭 SublimeText 3.2.2 Build 3211 的拼写检查"
---




在更新 SublimeText 之后，发现所有的字符下面都有波浪线，这是新版本的 SublimeText 提供的拼写语法功能，然而我不需要此功能。本文来告诉大家如何关闭

<!--more-->


<!-- CreateTime:2021/11/12 19:20:18 -->

<!-- 发布 -->

点击标题栏的 Perferences 的 Settings 按钮，在 User 配置里面加上如下代码即可

```json
	"spell_check": false,
	"spelling_selector": "",
	"dictionary": ""
```


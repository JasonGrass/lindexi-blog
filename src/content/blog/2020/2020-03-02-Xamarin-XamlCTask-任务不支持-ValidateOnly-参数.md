---
title: "Xamarin XamlCTask 任务不支持 ValidateOnly 参数"
pubDatetime: 2020-03-02 00:23:13
modDatetime: 2024-05-20 08:22:03
slug: Xamarin-XamlCTask-任务不支持-ValidateOnly-参数
description: "Xamarin XamlCTask 任务不支持 ValidateOnly 参数"
tags:
  - Xamarin
---




使用 Xamarin 项目，添加一个额外的库项目，被 Xamarin.Form 引用，构建时提示“XamlCTask”任务不支持“ValidateOnly”参数。请确认该参数存在于此任务中，并且是可设置的公共实例属性

<!--more-->


<!-- CreateTime:2020/3/2 8:23:13 -->
<!-- 标签：Xamarin -->


英文的提示如下

```csharp
MSB4064: The "ValidateOnly" parameter is not supported by the "XamlCTask" task
```

这个算 Xamarin 4.3 的坑，解决方法是在 NuGet 升级到 4.5 就可以了

[[Bug] Mixed Xamarin.Forms versions causes error MSB4064: The "ValidateOnly" parameter is not supported by the "XamlCTask" task · Issue #8209 · xamarin/Xamarin.Forms](https://github.com/xamarin/Xamarin.Forms/issues/8209 )


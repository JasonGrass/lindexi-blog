---
title: "How to fix nuget Unrecognized license type MIT when pack"
pubDatetime: 2019-08-31 08:55:58
modDatetime: 2024-05-20 08:22:03
slug: How-to-fix-nuget-Unrecognized-license-type-MIT-when-pack
description: "How to fix nuget Unrecognized license type MIT when pack"
---




When I packaging license within the nupkg, I will using License to replace licentUrl.

<!--more-->


<!-- CreateTime:2019/8/31 16:55:58 -->


I using this code to set the license as MIT but it can not pack.

```
<license type="MIT"/>
```

Because it is a newest feature.

If your nuget version is 5.0.2 that you should use this code.

```
<license type="expression">MIT</license>
```

[Packaging License within the nupkg · NuGet/Home Wiki](https://github.com/NuGet/Home/wiki/Packaging-License-within-the-nupkg )

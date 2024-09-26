---
title: "Roslyn 如何给每个平台设置 PlatformTarget 属性"
pubDatetime: 2020-03-17 10:57:25
modDatetime: 2024-05-20 08:22:03
slug: Roslyn-如何给每个平台设置-PlatformTarget-属性
description: "Roslyn 如何给每个平台设置 PlatformTarget 属性"
tags:
  - Roslyn
---




在使用 csproj 格式，如果需要给不同的平台设置 PlatformTarget 对应平台的值，需要写比较多的代码，本文告诉大家一个简便的方法

<!--more-->


<!-- CreateTime:2020/3/17 18:57:25 -->



使用三句话就完成了平台设置

```xml
<PropertyGroup>
    <PlatformTarget>$(Platform)</PlatformTarget>
</PropertyGroup>

```

上面代码和下面代码是相同的

```csharp
  <PropertyGroup Condition="'$(Configuration)|$(Platform)'=='Release|AnyCPU'">
    <PlatformTarget>AnyCPU</PlatformTarget>
  </PropertyGroup>

  <PropertyGroup Condition="'$(Configuration)|$(Platform)'=='Release|x86'">
    <PlatformTarget>x86</PlatformTarget>
  </PropertyGroup>

  <PropertyGroup Condition="'$(Configuration)|$(Platform)'=='Release|x64'">
    <PlatformTarget>x64</PlatformTarget>
  </PropertyGroup>

  <PropertyGroup Condition="'$(Configuration)|$(Platform)'=='Debug|AnyCPU'">
    <PlatformTarget>AnyCPU</PlatformTarget>
  </PropertyGroup>

  <PropertyGroup Condition="'$(Configuration)|$(Platform)'=='Debug|x86'">
    <PlatformTarget>x86</PlatformTarget>
  </PropertyGroup>

  <PropertyGroup Condition="'$(Configuration)|$(Platform)'=='Debug|x64'">
    <PlatformTarget>x64</PlatformTarget>
  </PropertyGroup>
```


---
title: "WPF dotnet core 的 Blend SDK Behaviors 库"
pubDatetime: 2020-05-16 18:13:54
modDatetime: 2024-05-20 08:22:03
slug: WPF-dotnet-core-的-Blend-SDK-Behaviors-库
description: "WPF dotnet core 的 Blend SDK Behaviors 库"
tags:
  - WPF
  - dotnet
---




之前版本是通过安装 Blend SDK 支持 Behaviors 库的，但是这个方法都是通过引用 dll 的方式，不够优雅。在升级到 dotnet core 3.0 的时候就需要使用 WPF 官方团队开源的 Microsoft.Xaml.Behaviors.Wpf 库代替

<!--more-->


<!-- CreateTime:5/17/2020 2:13:54 PM -->



先通过 NuGet 安装 [Microsoft.Xaml.Behaviors.Wpf](https://www.nuget.org/packages/Microsoft.Xaml.Behaviors.Wpf) 库

或者在 csproj 添加下面代码

```csharp
      <PackageReference Include="Microsoft.Xaml.Behaviors.Wpf">
          <Version>1.1.19</Version>
      </PackageReference>
```

将代码里面的引用 `System.Windows.Interactivity` 库的内容做替换

将 `xmlns:i="clr-namespace:System.Windows.Interactivity;assembly=System.Windows.Interactivity"` 替换为 `xmlns:i="http://schemas.microsoft.com/xaml/behaviors"` 就可以了，这样就能解决找不到 `System.Windows.Interactivity` 无法构建成功



[c# - How to add System.Windows.Interactivity to project? - Stack Overflow](https://stackoverflow.com/questions/8360209/how-to-add-system-windows-interactivity-to-project )


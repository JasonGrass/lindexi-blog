---
title: "dotnet 6 修复在 System.Text.Json 使用 source generation 源代码生成提示 SYSLIB1032 错误"
pubDatetime: 2022-10-31 00:09:00
modDatetime: 2024-05-20 08:22:03
slug: dotnet-6-修复在-System.Text.Json-使用-source-generation-源代码生成提示-SYSLIB1032-错误
description: "dotnet 6 修复在 System.Text.Json 使用 source generation 源代码生成提示 SYSLIB1032 错误"
tags:
  - dotnet
---




在 dotnet 6 内置了通过源代码生成的方式进行序列化 JSON 对象，性能非常高。使用的时候需要将 Json 序列化工具类换成 dotnet 运行时自带的 System.Text.Json 进行序列化，再加上一个继承 JsonSerializerContext 的辅助类型，且在此类型标记 JsonSerializableAttribute 特性，将此类型传入序列化和反序列化即可完成对接。然而在使用的过程中，如果发现此辅助类型的实际代码没有生成，且输出提示 SYSLIB1032 警告，那可能就是此辅助类型没有写对导致

<!--more-->


<!-- CreateTime:2022/10/31 8:09:00 -->

<!-- 发布 -->

如官方文档的对 [SYSLIB1032](https://learn.microsoft.com/en-us/dotnet/fundamentals/syslib-diagnostics/syslib1032) 的描述，这是由于标记了 JsonSerializableAttribute 的类型没有写上 partial 关键词，导致了源代码生成无法通过分部类生成代码，从而失败

也因为源代码生成由于没有 partial 关键词，生成代码失败，从而导致了辅助类型没有实现 JsonSerializerContext 的方法，从而给出以下错误


- error CS0534: 不实现继承的抽象成员“JsonSerializerContext.GeneratedSerializerOptions.get”
- error CS0534: 不实现继承的抽象成员“JsonSerializerContext.GetTypeInfo(Type)”
- error CS7036: 未提供与“JsonSerializerContext.JsonSerializerContext(JsonSerializerOptions?)”的必需形参“options”对应的实参

大家可别被以上的错误给迷惑了哦，这三个错误都是由于 [SYSLIB1032](https://learn.microsoft.com/en-us/dotnet/fundamentals/syslib-diagnostics/syslib1032) 警告的描述，源代码没有生成，从而让辅助类型没有实现 JsonSerializerContext 的方法

解决方法也如官方文档所述，给辅助类型加上 partial 关键词即可

额外的，如果给辅助类型加上 partial 关键词之后，依然提示 [SYSLIB1032](https://learn.microsoft.com/en-us/dotnet/fundamentals/syslib-diagnostics/syslib1032) 错误，还需要检查一下，是否此辅助方法放在其他类型里面。是其他类型的内部类。如果是内部类，那就需要将外部的类，一条龙全部加上 partial 关键词才可以。否则源代码生成将无法创建代码

例如以下代码，在 Program 类型里面，包含了 MyJsonContext 这个辅助类型，即使在 MyJsonContext 类型上面加上 partial 关键词，然而由于 Program 类型没有加上 partial 关键词，源代码依然失败

```csharp
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;

namespace GemjabemrawWohearcebola;

internal class Program
{
    [JsonSerializableAttribute(typeof(WeatherForecast))]
    internal partial class MyJsonContext : JsonSerializerContext
    {

    }
}
```

修复方法就是给外部的类，一条龙全部加上 partial 关键词，如以下代码

```csharp
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;

namespace GemjabemrawWohearcebola;

internal partial class Program
{
    [JsonSerializableAttribute(typeof(WeatherForecast))]
    internal partial class MyJsonContext : JsonSerializerContext
    {

    }
}
```

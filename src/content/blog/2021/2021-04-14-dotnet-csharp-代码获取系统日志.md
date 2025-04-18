---
title: "dotnet C# 代码获取系统日志"
pubDatetime: 2021-04-14 09:48:45
modDatetime: 2024-08-06 12:43:26
slug: dotnet-C-代码获取系统日志
description: "dotnet C# 代码获取系统日志"
tags:
  - dotnet
  - C#
---




可以使用 EventLog 静态类读取或写入系统日志

<!--more-->


<!-- CreateTime:2021/4/14 17:48:45 -->

<!-- 发布 -->

如下面代码可以读取本机的系统日志

```csharp
        static void Main(string[] args)
        {
            foreach (var eventLog in EventLog.GetEventLogs())
            {
                foreach (EventLogEntry entry in eventLog.Entries)
                {
                    Debug.WriteLine(entry.Message);
                }
            }
        }
```

更多请看 [PowerShell 拿到最近的10个系统日志](https://blog.lindexi.com/post/PowerShell-%E6%8B%BF%E5%88%B0%E6%9C%80%E8%BF%91%E7%9A%8410%E4%B8%AA%E7%B3%BB%E7%BB%9F%E6%97%A5%E5%BF%97.html )

本文代码放在 [github](https://github.com/lindexi/lindexi_gd/tree/8beda1f5/LejairbairwecarnelLelearnawcana) 欢迎小伙伴访问

![](images/img-modify-ed7d64c7e2d7d4e48cae06275d671b3f.jpg)


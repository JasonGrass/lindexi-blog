---
title: "PowerShell 通过 WMI 获取设备厂商"
pubDatetime: 2019-02-21 12:02:45
modDatetime: 2024-05-20 08:22:03
slug: PowerShell-通过-WMI-获取设备厂商
description: "PowerShell 通过 WMI 获取设备厂商"
tags:
  - PowerShell
  - WMI
---




本文告诉大家如何通过 WMI 使用Win32_ComputerSystem获取设备厂商

<!--more-->


<!-- CreateTime:2019/2/21 20:02:45 -->

<!-- csdn -->

<!-- 标签：PowerShell,WMI -->

通过下面代码可以获取 机器型号 和 制造厂商

```csharp
Get-WmiObject Win32_ComputerSystem | Format-List Description,Manufacturer,model,UserName
```

运行代码

```csharp
Description  : AT/AT COMPATIBLE
Manufacturer : Gigabyte Technology Co., Ltd.
model        : To be filled by O.E.M.
UserName     : DESKTOP-KA1CD6M\lindexi
```

[Win32_ComputerSystem class - Windows applications](https://docs.microsoft.com/en-us/windows/desktop/cimwin32prov/win32-computersystem )


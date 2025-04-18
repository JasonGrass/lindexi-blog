---
title: "PowerShell 通过 WMI 获取系统安装软件"
pubDatetime: 2019-08-31 08:55:58
modDatetime: 2024-05-20 08:22:03
slug: PowerShell-通过-WMI-获取系统安装软件
description: "PowerShell 通过 WMI 获取系统安装软件"
tags:
  - PowerShell
  - WMI
---




本文告诉大家如何通过 WMI 获取系统安装的软件

<!--more-->


<!-- CreateTime:2019/8/31 16:55:58 -->


<!-- 标签：PowerShell,WMI -->

通过 Win32_Product 可以获取系统安装的软件

```csharp
Get-WmiObject Win32_Product | Format-List Caption,Description,IdentifyingNumber,InstallDate,InstallLocation,HelpLink,HelpTelephone,InstallSource,Language,LocalPackage,Name,PackageCache,PackageCode,PackageName,ProductID,RegOwner,RegCompany,SKUNumber,Transforms,URLInfoAbout,URLUpdateInfo,Vendor,WordCount,Version
```

运行代码

```csharp
Caption           : 坚果云
Description       : 坚果云
IdentifyingNumber : {FEA8B01C-3F43-470A-BB28-679B1AEEC6E8}
InstallDate       : 20180305
InstallLocation   : C:\Program Files\Nutstore\
HelpLink          : http://help.jianguoyun.com
HelpTelephone     :
InstallSource     : C:\Users\linde\AppData\Roaming\NutstoreClient\install\AEEC6E8\
Language          : 2052
LocalPackage      : C:\WINDOWS\Installer\4acb3a9.msi
Name              : 坚果云
PackageCache      : C:\WINDOWS\Installer\4acb3a9.msi
PackageCode       : {3802EFD2-0953-4527-835E-E4C459062CD5}
PackageName       : Nutstore.x64.msi
ProductID         :
RegOwner          :
RegCompany        :
SKUNumber         :
Transforms        : C:\WINDOWS\Installer\{FEA8B01C-3F43-470A-BB28-679B1AEEC6E8}\Nutstore.mst
URLInfoAbout      : https://www.jianguoyun.com/
URLUpdateInfo     :
Vendor            : 上海亦存网络科技有限公司
WordCount         : 0
Version           : 4.0.8


Caption           : Apple 应用程序支持 (32 位)
Description       : Apple 应用程序支持 (32 位)
IdentifyingNumber : {5A659BE5-849B-484E-A83B-DCB78407F3A4}
InstallDate       : 20190221
InstallLocation   : C:\Program Files (x86)\Common Files\Apple\Apple Application Support
HelpLink          : http://www.apple.com/cn/support/
HelpTelephone     : (86) 800 810 2323
InstallSource     : C:\Users\linde\AppData\Local\Temp\IXP246.TMP\
Language          : 2052
LocalPackage      : C:\WINDOWS\Installer\1a1ef7b.msi
Name              : Apple 应用程序支持 (32 位)
PackageCache      : C:\WINDOWS\Installer\1a1ef7b.msi
PackageCode       : {F3D0B996-B6DB-4283-9565-004518A6610B}
PackageName       : AppleApplicationSupport.msi
ProductID         :
RegOwner          :
RegCompany        :
SKUNumber         :
Transforms        :
URLInfoAbout      : http://www.apple.com/cn/
URLUpdateInfo     : http://www.apple.com/cn/
Vendor            : Apple Inc.
WordCount         : 0
Version           : 7.3
```

[Win32_Product class (Windows)](https://msdn.microsoft.com/en-us/library/aa394378(v=vs.85).aspx )

[Why Win32_Product is Bad News - Group Policy Software - SDM Software](https://sdmsoftware.com/group-policy-blog/wmi/why-win32_product-is-bad-news/ )


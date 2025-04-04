---
title: "C# powshell 调用"
pubDatetime: 2018-08-27 08:20:04
modDatetime: 2024-05-20 08:22:03
slug: C-powshell-调用
description: "C# powshell 调用"
tags:
  - C#
  - Powershell
---




本文告诉大家如何在 ps 脚本使用 C# 代码。

<!--more-->


<!-- CreateTime:2018/8/27 16:20:04 -->

<!-- 标签：C#，Powershell -->

首先创建一个 C# 的控制台项目，注意修改输出为类库。

现在的 Powershell 还不支持 dotnet core 的库，所以只能创建一个 dotnet framework 的项目。

因为 Powershell 不支持 exe 所以只能输出为类库

先创建一个类 TrallrahurmuSorhardu 这里有两个方法

```csharp
    public class TrallrahurmuSorhardu
    {
        public static void FutrowxeBemelvamere()
        {
            Console.WriteLine("DirqisfouDrehorearsem");
        }

        public void ViwhawSterenekooSirberheeFarzere()
        {
            Console.WriteLine("LirniWaiqeroroo");
        }
    }
```

上面创建的项目是 `MerRear` ，项目就是准备调用刚才写的两个方法

在输出的文件夹创建一个 `MaKutownene.ps1` 文件，实际上文件的名是随意的，只要后缀是 ps1 就可以。

为什么是需要在输出的文件夹，因为刚才的代码就创建了 MerRear.dll ，为了简单调用 MerRear.dll 这个库，就把创建的文件写在相同的文件夹。

在 `MaKutownene.ps1` 使用代码调用 C# 的库很简单，首先引用 dll ，使用 `Add-Type –Path` 就可以输入 dll 的文件路径

```csharp
Add-Type –Path "MerRear.dll"
```

下面来告诉大家如何在 Powershell 创建 C# 类

## Powershell 创建 C# 类

可以使用下面代码创建 C# 类，因为 Powershell 脚本的写法和 C# 还是存在一些不同

```csharp
$obj = New-Object MerRear.TrallrahurmuSorhardu

```

在 Powershell 使用变量之前是不需要定义，现在就已经创建了类

调用类的 ViwhawSterenekooSirberheeFarzere 方法可以使用下面代码

```csharp
$obj.ViwhawSterenekooSirberheeFarzere()

```

## Powershell 调用 C# 静态方法

在 C# 使用静态方法是不需要创建类，所以在 Powershell 就需要使用下面代码调用

```csharp
[MerRear.TrallrahurmuSorhardu]::FutrowxeBemelvamere()
```

调用静态方法的方式是使用 `[命名空间.类]::静态方法()` 调用

下面就是全部的 Powershell 代码

```csharp
Add-Type –Path "MerRear.dll"

$obj = New-Object MerRear.TrallrahurmuSorhardu

$obj.ViwhawSterenekooSirberheeFarzere()

[MerRear.TrallrahurmuSorhardu]::FutrowxeBemelvamere()
```

这里的 C# 代码是

```csharp
using System;

namespace MerRear
{
    public class TrallrahurmuSorhardu
    {
        public static void FutrowxeBemelvamere()
        {
            Console.WriteLine("DirqisfouDrehorearsem");
        }

        public void ViwhawSterenekooSirberheeFarzere()
        {
            Console.WriteLine("LirniWaiqeroroo");
        }
    }
}
```

注意运行 Powershell 脚本需要先添加策略，使用管理员权限运行下面代码

```csharp
Set-ExecutionPolicy RemoteSigned
```

修改执行策略会带来安全隐患，如果不是开发者就不要使用

参见：

[PowerShell入门（八）：函数、脚本、作用域 - Luke Zhang - 博客园](https://www.cnblogs.com/ceachy/archive/2013/02/26/PoweShell_Function_Script_Scope.html )

![](images/img-5b78d02917a19.jpg)



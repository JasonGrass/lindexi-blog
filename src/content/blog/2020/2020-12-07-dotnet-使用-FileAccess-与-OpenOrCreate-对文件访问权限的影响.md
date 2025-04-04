---
title: "dotnet 使用 FileAccess 与 OpenOrCreate 对文件访问权限的影响"
pubDatetime: 2020-12-07 00:39:09
modDatetime: 2024-05-20 08:22:04
slug: dotnet-使用-FileAccess-与-OpenOrCreate-对文件访问权限的影响
description: "dotnet 使用 FileAccess 与 OpenOrCreate 对文件访问权限的影响"
tags:
  - dotnet
---




本文告诉大家在 dotnet 里面，客户端应用，如 WPF 应用对当前应用程序运行用户无写权限的文件进行访问的时候，调用 File.Open 方法的各个参数的影响

<!--more-->


<!-- CreateTime:2020/12/7 8:39:09 -->

<!-- 发布 -->

在 File.Open 方法里面其实就是对 FileStream 创建的封装，在 FileStream 的构造函数有大量的参数，而对文件权限有影响的是 FileMode 和 FileAccess 和 FileShare 三个

通过 FileMode 可以指定是如何创建这个 FileStream 的，包括是创建还是打开等含义的枚举，细节请看 VS 上的注释。而在 FileMode 枚举的一些参数是和 FileAccess 有关联的，例如调用 Create 时就需要有 Write 的 FileAccess 权限，如果不匹配，那么无论是传入哪个文件路径都会在构造 FileStream 的参数测试时抛出错误

其实在进行无写权限的文件访问时，设置的 FileAccess 才是决定是否会抛出异常的参数。在 dotnet 的 FileAccess 里有三个可以选的参数，分别是 Read 只读和 ReadWrite 读写权限和 Write 只写权限

对于无写权限访问的文件，其实在 Windows 大部分文件都是有读权限的，即使是 `C:\Windows` 等文件夹里面大部分文件都是可以读的，只是不能写而已，对于这部分文件只需要设置 FileAccess 为只读，那么也能拥有读的权限，能打开文件

而如上文所说，在 FileAccess 设置为只读时，将会限制了 FileMode 的可选的值

所以在只有只读权限的文件里面，如果文件是存在的，调用 `new FileStream(filePath, FileMode.OpenOrCreate, FileAccess.Read, FileShare.None, bufferSize: 1024, FileOptions.None);` 在 FileMode 中传入 OpenOrCreate 也是没有问题的，因为影响是否能打开文件的是 FileAccess 参数

当然了，文件是否能打开，除了权限问题，还有文件是否占用问题。这就是 FileShare 的作用了，通过 FileShare 可以设置文件的共享权限，是否允许和其他进程分享文件，如果允许，那么使用什么形式。详细请在 VS 看对应的注释

下面咱来写一个例子

默认的 VisualStudio 的路径是不能写入的，如果咱的应用没有使用高权限打开。此时咱来试试不同的参数，看哪些能打开

以下是我的 vs 安装路径，默认的应用是没有写权限的

```csharp
            var filePath = @"C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\IDE\devenv.exe";
```

而在 `File.Open` 方法里面，其实就是对 FileStream 的封装，如下面两个代码，从逻辑上是等价的，但是实际传入参数不是完全等价

```csharp
    var fileStream = new FileStream(filePath, FileMode.OpenOrCreate, FileAccess.Read, FileShare.None, bufferSize: 1024, FileOptions.None);
    File.Open(filePath, FileMode.OpenOrCreate, FileAccess.Read, FileShare.None);
```

尝试执行上面的代码，可以看到在对 vs 的路径访问时，即使传入的 FileMode 是 OpenOrCreate 打开或创建，但是只要 FileAccess 是读权限的，就能打开成功

而如果 FileMode 设置为 Open 打开，但是 FileAccess 设置为 ReadWrite 读写权限，那么依然会抛出没有权限

```csharp
    File.Open(filePath, FileMode.Open, FileAccess.ReadWrite, FileShare.None);
```

因为打开文件，尽管不创建，但是后续依然是可以写入的，而写入是没有权限的，因此 FileMode 和是否有权限之间没有很大的关系

而 FileMode 和 FileAccess 是有联系的，如在 FileMode 设置了如 Append 这些会涉及到写入的，在 FileAccess 里面如果没给写权限，那么在参数判断的时候就会抛出提示。此时无论传入的文件路径是否有访问权限

```csharp
     File.Open("1.txt", FileMode.Append, FileAccess.Read, FileShare.None);
```

本文代码放在[github](https://github.com/lindexi/lindexi_gd/tree/f29734ed/KawbacayerelaKejeldemwearlai)欢迎大家访问


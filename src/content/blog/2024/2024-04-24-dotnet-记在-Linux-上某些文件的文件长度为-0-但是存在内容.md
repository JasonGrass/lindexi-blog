---
title: "dotnet 记在 Linux 上某些文件的文件长度为 0 但是存在内容"
pubDatetime: 2024-04-23 23:07:50
modDatetime: 2024-05-20 08:22:04
slug: dotnet-记在-Linux-上某些文件的文件长度为-0-但是存在内容
description: "dotnet 记在 Linux 上某些文件的文件长度为 0 但是存在内容"
tags:
  - dotnet
---




本文记录我写的一个测试代码在 Linux 上踩坑的经验。在 Linux 上可能存在一些文件的文件长度是 0 但文件里面依然可以读取到内容。之前我不知道有这样的设计，导致了我大量逻辑判断文件长度为 0 就不执行，从而让运行结果不符合预期

<!--more-->


<!-- CreateTime:2024/04/24 07:07:50 -->

<!-- 发布 -->
<!-- 博客 -->

逻辑非常简单，本文将使用读取 edid 文件作为例子，以下是我的 edid 文件所在的路径

```
/sys/class/drm/card0-DP-2/edid
```

使用 `ls -lh` 命令获取 /sys/class/drm/card0-DP-2 文件夹里面的所有文件，可以看到大概如下的输出内容

```
lrwxrwxrwx 1 root root    0 4月  22 09:58 device -> ../../card0
-r--r--r-- 1 root root 4.0K 4月  22 09:58 dpms
-r--r--r-- 1 root root    0 4月  22 09:58 edid
-r--r--r-- 1 root root 4.0K 4月  22 09:58 enabled
-r--r--r-- 1 root root 4.0K 4月  22 09:58 modes
drwxr-xr-x 2 root root    0 4月  22 09:58 power
-rw-r--r-- 1 root root 4.0K 4月  22 09:58 status
lrwxrwxrwx 1 root root    0 4月  22 09:58 subsystem -> ../../../../../../class/drm
-rw-r--r-- 1 root root 4.0K 4月  22 09:58 uevent
```

从上面输出可以看到在 linux 层获取的 edid 文件的长度也是 0 字节

但是如果此时用 cat 等工具查看，是可以获取到 edid 文件内容的

相应的，在 dotnet 这边，使用以下代码尝试获取的 FileStream 的 Length 属性也是 0 长度

```csharp
    var file = "/sys/class/drm/card0-DP-2/edid";

    var fileStream = File.OpenRead(file);
    Console.WriteLine($"File.OpenRead {fileStream.Length}");
    fileStream.Dispose();

    fileStream = new FileStream(file, FileMode.Open, FileAccess.Read);
    Console.WriteLine($"new FileStream Length = {fileStream.Length}");
    fileStream.Dispose();

    using var safeFileHandle = File.OpenHandle(file);
    fileStream = new FileStream(safeFileHandle, FileAccess.Read);
    Console.WriteLine($"File.OpenHandle Length = {fileStream.Length}");
```

有趣的是，如果使用 File.ReadAllBytes 是可以读取到内容的

```csharp
if (File.ReadAllBytes(file).Length > 0)
{
    Console.WriteLine($"读取成功");
}
```

其实在 Linux 下，即使文件长度是 0 长度，也在某些情况可以读取到内容。如下面代码，继续读取 FileStream 的内容，运行代码可以输出可以读取到内容

```csharp
    var fileStream = File.OpenRead(file);
    Console.WriteLine($"File.OpenRead {fileStream.Length}");

    // 似乎还可以强行读取试试看？
    // 那就读取试试
    var buffer = ArrayPool<byte>.Shared.Rent(256);
    try
    {
        var readLength = fileStream.Read(buffer.AsSpan());
        Console.WriteLine($"ReadLength={readLength}");
    }
    finally
    {
        ArrayPool<byte>.Shared.Return(buffer);
    }

    fileStream.Dispose();
```

其他的创建 FileStream 也一样可以读取到，如下面代码

```csharp
    // 用 new FileStream 读取不到
    // 其实读取到没有长度不代表没有内容
    // Some file systems (e.g. procfs on Linux) return 0 for length even when there's content; also there are non-seekable files.
    fileStream = new FileStream(file, FileMode.Open, FileAccess.Read);
    Console.WriteLine($"new FileStream Length = {fileStream.Length}");
    buffer = ArrayPool<byte>.Shared.Rent(256);
    try
    {
        var readLength = fileStream.Read(buffer.AsSpan());
        Console.WriteLine($"ReadLength={readLength}");
    }
    finally
    {
        ArrayPool<byte>.Shared.Return(buffer);
    }
    fileStream.Dispose();
```

也就是说不应该通过文件长度来判断是否没有内容，可以尝试读取试试，如果能读取到那就证明存在内容

本文代码放在 [github](https://github.com/lindexi/lindexi_gd/tree/0f8939a9c1ac51266ba472730bf6e4ccd22c34b5/BehairracercairJifelalihay) 和 [gitee](https://gitee.com/lindexi/lindexi_gd/tree/0f8939a9c1ac51266ba472730bf6e4ccd22c34b5/BehairracercairJifelalihay) 上，可以使用如下命令行拉取代码

先创建一个空文件夹，接着使用命令行 cd 命令进入此空文件夹，在命令行里面输入以下代码，即可获取到本文的代码

```
git init
git remote add origin https://gitee.com/lindexi/lindexi_gd.git
git pull origin 0f8939a9c1ac51266ba472730bf6e4ccd22c34b5
```

以上使用的是 gitee 的源，如果 gitee 不能访问，请替换为 github 的源。请在命令行继续输入以下代码，将 gitee 源换成 github 源进行拉取代码

```
git remote remove origin
git remote add origin https://github.com/lindexi/lindexi_gd.git
git pull origin 0f8939a9c1ac51266ba472730bf6e4ccd22c34b5
```

获取代码之后，进入 BehairracercairJifelalihay 文件夹，即可获取到源代码

更多 Linux 和国产系统的开发相关博客，请参阅 [博客导航](https://blog.lindexi.com/post/%E5%8D%9A%E5%AE%A2%E5%AF%BC%E8%88%AA.html )

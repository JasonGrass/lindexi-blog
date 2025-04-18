---
title: "dot net core 使用 usb"
pubDatetime: 2018-09-21 11:53:34
modDatetime: 2024-08-06 12:43:26
slug: dot-net-core-使用-usb
description: "dot net core 使用 usb"
tags:
  - dotnetcore
  - usb
  - dotnet
---




本文告诉大家如何在 dot net core 使用 usb

<!--more-->


<!-- CreateTime:2018/9/21 19:53:34 -->

<!-- 标签：dotnetcore,usb,dotnet -->
<div id="toc"></div>

首先需要打开 Nuget 安装 CoreCompat.LibUsbDotNet ，这是一个usb连接的库。

![](images/img-modify-23b126be8bb14131ad2cb5dda8c0ab90.jpg)

## 获得通知

如果需要获得 USB 通知，那么可以通过下面的代码

```csharp
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            LibUsbDotNet.DeviceNotify.IDeviceNotifier kdkpgTxivryglh = new LinuxDeviceNotifier
            {
                Enabled = true
            };
            kdkpgTxivryglh.OnDeviceNotify += OnDeviceNotify;
        }

        private static void OnDeviceNotify(object sender, DeviceNotifyEventArgs e)
        {
            Console.WriteLine($"插入设备的 Pid {e.Device.IdProduct} vid {e.Device.IdVendor}");
        }
```

从上面的代码也可以看到只有在 Linux 下才会触发

我尝试插入一个 hid 设备，结果没有通知，估计只有在 Linux 才可以。

需要注意，通过上面的这个方法只能获得hid设备的通知

## 读写

在开始读写的时候就需要先知道 usb 的 pid 和 vid ，其中 vid 是 Vendor ID，供应商识别码。几乎一个公司有一个识别码。VID由供应商向USB-IF（Implementers Forum，应用者论坛）申请，除了一些诡异的 usb 会重复之外，可以认为不同公司的 vid 是不同。而一个公司有很多产品，他可以给一个产品一个pid，所以pid是 Product ID，产品识别码。

获取 usb 的方法

```csharp
var usbDeviceFinder = new UsbDeviceFinder(vid: 0xFF21, pid: 0x1F02);
```

请把 pid 和 vid 修改为你需要的。

如果不知道 pid vid 需要拿到所有插入的 usb 请使用下面代码

```csharp

            foreach (UsbRegistry temp in UsbDevice.AllWinUsbDevices)
            {
                
            }
```

如果知道了 pid 和 vid 拿到 usb 就可以使用下面代码

```csharp
            var usb = UsbDevice.OpenUsbDevice(usbDeviceFinder);

```

在读的时候，因为不想去判断当前是 win 还是 linux 所以先转换接口，这样就不需要管在什么系统，都一样

下面代码就是打开第一个端口进行读写，如果你测试的 usb 的第一个端口是可以读写，就可以使用下面方法

```csharp
            // Select config #1
            wholeUsbDevice.SetConfiguration(1);

            // Claim interface #0.
            wholeUsbDevice.ClaimInterface(0);

            // open read endpoint 1.
            UsbEndpointReader reader = usb.OpenEndpointReader(ReadEndpointID.Ep01);

            // open write endpoint 1.
            UsbEndpointWriter writer = usb.OpenEndpointWriter(WriteEndpointID.Ep01);
```

先来写入字符串

```csharp
            var str = "lindexi";
            var sejDqhaquwy = Encoding.UTF8.GetBytes(str);

            var ec = writer.Write(sejDqhaquwy, 2000, out var transferLength);
```

从代码可以看到 Write 有很多个重载，上面使用的重载是 数据，超时时间，写入的长度。返回的是错误代码，使用下面代码可以判断是否写入成功

```csharp
          if (writer.Write(sejDqhaquwy, 2000, out var transferLength) == ErrorCode.Success)
            {
                Console.WriteLine("写入成功");
            }
```

读取数据可以使用下面代码

```csharp
            if (reader.Read(sejDqhaquwy, 2000, out transferLength) == ErrorCode.Success)
            {
            }
```

读取也有很多个重载，这里使用的是 读取数据存放的数组，超时时间，读取到的长度。

如果需要异步读写，代码有些多

```csharp
         var offset = 0;
            var length = sejDqhaquwy.Length;
            var timeout = 2000;
            writer.SubmitAsyncTransfer(sejDqhaquwy, offset, length, timeout, out var transferContext);
            transferContext.Wait(out var transferredCount);//等待
```

等待的方式不是使用 await 而是通过  AsyncWaitHandle 等待。

## 串口通信

如果需要在 dotnet core 引用 System.IO.Ports 可以在程序包管理器输入下面代码

```csharp
Install-Package System.IO.Ports -Source https://dotnet.myget.org/F/dotnet-core/api/v3/index.json
```

或者设置 Nuget 的源添加 https://dotnet.myget.org/F/dotnet-core/api/v3/index.json 然后寻找 System.IO.Ports 安装

请看 https://dotnet.myget.org/feed/dotnet-core/package/nuget/System.IO.Ports

或者输入下面代码

```csharp
Install-Package System.IO.Ports
```


## LGPL

需要知道这个库的协议是 LGPL 也就是使用了这个库就需要开放源代码

更多参考请看 [LibUsbDotNet LibUsbDotNet/LibUsbDotNet](https://github.com/LibUsbDotNet/LibUsbDotNet/tree/master/stage/Examples )

![](images/img-5aca00040c556.jpg)


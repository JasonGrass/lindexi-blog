---
title: "C# 获得设备usb信息"
pubDatetime: 2018-02-13 09:23:03
modDatetime: 2024-05-20 08:22:03
slug: C-获得设备usb信息
description: "C# 获得设备usb信息"
tags:
  - C#
---




本文告诉大家如何获得设备的usb来进行判断是否有哪些usb和找不到usb可能是什么。

<!--more-->


<!-- CreateTime:2018/2/13 17:23:03 -->


需要在项目右击引用，点击程序集，搜索 System.Management 然后安装他

然后使用下面的代码就可以获得设备的 usb 请看代码

```csharp
       static List<(string DeviceID, string PNPDeviceID, string Description)> GetUSBDevices()
        {
            List<(string DeviceID, string PNPDeviceID, string Description)> devices = new List<(string, string, string)>();

            ManagementObjectCollection collection;
            using (var searcher = new ManagementObjectSearcher(@"Select * From Win32_USBHub"))
            {
                collection = searcher.Get();
            }

            foreach (var device in collection)
            {
                devices.Add(((string) device.GetPropertyValue("DeviceID"),
                    (string) device.GetPropertyValue("PNPDeviceID"),
                    (string) device.GetPropertyValue("Description")));
            }

            collection.Dispose();
            return devices;
        }
```

如果需要判断是否存在某个 usb ，就通过 pid vid 判断，判断的方法是拿`PNPDeviceID`字符串比较

参见：[c# 获取移动硬盘信息、监听移动设备的弹出与插入事件 - Chris Cheung - 博客园](http://www.cnblogs.com/coolkiss/p/3328825.html )

如果发现找不到 usb ，可能是在开机的时候进行找usb，一般需要开机之后很久才会把所有的设备添加，所以如果找不到，就看开机的时间，如果太短，那么可能是因为程序太快去查。


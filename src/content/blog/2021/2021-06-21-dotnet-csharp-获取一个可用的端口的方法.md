---
title: "dotnet C# 获取一个可用的端口的方法"
pubDatetime: 2021-06-21 00:54:19
modDatetime: 2024-05-20 08:22:03
slug: dotnet-C-获取一个可用的端口的方法
description: "dotnet C# 获取一个可用的端口的方法"
tags:
  - dotnet
  - C#
---




本文来告诉大家如何可以获取一个可用的端口

<!--more-->


<!-- CreateTime:2021/6/21 8:54:19 -->


<!-- 发布 -->

使用如下代码可以返回一个可用的端口

```csharp
        public static int GetAvailablePort(IPAddress ip)
        {
            TcpListener l = new TcpListener(ip, 0);
            l.Start();
            int port = ((IPEndPoint)l.LocalEndpoint).Port;
            l.Stop();
            return port;
        }
```

在调用 Stop 方法的时候，将可以重复使用此端口，同时在系统分配里面，在一段时间内不会再次被使用，因此这个端口是安全的，可以在这里进行使用

以上代码放在 [github](https://github.com/lindexi/lindexi_gd/tree/116d727103d5ecfa6547bd44ae2cb860b963fc54/YagabaigekeaLuliluje) 和 [gitee](https://gitee.com/lindexi/lindexi_gd/tree/116d727103d5ecfa6547bd44ae2cb860b963fc54/YagabaigekeaLuliluje) 欢迎访问

另一个方式是使用更底层的 Socket 类型，代码如下

```csharp
        public static int GetAvailablePort(IPAddress ip)
        {
            using var socket = new Socket(SocketType.Stream, ProtocolType.Tcp);
            socket.Bind(new IPEndPoint(ip, 0));
            socket.Listen(1);
            var ipEndPoint = (IPEndPoint)socket.LocalEndPoint;
            var port = ipEndPoint.Port;
            return port;
        }
```

以上代码放在 [github](https://github.com/lindexi/lindexi_gd/tree/03c7e5171bdf1d01bdeb2c3ff9a5a9b797529b94/YagabaigekeaLuliluje) 和 [gitee](https://gitee.com/lindexi/lindexi_gd/tree/03c7e5171bdf1d01bdeb2c3ff9a5a9b797529b94/YagabaigekeaLuliluje) 欢迎访问

参阅 [MiSeCo #12: Find free TCP port in the system - Michal Dymel - DevBlog](https://devblog.dymel.pl/2016/05/05/find-free-tcp-port-system/)

[.net - In C#, how to check if a TCP port is available? - Stack Overflow](https://stackoverflow.com/questions/570098/in-c-how-to-check-if-a-tcp-port-is-available)




---
title: "How to use code to exit the application in UWP"
pubDatetime: 2019-08-31 08:55:58
modDatetime: 2024-05-20 08:22:03
slug: How-to-use-code-to-exit-the-application-in-UWP
description: "How to use code to exit the application in UWP"
tags:
  - UWP
---




I will tell you how to exit the application in UWP by the code.

<!--more-->


<!-- CreateTime:2019/8/31 16:55:58 -->


We can call some static method to help us to exit the application.

The first method is as this code:

```csharp
            CoreApplication.Exit();

```

And the other one is 

```csharp
Application.Current.Exit();
```

If you are making the WPF application that you can use this code to exit the application.

```csharp
Application.Current.Shutdown();

```

And

```csharp
Environment.Exit(0);

```

If you find any problems, please contact me.


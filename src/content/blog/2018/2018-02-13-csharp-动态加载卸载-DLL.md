---
title: "C# 动态加载卸载 DLL"
pubDatetime: 2018-02-13 09:23:03
modDatetime: 2024-05-20 08:22:03
slug: C-动态加载卸载-DLL
description: "C# 动态加载卸载 DLL"
tags:
  - C#
---




我最近做的软件，需要检测dll或exe是否混淆，需要反射获得类名，这时发现，C#可以加载DLL，但不能卸载DLL。于是在网上找到一个方法，可以动态加载DLL，不使用时可以卸载。

<!--more-->


<!-- CreateTime:2018/2/13 17:23:03 -->


<div id="toc"></div>

我在写一个WPF 程序，发现可以通过 `Assembly.Load` 加载 DLL，但是如何卸载DLL？下面就来说下如何卸载。

看到 `Assembly.Load` 是把 DLL 加载到当前程序集，这句话，我就想到了我们的主程序集和当前的不同，那么可以加载到当前不会影响主程序。那么如何新建一个程序集？他是否可以卸载，答案是可以的。

首先，我们可以通过`var appDomain = AppDomain.CreateDomain(appDomainName);`创建 AppDomain 。他是可以卸载，卸载 AppDomain 使用 `AppDomain.Unload` ，就可以把加载在 AppDomain 的 DLL 卸载。

于是我们需要把 DLL 加载在 AppDomain ，这样之后可以卸载 AppDomain 动态删掉 加载的DLL。

如果要把 DLL 加载在 AppDomain 需要先写一个类，继承`MarshalByRefObject`


```csharp
    internal class ApplicationProxy : MarshalByRefObject
    {
        public void DoSomething()
        {
            
        }
    }

    var proxy =
                appDomain.CreateInstanceAndUnwrap(Assembly.GetAssembly(typeof(ApplicationProxy)).FullName,
                typeof(ApplicationProxy).ToString()) as ApplicationProxy;
```

我们可以在 DoSomething 函数加载 DLL ，加载的 DLL 在 AppDomain ，不在主程序，所以卸载 AppDomain 可以卸载 DLL

假如是从 文件加载，可以使用 LoadFile 


```csharp
                  var assembly  = Assembly.LoadFile(file.FullName);
```
assembly 可以获得所有的类和方法。

然后需要卸载时，可以使用` AppDomain.Unload(appDomain);`

建议写`var assembly  = Assembly.LoadFile(file.FullName);`在 try，写` AppDomain.Unload(appDomain);`在 finally

上面的 appDomainName 是我自己给他的。

http://stackoverflow.com/questions/2132649/loading-unloading-assembly-in-different-appdomain

我们可以验证，如果不使用新建一个 AppDomain 加载的 DLL 会在主程序集，如果使用了，就会在我们新建的 AppDomain 。

首先我们使用 `Assembly.LoadFile(file)` 加载，再用反射获得当前程序集，然后获取他的所有 type ，当然我们是知道加载的 File 包含的 type，一会可以验证使用已经加载他。


```csharp
            System.Reflection.Assembly.LoadFile(file);

            foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies())
            {
                //查看type               
            }
```

可以看到 file 包含的 type 在主程序。

我们使用新建 appDomain 


```csharp
              const string appDomainName = "ConfuseChecker";
            var appDomain = AppDomain.CreateDomain(appDomainName);
            var proxy =
                       appDomain.CreateInstanceAndUnwrap(Assembly.GetAssembly(typeof(ApplicationProxy)).FullName,
                           typeof(ApplicationProxy).ToString()) as ApplicationProxy;
            proxy.DoSomething(new FileInfo(file));

            AppDomain.Unload(appDomain);
```

这时可以看到，我们的主程序没有包含 file 的 type 。


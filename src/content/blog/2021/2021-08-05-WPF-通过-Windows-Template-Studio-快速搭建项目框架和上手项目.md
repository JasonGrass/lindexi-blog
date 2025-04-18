---
title: "WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目"
pubDatetime: 2021-08-05 11:56:09
modDatetime: 2024-08-06 12:43:43
slug: WPF-通过-Windows-Template-Studio-快速搭建项目框架和上手项目
description: "WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目"
tags:
  - WPF
---




本文对新手友好。在咱开始一个新项目的时候，可以利用 Windows Template Studio 快速搭建整个项目的框架。搭建出来的框架比较现代化，适合想要快速开发一个项目的大佬使用，也适合小白入门学习如何开发应用

<!--more-->


<!-- CreateTime:2021/8/5 19:56:09 -->


<!-- 发布 -->

通过 Windows Template Studio 工具，可以在 VisualStudio 提供的可视化选项里面，按照步骤，逐步选择自己想要的功能，点击完成即可自动创建一个包含所有基础功能和框架的解决方案。接下来要做的是在此搭建好的框架上进行逻辑更改，加上自己的业务功能

下面让我一步步告诉你如何使用 Windows Template Studio 工具

在开始之前，需要给 VisualStudio 安装上 Windows Template Studio 插件，以下是安装插件的步骤

点击工具栏，点击管理扩展

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目0.png) -->

![](images/img-modify-8a06018ec45be9d6e12ab8f648661e78.jpg)

点击联机选项，搜寻 Windows Template Studio 即可找到插件

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目1.png) -->

![](images/img-modify-c5c629196908509cf9630d6792dd9fad.jpg)

点击下载即可自动下载安装

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目2.png) -->

![](images/img-modify-77b3cbe609e4e617be63bb5a73a5c72e.jpg)

安装完成之后，记得重启 VisualStudio 哦。打开 VisualStudio 在首页新建项目可以看到添加的模版，在 Windows Template Studio 工具不仅包含了 WPF 项目的，还包含了 UWP 等项目的，本文只使用 WPF 作为例子，对于其他的项目，大概是差不多

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目3.png) -->

![](images/img-modify-20f4b88c60ecc84550dab552afde3633.jpg)

点击创建，然后输入项目名和选择项目的文件夹

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目4.png) -->

![](images/img-modify-453a685177fe225278a6088e9952aca9.jpg)


点击创建，此时将会给一个选项卡用来逐步选择。首次打开需要稍等一下

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目5.png) -->

![](images/img-modify-1a899360919d3716fd60a2395dd67aa0.jpg)

开始的时候是选择项目的大框架，也就是项目的组织方式是什么。如我选择了 MenuBar 类型的项目

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目6.png) -->

![](images/img-modify-3d77f85a8d431b9d1b5e886e8da4d2b0.jpg)

选择之后点击下一步，选择应用需要包含的页面，如空白页面和设置面等

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目7.png) -->

![](images/img-modify-7edff4746e18317a2b4b8136d22bcb9b.jpg)

页面是可以重复多次选择的，也可以做右侧进行删除

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目8.png) -->

![](images/img-modify-3993d90d548a836758debcc19b190786.jpg)

点击下一步，开始选择支持的功能，如加上 MSIX 打包功能

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目9.png) -->

![](images/img-modify-065eabf2c4ee998d3bc4668089fe5ed2.jpg)

点击下一步，选择应用需要包含的服务，如账号登录功能

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目10.png) -->

![](images/img-modify-14d02774a9f5621b6414ced5bfb867cb.jpg)

点击下一步，给应用程序加上单元测试，有多个不同的单元测试可以选择

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目11.png) -->

![](images/img-modify-930f3387166f45d87f09810dc62671ee.jpg)

点击创建即可开始创建项目

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目12.png) -->

![](images/img-modify-121681330ca8099993672b3b27edb80b.jpg)

等待一下即可创建出一个解决方案

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目13.png) -->

![](images/img-modify-5d9a56873a5442ec55a4e81e014e49bb.jpg)

啥都不要做，按下 F5 即可进行构建和运行

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目14.png) -->

![](images/img-modify-9870189e6bfd8c87500cae44779bc0b1.jpg)

以上就是我运行的 demo 应用

如果按下 F5 没有构建成功，那就是 VisualStudio 没有安装完全。如果可以构建成功，但是运行失败，如有选择需要登录，那需要加上应用的标识符，但实际上没有加入，将会在运行的时候提示 `Microsoft.Identity.Client.MsalClientException:“Error: ClientId is not a GUID. ”` 如下图


<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目15.png) -->

![](images/img-modify-631e21c76f0e3cd5e4cb196865590635.jpg)

解决方法是在 appsettings.json 文件里面加上 identityClientId 的值，如下面代码

```json
{
  "AppConfig": 
  {
    "userFileName": "User.json",
    "identityClientId": "CB9FC3AB-C5CC-42FB-881B-50EFCE0B1BE4",
    "identityCacheFileName": ".msalcache.dat",
    "identityCacheDirectoryName": "MSAL_CACHE",
    "configurationsFolder": "WheburfearnofeKellehere\\Configurations",
    "appPropertiesFileName": "AppProperties.json",
    "privacyStatement": "https://YourPrivacyUrlGoesHere/"
  }
}
```

接下来让咱了解一下这个通过 Windows Template Studio 创建的项目的大体框架

先打开 App.xaml.cs 文件，这个文件就是咱的 WPF 应用的入口

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目16.png) -->

![](images/img-modify-0269bfbd5d5a9b6411bdbbeeb06d08b4.jpg)

大概的逻辑和默认的 WPF 应用差不多，但是实际上这个自动创建的项目用上了现代化的 IOC 容器的方式。整套逻辑都保持现代化的 dotnet 写法，此写法和 ASP.NET Core 的写法差不多，都是一脉的方法。如启动的时候先做的服务配置

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目17.png) -->

![](images/img-modify-6d478d27311f31c076e6ebbd1886da05.jpg)

可以看到在这里面实现了大量的服务的注入，包括 ViewModel 以及其他用到的逻辑

这个 WPF 应用将在 ApplicationHostService 进行管理，包括窗口的启动和切换页面

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目18.png) -->

![](images/img-modify-95ccd1c8f72754ba998a3c6d260bb6d3.jpg)


以上的 ApplicationHostService 是一个继承 IHostedService 的类型，读到这里就要求大家对 dotnet 的默认框架有所了解

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目19.png) -->

![](images/img-modify-28ae607214f92c489ce36dd44f867120.jpg)

如果不想去阅读 dotnet 的默认框架的设计，那只需要知道，在应用启动之后，将会调用 StartAsync 方法即可

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目20.png) -->

![](images/img-modify-c0534d2bd6c92a337fbf3adf26168d15.jpg)

以上代码是进行初始化，以及初始化登录模块

而是创建窗口的逻辑是放在 HandleActivationAsync 方法里面

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目21.png) -->

![](images/img-modify-8398e03fbe86f1c06f016bf299fe4e92.jpg)

在判断当前还没有启动任何窗口的时候，将会启动 MainWindow 作为主创建，但是启动窗口的方法是通过 MainViewModel 进行的

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目22.png) -->

![](images/img-modify-2d38da1e4d861a67af4518564eb1d832.jpg)


如下面代码

```csharp
        private async Task HandleActivationAsync()
        {
            var activationHandler = _activationHandlers.FirstOrDefault(h => h.CanHandle());

            if (activationHandler != null)
            {
                await activationHandler.HandleAsync();
            }

            await Task.CompletedTask;

            if (App.Current.Windows.OfType<IShellWindow>().Count() == 0)
            {
                // Default activation that navigates to the apps default page
                _shellWindow = _serviceProvider.GetService(typeof(IShellWindow)) as IShellWindow;
                _navigationService.Initialize(_shellWindow.GetNavigationFrame());
                _rightPaneService.Initialize(_shellWindow.GetRightPaneFrame(), _shellWindow.GetSplitView());
                _shellWindow.ShowWindow();
                _navigationService.NavigateTo(typeof(MainViewModel).FullName);
                await Task.CompletedTask;
            }
        }
```

通过以上即可看到创建出来的项目 MVVM 部分做的不错，来看一下项目的大框架，各个文件按照 MVVM 的方法放在不同的文件夹

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目23.png) -->

![](images/img-modify-2d7acbd7ce3c763aab36b72ac692a73a.jpg)

我很熟悉 MVVM 因此一看就知道各个文件是做什么的，通过此工具创建也可以让新手了解如何编写 MVVM 代码

回答上面代码为什么通过切换到 MainViewModel 即可自动到主页面。是因为在 PageService 里面实现了注册，关联了 MainViewModel 和 MainPage 界面

<!-- ![](images/img-WPF 通过 Windows Template Studio 快速搭建项目框架和上手项目24.png) -->

![](images/img-modify-5f86f727b4667213dcb8099bd59640df.jpg)

通过 Windows Template Studio 工具搭建的界面，可以在很快的速度，搭建出来一个能用的框架

以上的代码放在 [github](https://github.com/lindexi/lindexi_gd/tree/71156c6e8818fbefecac4ee2d31724df1bbcfe45/WheburfearnofeKellehere) 和 [gitee](https://gitee.com/lindexi/lindexi_gd/tree/71156c6e8818fbefecac4ee2d31724df1bbcfe45/WheburfearnofeKellehere) 欢迎访问

可以通过如下方式获取本文的源代码，先创建一个空文件夹，接着使用命令行 cd 命令进入此空文件夹，在命令行里面输入以下代码，即可获取到本文的代码

```
git init
git remote add origin https://gitee.com/lindexi/lindexi_gd.git
git pull origin 71156c6e8818fbefecac4ee2d31724df1bbcfe45
```

以上使用的是 gitee 的源，如果 gitee 不能访问，请替换为 github 的源

```
git remote remove origin
git remote add origin https://github.com/lindexi/lindexi_gd.git
```

获取代码之后，进入 WheburfearnofeKellehere 文件夹


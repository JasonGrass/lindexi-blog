---
title: "VisualStudio 扩展开发 添加菜单"
pubDatetime: 2019-02-02 07:35:18
modDatetime: 2024-08-06 12:43:35
slug: VisualStudio-扩展开发-添加菜单
description: "VisualStudio 扩展开发 添加菜单"
tags:
  - VisualStudio
---




本文告诉大家如何快速在开发 VisualStudio 的工具里面添加菜单，点击菜单运行自己的代码

<!--more-->


<!-- CreateTime:2019/2/2 15:35:18 -->

<!-- csdn -->

<!-- 标签： VisualStudio -->

在 VisualStudio 开发插件需要安装插件的开发，在 VisualStudio 2017 可以点击更新，添加插件开发

<!-- ![](images/img-VisualStudio 扩展开发 添加菜单0.png) -->

![](images/img-modify-a97b577ab3253590d512fec2b689c352.png)

在之前我写过 [VisualStudio 扩展开发](https://lindexi.gitee.io/post/VisualStudio-%E6%89%A9%E5%B1%95%E5%BC%80%E5%8F%91.html) 使用的是 VisualStudio 2015 开发，在开发 VisualStudio 2017 的插件和开发之前的版本几乎一样

新建一个插件的程序

<!-- ![](images/img-VisualStudio 扩展开发 添加菜单1.png) -->

![](images/img-modify-42da400fb601942a7b63e92a9f665cfd.png)

右击新建一个自定义命令，这里的命令的文件名可以随意写，如我就写了 NowkuPurqicowFourocafem 然后就可以去和小伙伴聊天，等待自动写的代码

<!-- ![](images/img-VisualStudio 扩展开发 添加菜单2.png) -->

![](images/img-modify-0f09793be47a26f37693c42cb003e2bc.png)

<!-- ![](images/img-VisualStudio 扩展开发 添加菜单3.png) -->

![](images/img-modify-39aa12f2b5a27de0f4e4e1b3dfa6b337.png)

现在只需要做很小的更改，就可以看到效果

双击打开 NowkuPurqicowFourocafemPackage.vsct 文件可以看到下面代码

```csharp
    <Buttons>
      <!--To define a menu group you have to specify its ID, the parent menu and its display priority.
          The command is visible and enabled by default. If you need to change the visibility, status, etc, you can use
          the CommandFlag node.
          You can add more than one CommandFlag node e.g.:
              <CommandFlag>DefaultInvisible</CommandFlag>
              <CommandFlag>DynamicVisibility</CommandFlag>
          If you do not want an image next to your command, remove the Icon node /> -->
      <Button guid="guidNowkuPurqicowFourocafemPackageCmdSet" id="NowkuPurqicowFourocafemId" priority="0x0100" type="Button">
        <Parent guid="guidNowkuPurqicowFourocafemPackageCmdSet" id="MyMenuGroup" />
        <Icon guid="guidImages" id="bmpPic1" />
        <Strings>
          <ButtonText>这里就是菜单</ButtonText>
        </Strings>
      </Button>
    </Buttons>
```

这里的 ButtonText 就是显示的内容，先在这里做一点修改

```csharp
          <ButtonText>欢迎访问我博客 http://lindexi.gitee.io 里面有大量 UWP WPF 博客</ButtonText>

```

按钮的图标是通过 Icon 设置，相对复杂，就先不告诉大家如何修改

打开 NowkuPurqicowFourocafem 类在 Execute 方法添加一些代码，这个函数就是用户点击按钮使用的方法

```csharp
        private void Execute(object sender, EventArgs e)
        {
        }
```

如在用户点击的时候访问我的博客

```csharp
        private void Execute(object sender, EventArgs e)
        {
            Process.Start("http://lindexi.gitee.io");
        }
```

现在点击调试 VisualStudio 可以看到 VisualStudio 实在厉害，听说 VS 是使用 VS 写的，同时 VS 可以使用 VS 调试

但是可以发现输出有很多诡异的代码，难道微软的小伙伴不关注 VisualStudio 的启动性能？

<!-- ![](images/img-VisualStudio 扩展开发 添加菜单4.png) -->

![](images/img-modify-3f6899cbc52e09803d21c3678e3fa070.png)

再和小伙伴聊天，现在可以和他说，我在开发 VS 然后告诉他知道为什么 VS 启动那么慢

点击工具，可以看到一个按钮

<!-- ![](images/img-VisualStudio 扩展开发 添加菜单5.png) -->

![](images/img-modify-1061b8a41f9f00afdca2a99d387381d7.png)

点击按钮就可以看到我博客

[Creating an Extension with a Menu Command](https://docs.microsoft.com/en-us/visualstudio/extensibility/creating-an-extension-with-a-menu-command?view=vs-2017 )


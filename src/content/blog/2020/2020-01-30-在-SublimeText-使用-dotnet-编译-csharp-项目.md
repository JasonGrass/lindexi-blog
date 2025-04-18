---
title: "在 SublimeText 使用 dotnet 编译 C# 项目"
pubDatetime: 2020-01-30 08:55:33
modDatetime: 2024-05-20 08:22:06
slug: 在-SublimeText-使用-dotnet-编译-C-项目
description: "在 SublimeText 使用 dotnet 编译 C# 项目"
tags:
  - dotnet
  - C#
---




在 SublimeText 搭建 C# 环境可以找到的博客基本都是使用 csc 进行构建，而我期望在 dotnet 下编译整个项目。通过 dotnet 编译整个项目可以解决编译大项目时需要打开一个控制台降低效率

<!--more-->


<!-- CreateTime:2020/1/30 16:55:33 -->



用 dotnet 编译的优点是我可以在 Ubuntu 系统使用 SublimeText 编写和编译 C# 项目。我最近无聊弄了一个 Ubuntu 系统在玩，在 Ubuntu 系统下确实需要缺啥写啥，如果不是要玩，还是推荐不要用这个系统。因为我还不熟悉这个系统，用的效率特别低。例如我想写一个 C# 程序，我想要在 SublimeText 通过 `ctrl+B` 进行编译然后运行，而原本在 Windows 下我可以同步我的配置，在这里就不能使用，原因是在 Windows 下通过 csc 编译文件

而通过 dotnet 的编译，可以利用跨平台的 dotnet 技术，在 Ubuntu 下也使用相同的程序和快捷键开发

在使用之前，请先安装好 dotnet 程序，安装方法请看 [https://dotnet.microsoft.com/](https://dotnet.microsoft.com/) 在安装之后请测试在控制台输入下面命令

```csharp
dotnet --info
```

我需要在 cs 文件所在的文件夹，或上一级等寻找 csproj 文件，然后通过 `dotnet run --project xx.csproj` 的方法运行项目。而通过输入的 cs 文件寻找 csproj 文件需要写一点额外的程序，这个程序非常简单，可是我是在 ubuntu 写的，我才不会告诉你我砸了一个键盘了

我将从输入 cs 文件，找到 csproj 文件，然后调用 dotnet run 的代码放在 [gitee](https://gitee.com/lindexi/SublimeTextBuildDotNetFile) 欢迎小伙伴下载

将 [SublimeTextBuildDotNetFile](https://gitee.com/lindexi/SublimeTextBuildDotNetFile) 项目下载在本地，通过 `cd` 进入到下载所在的文件夹，也就是 
SublimeTextBuildDotNetFile.csproj 所在的文件夹，通过 `dotnet build` 命令编译

可以在 `bin\Debug\netcoreapp3.1` 里面找到 SublimeTextBuildDotNetFile 文件，这是一个可运行的程序

在 SublimeText 可以通过 Build System 新建构建程序，其实这里的构建程序就是通过命令行调用现有程序，在现有程序传入当前文件的参数，接下来的就是调用的进程拿到当前文件做的，这样就能做到，只要有编译器，几乎可以构建任意的文件

在 SublimeText 的 Tools 的 Build System 点击新建 Build System 在打开的页面输入下面代码

```json
{
	"shell_cmd": "~/lindexi/SublimeTextBuildDotNetFile/bin/Debug/netcoreapp3.1/SublimeTextBuildDotNetFile $file",
	"file_regex": "^(...*?):([0-9]*):?([0-9]*)",
	"working_dir": "${file_path}"
}
```

有搜 将Sublime Text配置为C#代码编辑器的小伙伴会发现和其他小伙伴不同的是我将 `shell_cmd` 修改为自己写的程序

将上面的文件保存，点击保存会自动保存到 SublimeText 配置文件夹，在 ubuntu 的文件夹是 `~/.config/sublime-text-3/Packages/Users` 保存的文件是 `csharp.sublime-build` 此时打开一个 cs 文件，按下 `ctrl+B` 就会自动找到 csproj 文件，然后运行 `dotnet run --project xx.csproj` 命令

下面是 SublimeTextBuildDotNetFile 的 Program 代码，可以看到代码十分简单

```
﻿using System;
using System.IO;
using System.Diagnostics;

namespace SublimeTextBuildDotNetFile
{
    class Program
    {
        static void Main(string[] args)
        {
        	if(args.Length>0)
        	{
        		var file = args[args.Length-1];
        		var folder = Path.GetDirectoryName(file);

        		var csprojFile=FindCsprojFile(folder);

        		if(string.IsNullOrEmpty(csprojFile))
        		{

        		}
        		else
        		{
        			Run(csprojFile);
        		}
        	}
        	else
        	{
        		Console.WriteLine("You should input file");
        	}
        }

        static void Run(string csproj)
        {
        	csproj = $"\"{csproj}\"";
        	var str = $"run --project {csproj}";
        	Process.Start("dotnet",str);
        }

        static string FindCsprojFile(string folder)
        {
        	if(string.IsNullOrEmpty(folder))
        	{
        		return null;
        	}

            var fileList = Directory.GetFiles(folder,"*.csproj");

        	if(fileList.Length >= 1)
        	{
        		return fileList[0];
        	}
        	else if(fileList.Length ==0)
        	{
        		return FindCsprojFile(Directory.GetParent(folder).FullName);
        	}

        	return null;
        }
    }
}

```

上面的代码没更新，最新代码请看 [gitee](https://gitee.com/lindexi/SublimeTextBuildDotNetFile) 如果使用遇到问题欢迎小伙伴评论


---
title: "C# dotnet 使用判断文件夹存在的方法判断一个文件路径会怎样"
pubDatetime: 2020-08-01 02:17:31
modDatetime: 2024-05-20 08:22:03
slug: C-dotnet-使用判断文件夹存在的方法判断一个文件路径会怎样
description: "C# dotnet 使用判断文件夹存在的方法判断一个文件路径会怎样"
tags:
  - dotnet
  - C#
---




假定我有一个文件的路径，我将这个文件路径放在文件夹判断方法里面，请问此时返回的是存在还是不存在？答案是返回不存在

<!--more-->


<!-- CreateTime:2020/8/1 10:17:31 -->



如下面测试代码，这里的 GelteajoutrerebaKoutigasremawcho.dll 就是程序集，也就是文件是存在的，那么放在 DirectoryInfo 判断输出的内容是否存在

```csharp
namespace GelteajoutrerebaKoutigasremawcho
{
    class Program
    {
        static void Main(string[] args)
        {
            DirectoryInfo dir = new DirectoryInfo(@"GelteajoutrerebaKoutigasremawcho.dll");
            Console.WriteLine(dir.Exists);
            
            var file = new FileInfo(@"GelteajoutrerebaKoutigasremawcho.dll");
            Console.WriteLine(file.Exists);
        }
    }
}
```

输出是 False True 也就是判断文件夹不存在，判断文件存在

代码放在 [github](https://github.com/lindexi/lindexi_gd/tree/e237082b643c86cd15124f201c82f46955b9ab84/GelteajoutrerebaKoutigasremawcho) 欢迎小伙伴访问


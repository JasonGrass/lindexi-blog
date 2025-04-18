---
title: "WPF 新建用户控件提示 Error MC3000 首个 xaml 字符不合法"
pubDatetime: 2020-06-01 02:26:50
modDatetime: 2024-05-20 08:22:03
slug: WPF-新建用户控件提示-Error-MC3000-首个-xaml-字符不合法
description: "WPF 新建用户控件提示 Error MC3000 首个 xaml 字符不合法"
tags:
  - WPF
---




在 WPF 新建用户用户控件时，偶尔的 VS 版本会逗你，给你创建了一个编码不对或偷偷给你的文件第一个字符添加了一个不可见字符，此时将会构建不通过

<!--more-->


<!-- CreateTime:6/1/2020 10:26:50 AM -->



在构建的时候提示下面代码

```csharp
Error MC3000: 'Data at the root level is invalid. Line 1, position 1.' XML is not valid. (1, 1)
```

此时的原因要么是编码的原因，要么是偷偷写入了第一个看不见的字符

如果是编码原因可以尝试使用我的 VS 插件，点击 [Encoding normalize tool](https://marketplace.visualstudio.com/items?itemName=lindexigd.vs-extension-18109) 下载安装，之后就可以在插件这里转换某个文件的编码

第二个方案是在修复 Utf8 之后依然不让通过，可以尝试新建一个 xml 文件

然后复制 xaml 文件的内容到这个 xml 文件里面，复制 xaml 文件名，删除 xaml 文件，重命名 xml 文件为 xaml 文件名

注意 csproj 文件里面需要保持 xaml 文件的引用关系，如使用 Page 引用同时设置构建

如下代码放在 csproj 表示让所有 xaml 文件使用页面形式构建

```xml
    <Compile Update="**\*.xaml.cs">
      <DependentUpon>%(Filename)</DependentUpon>
    </Compile>
    <Page Include="**\*.xaml">
      <SubType>Designer</SubType>
      <Generator>MSBuild:Compile</Generator>
    </Page>
```

如需要特定某个文件可使用如下代码

```xml
    <Compile Update="Foo.xaml.cs">
      <DependentUpon>Foo.xaml</DependentUpon>
    </Compile>
    <Page Include="Foo.xaml">
      <SubType>Designer</SubType>
      <Generator>MSBuild:Compile</Generator>
    </Page>
```


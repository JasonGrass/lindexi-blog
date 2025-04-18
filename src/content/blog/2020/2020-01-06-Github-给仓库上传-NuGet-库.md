---
title: "Github 给仓库上传 NuGet 库"
pubDatetime: 2020-01-06 13:20:46
modDatetime: 2024-08-06 12:43:32
slug: Github-给仓库上传-NuGet-库
description: "Github 给仓库上传 NuGet 库"
tags:
  - git
---




在 Github 可以发布自己的 NuGet 库，本文将告诉大家如何发布

<!--more-->


<!-- CreateTime:2020/1/6 21:20:46 -->

<!-- csdn -->

在 Github 的仓库的首页，可以看到 Package 功能

<!-- ![](images/img-Github 给仓库上传 NuGet 库0.png) -->

![](images/img-modify-72dffaa9793b3a26f702a00a5dcf61e1.png)

点击打开一个项目的 Package 默认会邀请你加入，点击开启功能

<!-- ![](images/img-Github 给仓库上传 NuGet 库1.png) -->

![](images/img-modify-4d093c079cccb14df95ae57f0b8decfe.png)

在 Github 会显示如何做 NuGet 的上传，上面的 `GH_TOKEN` 就是自己生成的代表自己密码，请看文档 [创建用于命令行的个人访问令牌 - GitHub 帮助](https://help.github.com/cn/articles/creating-a-personal-access-token-for-the-command-line )

大概的方法就是点击 Settings -> Developer settings -> Personal access tokens 如下图

![](https://help.github.com/assets/images/help/settings/userbar-account-settings.png)

![](https://help.github.com/assets/images/help/settings/developer-settings.png)

![](https://help.github.com/assets/images/help/settings/personal_access_tokens_tab.png)

单击 Generate new token（生成新令牌）

![](https://help.github.com/assets/images/help/settings/generate_new_token.png)

输入随意的名字，然后注意勾选 Package 权限，也就是 `write:packages` 和 `read:packages` 权限

<!-- ![](images/img-Github 给仓库上传 NuGet 库2.png) -->

![](images/img-modify-f38f6c5d81cab3021730c9e2773492a2.png)

将页面拉到最下，点击 Generate token 按钮就可以创建密码

如图片的 `e9040b0fb3fbd0b4971660c1c04d615a630dce6e` 就是我创建的密码，这个密码请保存起来，因为刷新页面就看不到了

<!-- ![](images/img-Github 给仓库上传 NuGet 库3.png) -->

![](images/img-modify-96a7dcd1ee03ccf6cd762c089677ebfe.png)

然后在对应的仓库配置密码，在默认打开 package 页面的时候就可以看到

```csharp
 // Step 1: Authenticate
$ nuget source Add -Name "GitHub" -Source "https://nuget.pkg.github.com/lindexi/index.json" -UserName lindexi -Password GH_TOKEN

// Step 2: Pack
$ nuget pack

// Step 3: Publish
$ nuget push "lindexi_gd.nupkg" -Source "GitHub" 
```

小伙伴的第一步的 Source 的内容请替换为你自己的仓库的内容，还需要替换的是刚才 github 生成的 `GH_TOKEN` 密码

如我将 `GH_TOKEN` 替换为上面复制的密码，对每个组织和个人创建一个 Name 所以我就将上面的 `GitHub` 替换为 GitHubLindexi 这样就可以设置上传

```csharp
nuget source Add -Name "GitHubLindexi" -Source "https://nuget.pkg.github.com/lindexi/index.json" -UserName lindexi -Password e9040b0fb3fbd0b4971660c1c04d615a630dce6e
```

接下来创建一个测试的 NuGet 包

```csharp
dotnet new console -o Lindexi_gd
```

然后编译生成 NuGet 库

```csharp
cd Lindexi_gd
dotnet pack
cd bin\Debug
```

在 `bin\Debug` 文件夹可以看到 nupkg 文件，用下面命令上传

```csharp
nuget push Lindexi_gd.1.0.0.nupkg -Source GithubLindexi
```

刷新一下页面就可以看到上传的文件

<!-- ![](images/img-Github 给仓库上传 NuGet 库4.png) -->

![](images/img-modify-eca751d854becd7f309fc305b2a3d392.png)

如果在上传的时候提示下面代码

```csharp
RepoAcceptsPackageUploads: Repository "lindexi/HehuhallqaLinearjeebar.Source" does not exist.
```

原因是要求 NuGet 库的 id 必须要在对应的 github 组织找到对应的仓库，如我上面上传 HehuhallqaLinearjeebar.Source.1.0.0.nupkg 文件，但是我没有 HehuhallqaLinearjeebar.Source 仓库，所以提示不能上传

此时可以通过在 `.nuspec` 文件添加 repository 属性，格式如下

```csharp
<repository type="git" url="https://github.com/lindexi/HehuhallqaLinearjeebar"/>
```

这样多个库可以使用相同仓库，上面代码需要写到 package 的 metadata 才能使用

```csharp
<package xmlns="http://schemas.microsoft.com/packaging/2010/07/nuspec.xsd">
    <metadata>
      <id>HehuhallqaLinearjeebar.Source</id>
      <version>1.0.3</version>
      <authors>lindexi</authors>
      <description>Sample exists only to show a sample .nuspec file.</description>
      <language>en-US</language>
      <repository type="git" url="https://github.com/lindexi/HehuhallqaLinearjeebar"/>
    </metadata>
</package>
```

如果是在 csporj 可以通过添加下面属性

```xml
    <RepositoryType>git</RepositoryType>
    <RepositoryUrl>https://github.com/lindexi/UWP</RepositoryUrl>
```

注意 RepositoryUrl 的格式是 用户名/仓库 如果自己的上传的文件是在仓库里面的文件夹，请写在 PackageProjectUrl 属性


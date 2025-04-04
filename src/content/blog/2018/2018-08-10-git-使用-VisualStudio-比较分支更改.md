---
title: "git 使用 VisualStudio 比较分支更改"
pubDatetime: 2018-08-10 11:16:52
modDatetime: 2024-08-06 12:43:31
slug: git-使用-VisualStudio-比较分支更改
description: "git 使用 VisualStudio 比较分支更改"
tags:
  - git
---




有时候需要比较两个分支的不同，这时如果提交到 github ，那么默认就可以看到。但是这时因为没有ide的高亮或者其他的功能，看起来觉得不好。
默认的 VisualStudio 比较文件比 github 的用起来好很多，那么如何使用 VisualStudio 作为代码比较？
<!-- 标签：git -->

<!--more-->


<!-- CreateTime:2018/8/10 19:16:52 -->


尝试打开一下 VS ，随意进行对比两个文件。需要找到一个工具，这个工具放在 TeamFoundation 文件夹里，我这里是 VisualStudio 2017 于是我的路径是`C:\Program Files (x86)\Microsoft Visual Studio\2017\Enterprise\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\vsDiffMerge.exe` 可以打开自己的文件夹进行搜索，找到这个软件。

然后从 cmd 打开，输入下面的代码

```csharp
vsDiffMerge.exe 文件1 文件2
```

就可以看到，软件从 VisualStudio 进行对比

![](images/img-modify-b62f0fd7cb86604e2c5b9e5add507268.jpg)

![](images/img-modify-8839279d8df90f07b7d7632cf91b7c2a.jpg)


如果使用的是 Powershell ，那么可以输入 cmd 进入命令行

可以看到对比文件很好用，那么在 git 使用的默认比较分支是`git difftool dev release` 就可以比较两个分支，但是如何使用 vs 进行比较？

使用的方法实际上只需要修改一个文件

打开 .git 的 config 在文件最后加入下面的代码

```csharp
[diff]
    tool = vsdiffmerge
[difftool]
      prompt = true
[difftool "vsdiffmerge"]
      cmd = \"C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Enterprise\\Common7\\IDE\\CommonExtensions\\Microsoft\\TeamFoundation\\Team Explorer\\vsDiffMerge.exe\" \"$LOCAL\" \"$REMOTE\" //t
      keepbackup = false
      trustexistcode = true
[merge]
      tool = vsdiffmerge
[mergetool]
      prompt = true
[mergetool "vsdiffmerge"]
      cmd = \"C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Enterprise\\Common7\\IDE\\CommonExtensions\\Microsoft\\TeamFoundation\\Team Explorer\\vsDiffMerge.exe\" \"$LOCAL\" \"$REMOTE\" //t //m
      keepbackup = false
      trustexistcode = true
```

其中的文件路径需要使用自己安装的。

如果找不到文件，可以使用在仓库的git的命令行输入下面代码

```csharp
git config --global difftool.visualstudio.cmd "'C:/Program Files (x86)/Microsoft Visual Studio/2017/Enterprise/Common7/IDE/CommonExtensions/Microsoft/TeamFoundation/Team Explorer/vsdiffmerge.exe' \$LOCAL \$REMOTE Source Target //ignorespace //t"

git config --global mergetool.visualstudio.cmd "'C:/Program Files (x86)/Microsoft Visual Studio/2017/Enterprise/Common7/IDE/CommonExtensions/Microsoft/TeamFoundation/Team Explorer/vsdiffmerge.exe' \$LOCAL \$REMOTE \$BASE \$MERGED //ignorespace //m"  
git config --global mergetool.visualstudio.trustExitCode true

git config --global diff.tool visualstudio  
git config --global merge.tool visualstudio 
```

需要修改自己的文件所在，一般可以搜索找到。

如果想使用一个简单的方法，可以打开 VisualStudio 团队设置，然后设置使用 VisualStudio 

![](images/img-modify-2535969b0b5b94f45c0933d126a55cf1.jpg)

## 忽略对比的文件夹

如果在 git 提交中，存在某个文件都是资源，在对比中，不停需要去看这些文件，感觉想把git卸了。但是git那么厉害，是不是有一个方法可以做到，忽略某个文件夹的更改。是的，下面我来告诉大家如何忽略这个文件夹。

例如需要忽略的文件是 `c:\code\dx\resource` 项目所在文件夹是`c:\code\dx`，dx就是我的名字，所以项目是假的。

使用 git 输入下面的命令就可以忽略 resource 文件夹

```csharp
git difftool relase dev -- . ':!resource'

```

这个命令需要注意，`-- . ':!要忽略的文件夹'` 除了中文，其它的都是需要添加的。


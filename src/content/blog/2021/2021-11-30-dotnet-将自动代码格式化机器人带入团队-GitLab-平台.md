---
title: "dotnet 将自动代码格式化机器人带入团队 GitLab 平台"
pubDatetime: 2021-11-30 12:36:29
modDatetime: 2024-08-06 12:43:30
slug: dotnet-将自动代码格式化机器人带入团队-GitLab-平台
description: "dotnet 将自动代码格式化机器人带入团队 GitLab 平台"
tags:
  - git
  - dotnet
---




给团队带入一个 代码格式化机器人 能提升团队的幸福度，让团队的成员安心写代码，不用关注代码格式化问题，将格式代码这个粗活交给机器人去做。同时也能减少在代码审查里撕格式化问题的时间，让更多的时间投入到更有价值的工作上
本文来告诉大家如何给团队的 GitLab 平台上带入一个自动代码格式化机器人的方法

<!--more-->


<!-- CreateTime:2021/11/30 20:36:29 -->

<!-- 发布 -->

本文所使用的工具和代码都是完全开源的，请看 [https://github.com/dotnet-campus/dotnetcampus.DotNETBuildSDK](https://github.com/dotnet-campus/dotnetcampus.DotNETBuildSDK)

我所在的团队，用的代码平台只有两个，分别是 GitHub 和 GitLab 这两个。其中 GitHub 上有 GitHub 的 Action 平台，基于此平台上，做啥都特别方便，在去年我就完成了给 GitHub 仓库配置自动代码格式化机器人，请看 [dotnet 基于 dotnet format 的 GitHub Action 自动代码格式化机器人](https://blog.lindexi.com/post/dotnet-%E5%9F%BA%E4%BA%8E-dotnet-format-%E7%9A%84-GitHub-Action-%E8%87%AA%E5%8A%A8%E4%BB%A3%E7%A0%81%E6%A0%BC%E5%BC%8F%E5%8C%96%E6%9C%BA%E5%99%A8%E4%BA%BA.html )

在咱 dotnet 里面，有官方发布的专门用于代码格式化的工具 [dotnet format](https://github.com/dotnet/format ) 工具。此工具也在 GitHub 上开源，请看 [dotnet/format: Home for the dotnet-format command](https://github.com/dotnet/format )

引入自动代码格式化机器人，相当于雇一个免费的工具人帮你不断进行 ctrl+k ctrl+d 进行格式化代码

想要在 GitLab 的仓库上引入 C# 自动代码格式化机器人，可以通过组合两个工具来实现，第一个工具是 [dotnet format](https://github.com/dotnet/format ) 工具，进行代码格式化。另一个工具是将格式化完成的代码进行推送和创建合并请求

为了方便大家使用，我编写了另一个新的工具，此工具合入了代码格式化和推送代码创建合并请求的功能，使用方法特别简单。只有一句命令行调用即可完成格式化代码和推送。此工具基于 dotnet tool 发布，大家部署起来也只需要一句话

给团队引入自动代码格式化机器人，只需要以下两句代码，分别是部署和执行

```yml
    - "dotnet tool update -g dotnetCampus.GitLabCodeFormatBot" # 安装或更新工具
    - "AutomateFormatCodeAndCreateGitLabMergeRequest -Token $Token" # 格式化代码，推送代码和创建合并请求
```

如以下代码就是我所在团队里面的 `.gitlab-ci.yml` 配置，只需要如下几句话即可自动在 dev 分支有推送的时候，自动格式化代码，然后创建一个创建合并请求

```yml
stages:
  - build

FormatCode:
  # 自动格式化代码机器人，将使用 dotnet format 格式化
  # 格式化规则参阅 .editorconfig 文件
  stage: build
  script:
    - "chcp 65001" # 解决中文乱码
    - "dotnet tool update -g dotnetCampus.GitLabCodeFormatBot" # 安装或更新工具
    - "AutomateFormatCodeAndCreateGitLabMergeRequest -Token $Token" # 格式化代码，推送代码和创建合并请求
  only:
    - dev # 只有在 dev 分支有推送时，才进行自动格式化
```

运行效果如下

<!-- ![](images/img-dotnet 将自动代码格式化机器人带入团队 GitLab 平台0.png) -->

![](images/img-modify-0f14b8a4f3e3a57d00ae79ef27c08f8c.jpg)

对于 AutomateFormatCodeAndCreateGitLabMergeRequest 命令，是支持传入丰富的参数的，参数列表如下

- `-CodeFormatBranch`: 用于给格式化代码使用的分支，默认是 t/bot/FixCodeFormatting 分支
- `-GitLabPushUrl`: 用于上传代码的 GitLab 地址，格式如 `git@gitlab.sdlsj.net:lindexi/foo.git` 地址。可选，默认将通过环境变量拼接 `git@$CI_SERVER_HOST:$CI_PROJECT_PATH.git` 地址

- `-GitLab`: GitLab 地址，如 `https://gitlab.sdlsj.net` 。可选，默认将通过环境变量获取 GitLab 的 `$CI_SERVER_URL` 变量
- `-Token`: 拥有创建 MergeRequest 的 Token 值，可在 GitLab 上的 `profile/personal_access_tokens` 生成。可选，默认将通过环境变量获取 GitLab 的 `Token` 变量。此变量需要运维手动设置才有值，详细请参阅下文
- `-ProjectId`: 将要创建 MergeRequest 的仓库项目 Id 值。可选，默认将通过环境变量获取 GitLab 的 `$CI_PROJECT_ID` 常量，也就是当前项目
- `-TargetBranch`: 将从 SourceBranch 合并到 TargetBranch 分支。可选，默认将通过环境变量获取 GitLab 的 `$CI_DEFAULT_BRANCH` 分支，也就是仓库的默认分支
- `-SourceBranch`: 将从 SourceBranch 合并到 TargetBranch 分支。可选，默认将通过环境变量获取 GitLab 的 `$CI_COMMIT_BRANCH` 分支，也就是当前 CI 正在运行分支
- `-Title`: 提交 MergeRequest 的标题。可选，默认是 "[Bot] Automated PR to fix formatting errors" 字符串

在 GitLab 上，将会在调用命令时，通过环境变量传入很多变量，因此以上的大部分可选的命令都是可以不用输入

有一点需要特别关注的是 Token 的生成，这个是需要大家自己配置的，详细请参阅 [dotnet tool 创建 GitLab 合并请求 Merge Requests 工具](https://blog.lindexi.com/post/dotnet-tool-%E5%88%9B%E5%BB%BA-GitLab-%E5%90%88%E5%B9%B6%E8%AF%B7%E6%B1%82-Merge-Requests-%E5%B7%A5%E5%85%B7.html )

如果觉得机器人默认自动格式化出来的内容不符合你的预期，没关系，自动格式化工具的格式化的配置，是依靠仓库的 `.editorconfig` 文件进行配置，更多请参阅 [.NET code style rule options - .NET](https://docs.microsoft.com/en-us/dotnet/fundamentals/code-analysis/code-style-rule-options?WT.mc_id=WD-MVP-5003260 )


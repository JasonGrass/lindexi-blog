---
title: "Sublime Text 好用的插件"
pubDatetime: 2018-10-17 02:14:40
modDatetime: 2024-05-20 08:22:03
slug: Sublime-Text-好用的插件
description: "Sublime Text 好用的插件"
---




本文告诉大家一些好用的 Sublime Text 插件

<!--more-->


<!-- CreateTime:2018/10/17 10:14:40 -->


## Git Gutter

在左边显示新建的行和修改的

请看下面的图片

![](images/img-28744712-f80ea13e-7466-11e7-96ac-51f453fb22b6.gif .png)

[jisaacks/GitGutter: A Sublime Text 2/3 plugin to see git diff in gutter](https://github.com/jisaacks/GitGutter )

## 从资源管理器打开当前的文件

通过点击 Preferences 的 Key Bindings 可以打开另一个窗口，输入下面的代码保存关掉就可以使用热键 `ctrl+alt+e` 从资源管理器打开当前的文件

```csharp
{ "keys": ["ctrl+alt+e"], "command": "open_dir", 
    "args": {"dir": "$file_path", "file": "$file_name"} }
```

如果是一个行而且后面没有 json 代码就不需要在最后添加逗号

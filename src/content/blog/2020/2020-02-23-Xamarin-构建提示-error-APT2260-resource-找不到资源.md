---
title: "Xamarin 构建提示 error APT2260 resource 找不到资源"
pubDatetime: 2020-02-23 08:43:08
modDatetime: 2024-05-20 08:22:03
slug: Xamarin-构建提示-error-APT2260-resource-找不到资源
description: "Xamarin 构建提示 error APT2260 resource 找不到资源"
tags:
  - Xamarin
---




其实这是 VisualStudio 逗比的问题，尝试关闭 VisualStudio 然后干掉 Bin 和 Obj 文件夹，然后先开启安卓模拟器，然后重新构建就可以了。如果一次重新构建失败，那么再次右击重新生成就可以了

<!--more-->


<!-- CreateTime:2020/2/23 16:43:08 -->
<!-- 标签：Xamarin -->



如果在新建一个 Xamarin 应用时，或安装了一个 NuGet 库之后，发现在构建时提示下面代码

```
2>C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\MSBuild\Xamarin\Android\Xamarin.Android.Common.Debugging.targets(420,2): warning : 发生一个或多个错误。
2>C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\MSBuild\Xamarin\Android\Xamarin.Android.Aapt2.targets(155,3): error APT2260: resource style/Theme.AppCompat.Light.Dialog (aka com.companyname.fecawjearwhalljearwugeweenere:style/Theme.AppCompat.Light.Dialog) not found.
2>G:\lindexi_gd\FecawjearwhalljearWugeweenere\FecawjearwhalljearWugeweenere\FecawjearwhalljearWugeweenere.Android\Resources\values\styles.xml(4): error APT2260: style attribute 'attr/colorAccent (aka com.companyname.fecawjearwhalljearwugeweenere:attr/colorAccent)' not found.
2>C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\MSBuild\Xamarin\Android\Xamarin.Android.Aapt2.targets(155,3): error APT2260: resource style/Theme.AppCompat.Light.DarkActionBar (aka com.companyname.fecawjearwhalljearwugeweenere:style/Theme.AppCompat.Light.DarkActionBar) not found.
2>G:\lindexi_gd\FecawjearwhalljearWugeweenere\FecawjearwhalljearWugeweenere\FecawjearwhalljearWugeweenere.Android\Resources\values\styles.xml(2): error APT2260: style attribute 'attr/windowNoTitle (aka com.companyname.fecawjearwhalljearwugeweenere:attr/windowNoTitle)' not found.
2>G:\lindexi_gd\FecawjearwhalljearWugeweenere\FecawjearwhalljearWugeweenere\FecawjearwhalljearWugeweenere.Android\Resources\values\styles.xml(2): error APT2260: style attribute 'attr/windowActionBar (aka com.companyname.fecawjearwhalljearwugeweenere:attr/windowActionBar)' not found.
2>G:\lindexi_gd\FecawjearwhalljearWugeweenere\FecawjearwhalljearWugeweenere\FecawjearwhalljearWugeweenere.Android\Resources\values\styles.xml(2): error APT2260: style attribute 'attr/colorPrimary (aka com.companyname.fecawjearwhalljearwugeweenere:attr/colorPrimary)' not found.
2>G:\lindexi_gd\FecawjearwhalljearWugeweenere\FecawjearwhalljearWugeweenere\FecawjearwhalljearWugeweenere.Android\Resources\values\styles.xml(2): error APT2260: style attribute 'attr/colorPrimaryDark (aka com.companyname.fecawjearwhalljearwugeweenere:attr/colorPrimaryDark)' not found.
2>G:\lindexi_gd\FecawjearwhalljearWugeweenere\FecawjearwhalljearWugeweenere\FecawjearwhalljearWugeweenere.Android\Resources\values\styles.xml(3): error APT2260: style attribute 'attr/colorAccent (aka com.companyname.fecawjearwhalljearwugeweenere:attr/colorAccent)' not found.
2>G:\lindexi_gd\FecawjearwhalljearWugeweenere\FecawjearwhalljearWugeweenere\FecawjearwhalljearWugeweenere.Android\Resources\values\styles.xml(4): error APT2260: style attribute 'attr/windowActionModeOverlay (aka com.companyname.fecawjearwhalljearwugeweenere:attr/windowActionModeOverlay)' not found.
2>C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\MSBuild\Xamarin\Android\Xamarin.Android.Aapt2.targets(155,3): error APT2062: failed linking references.
```

那么基本都是 VisualStudio 的逗比问题，可以通过还原 NuGet 库和删除 Bin 和 Obj 文件夹或清理项目解决。注意清理项目时不会完全删除 Obj 文件哦，我推荐先手动删除 Bin 和 Obj 文件夹，如果删除失败，那么先将项目代码复制到另一个文件夹就可以了

通过 Git 管理的代码，可以通过下面的代码快速清理 Bin 和 Obj 文件夹，这个方法的缺点是也许会将一些代码也清理掉，除非是熟悉 Git 的小伙伴，不然请不要模仿

```
git clean -xdf
```

此外，如果是 NuGet 没有还原成功，因为网络的原因，可以尝试国内的源，请看 [我收集的各种公有 NuGet 源 - walterlv](https://blog.walterlv.com/post/public-nuget-sources.html)


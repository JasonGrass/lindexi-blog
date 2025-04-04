---
title: "dotnet 使用 ToUpperInvariant 替换 ToUpper 以避免初始化 icu 过慢"
pubDatetime: 2023-08-10 04:09:28
modDatetime: 2024-08-06 12:43:29
slug: dotnet-使用-ToUpperInvariant-替换-ToUpper-以避免初始化-icu-过慢
description: "dotnet 使用 ToUpperInvariant 替换 ToUpper 以避免初始化 icu 过慢"
tags:
  - dotnet
---




在应用软件启动过程中，客户端应用软件是对性能敏感的。比如在解析命令行参数的时候，有时候需要进行字符串处理逻辑。一般来说命令行参数都是语言文化无关的，在需要进行全大写或全小写转换过程中，采用 ToUpperInvariant 替换 ToUpper 方法可以避免初始化 icu 模块，减少 icu 模块初始化过慢影响启动性能

<!--more-->


<!-- CreateTime:2023/8/10 12:09:28 -->
<!-- 标题： dotnet 提升 ToUpper 性能 -->
<!-- 发布 -->
<!-- 博客 -->

特别感谢 [lsj](https://blog.sdlsj.net) 调查此问题和 [walterlv](https://blog.walterlv.com/ ) 在 [https://github.com/dotnet-campus/dotnetCampus.CommandLine/pull/37](https://github.com/dotnet-campus/dotnetCampus.CommandLine/pull/37) 上优化命令行解析库性能

在进行 dotnet 的客户端应用启动性能分析的时候，客户端应用从逻辑上需要等待命令行参数解析完成，从而决定后续启动过程。命令行解析的性能将会影响总启动时间。在进行调查命令行解析库的性能时，发现了在命令行解析里面的某个逻辑需要对字符串转换为全大写时调用的是 ToUpper 里面传入 CultureInfo.InvariantCulture 参数方法，用来进行语言文化无关的转换大写，如以下代码

```csharp
chars[0] = char.ToUpper(chars[0], CultureInfo.InvariantCulture);
```

以上代码将会导致在启动过程中初始化 ICU 模块，而 ICU 模块的初始化是需要耗费资源的，以下是使用 dotTrace 测量的结果

<!-- ![](images/img-dotnet 使用 ToUpperInvariant 替换 ToUpper 以避免初始化 icu 过慢0-modify-a7db309cf1aceb4cd5b90029a6375067.png) -->
![](images/img-modify-7a2cc824bb9baa95b2c9d4b759d88880.jpg)

尽管 dotTrace 测量出来的 12ms 的时间是属于基本可以忽略的耗时，但是在一个以 Tick 计时的命令行解析库里面进行耗时对比，可以看到基本命令行解析所有时间都用在了 ICU 初始化上，这是不合理的

优化的方法是换成 ToUpperInvariant 从而规避 ICU 的初始化，如以下代码

```csharp
chars[0] = char.ToUpperInvariant(chars[0]);
```

为什么这两个方法的调用会有 ICU 上的差异？原因是 ToUpper 方法里面有一个初始化判断逻辑，如 dotTrace 测量的结果图，在 IsAsciiCasingSameAsInvariant 属性里面需要进入 PopulateIsAsciiCasingSameAsInvariant 方法用来判断是否在此语言文化之下，进行大小写转换和语言文化无关是相同的结果

以下是 dotnet 运行时里面对 Char 类型的 ToUpper 方法定义，可以看到实际调用的是 CultureInfo 的 TextInfo 属性提供的 ToUpper 方法

```csharp
    public readonly struct Char
    {
        public static char ToUpper(char c, CultureInfo culture)
        {
            if (culture == null)
            {
                ThrowHelper.ThrowArgumentNullException(ExceptionArgument.culture);
            }

            return culture.TextInfo.ToUpper(c);
        }
    }
```

以下是 TextInfo 的 ToUpper 核心实现逻辑，代码有部分删除。通过以下代码可以看到在 ToUpper 里面需要判断一次 IsAsciiCasingSameAsInvariant 属性。在 IsAsciiCasingSameAsInvariant 属性里面只有首次需要调用到 PopulateIsAsciiCasingSameAsInvariant 方法，此方法需要执行一次判断当前语言文化进行大小写转换时和语言文化无关情况下是相同的结果

```csharp
    public sealed partial class TextInfo 
    {
        /// <summary>
        /// Converts the character or string to upper case.  Certain locales
        /// have different casing semantics from the file systems in Win32.
        /// </summary>
        public char ToUpper(char c)
        {
            if (GlobalizationMode.Invariant)
            {
                return InvariantModeCasing.ToUpper(c);
            }

            if (UnicodeUtility.IsAsciiCodePoint(c) && IsAsciiCasingSameAsInvariant)
            {
                return ToUpperAsciiInvariant(c);
            }

            return ChangeCase(c, toUpper: true);
        }

        private bool IsAsciiCasingSameAsInvariant
        {
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            get
            {
                if (_isAsciiCasingSameAsInvariant == Tristate.NotInitialized)
                {
                    PopulateIsAsciiCasingSameAsInvariant();
                }

                Debug.Assert(_isAsciiCasingSameAsInvariant == Tristate.True || _isAsciiCasingSameAsInvariant == Tristate.False);
                return _isAsciiCasingSameAsInvariant == Tristate.True;
            }
        }

        [MethodImpl(MethodImplOptions.NoInlining)]
        private void PopulateIsAsciiCasingSameAsInvariant()
        {
            bool compareResult = CultureInfo.GetCultureInfo(_textInfoName).CompareInfo.Compare("abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", CompareOptions.IgnoreCase) == 0;
            _isAsciiCasingSameAsInvariant = (compareResult) ? Tristate.True : Tristate.False;
        }

        private Tristate _isAsciiCasingSameAsInvariant = Tristate.NotInitialized;
    }
```

虽然这里传入的是 `CultureInfo.InvariantCulture` 语言文化无关，但是 TextInfo 层不知道，还是需要跑一次 PopulateIsAsciiCasingSameAsInvariant 判断逻辑。这个判断逻辑里面需要初始化 ICU 模块

而调用 Char 的 ToUpperInvariant 则是走完全的静态的 TextInfo 的 ToUpperInvariant 方法，如以下代码


```csharp
    public readonly struct Char
    {
        public static char ToUpperInvariant(char c) => TextInfo.ToUpperInvariant(c);
    }
```

在静态的 TextInfo 的 ToUpperInvariant 方法是明确知道语言文化无关的，不需要进行任何判断逻辑，如此即可减少 ICU 模块初始化，在启动时调用的速度将会更快

```csharp
    public sealed partial class TextInfo 
    {
        internal static char ToUpperInvariant(char c)
        {
            if (GlobalizationMode.Invariant)
            {
                return InvariantModeCasing.ToUpper(c);
            }

            if (UnicodeUtility.IsAsciiCodePoint(c))
            {
                return ToUpperAsciiInvariant(c);
            }

            return Invariant.ChangeCase(c, toUpper: true);
        }
    }
```

值得一提的是本文所讲的性能差异仅仅只是在应用启动过程中有效，如果不是应用启动过程，基本上 ICU 也初始化过了，不会存在耗时问题，而且非性能敏感的逻辑也不会有如此严格的耗时要求

相同的启动问题性能优化，也在 MAUI 仓库里面执行，在 MAUI 里面引入了 [CA1311: Specify a culture or use an invariant version](https://learn.microsoft.com/en-us/dotnet/fundamentals/code-analysis/quality-rules/ca1311 ) 警告提示，意思就是如果发现代码里面写了不带语言文化的 `String.ToUpper()` 或 `String.ToLower()` 方法，将会提示换成 `ToUpper(CultureInfo)` 或 `ToUpperInvariant()` 或 `ToLower(CultureInfo)` 或 `ToLowerInvariant()` 方式减少语言文化加载性能

<!-- ![](images/img-dotnet 使用 ToUpperInvariant 替换 ToUpper 以避免初始化 icu 过慢1-modify-088bb23cfc00b77263f4e406ef1b7725.png) -->
![](images/img-modify-d8346b78e4ddd3317aa8cbcc936387f3.jpg)

如在 [.NET 8 Performance Improvements in .NET MAUI - .NET Blog](https://devblogs.microsoft.com/dotnet/dotnet-8-performance-improvements-in-dotnet-maui/ ) 博客里面提到的

> Address CA1307 and CA1309 for performance

> Profiling a .NET MAUI sample application from a customer, we noticed time spent during “culture-aware” string operations:

> 77.22ms microsoft.maui!Microsoft.Maui.Graphics.MauiDrawable.SetDefaultBackgroundColor()  
> 42.55ms System.Private.CoreLib!System.String.ToLower()

> This case, we can improve by simply calling ToLowerInvariant() instead. In some cases you might even consider using string.Equals() with StringComparer.Ordinal.

更改的代码如下

[https://github.com/dotnet/maui/pull/14627](https://github.com/dotnet/maui/pull/14627)

通过 ToLowerInvariant 和 ToUpperInvariant 转换大小写等方法代替引入语言文化相关的判断，在逻辑等价变更的情况下，可以减少启动耗时

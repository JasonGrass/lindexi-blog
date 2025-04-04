---
title: "使用 Resharper 特性"
pubDatetime: 2018-08-10 11:16:51
modDatetime: 2024-08-06 12:43:43
slug: 使用-Resharper-特性
description: "使用 Resharper 特性"
tags:
  - resharper
---




本文告诉大家如何使用 Resharper 特性，在 VisualStudio 最好的插件就是 Resharper 不过他比较卡。

<!--more-->


<!-- CreateTime:2018/8/10 19:16:51 -->

<!-- csdn -->

<!-- 标签：resharper -->
<div id="toc"></div>

因为 Resharper 无法修改编译所以他只能提示语法，不能告诉编译错误，使用下面的特性可以让Resharper提示开发者语法，一般在开发库就需要用到这些特性。

如果想使用 Resharper 特性，首先需要安装一些类。最简单方法是随便写一个类，然后继承`INotifyPropertyChanged`按 alt+Enter选择 Implement InotifyPropertyChanged ，请看下面

![](images/img-modify-e8f0ba8cace308d0d65b08bd40c098f0.jpg)

现在 Resharper 会问你是不是要在项目添加特性，点击确定

![](images/img-modify-e924e97a0902d3501f59606436980ae5.jpg)

可以看到项目有 Annotations.cs ，这个类就是特性

如果现在不希望使用这个方法，那么复制  Annotations.cs 到自己的项目，使用方法和上面一样。

## CanBeNullAttribute

表示属性或参数可能为空，返回值可能为空。

![](images/img-modify-a9066dfc2ecaeeda79bbea695d20e3f9.jpg)

使用了这个特性，就可以告诉 Resharper 在使用这个属性、参数之前需要先判断是不是空。

![](images/img-modify-487e98d7c91bd451cac8f90c5cdd94f6.jpg)

## NotNullAttribute

和上面的不同，这个表示这个参数属性不为空。但是如果是公开的接口，还是需要判断。

![](images/img-modify-1675fff041d38f82cd081322fbe2478b.jpg)

标记了参数 NotNull 是告诉调用的时候不要传入为空，函数还是需要判断传入是否空。

这个可以标记在 函数返回值和属性，如果标记为函数返回，那么这个函数一定不要返回空。

## ItemNotNullAttribute

表示一个列表的所有参数都不为空

![](images/img-modify-fa00d5a1feca7c0192879240e22fb1c6.jpg)

如果判断一个项为空，就会提示这个为true，一般用在函数返回

## ItemCanBeNullAttribute

和上面不同，表示列表可能存空的

![](images/img-modify-5eadd43209c73305769939310f703e55.jpg)

如果不判断是否空的就使用，会告诉可能这个参数异常，这个很多人都在函数返回使用

## StringFormatMethodAttribute

表示一个字符串传入的格式和 string.Format 一样

```csharp
        public void TplxwfTrrhvkorj()
        {
            TdvddnwzShbkb("lindexi的博客: {0}"); // Warning: Non-existing argument in format string
        }

        [StringFormatMethod("message")]
        private void TdvddnwzShbkb(string message, params object[] args)
        {
        }
```

如果使用这个参数写了 `{0}` 就会告诉你需要参数，如果写的数值很多，那么就会告诉你需要写多少输入。

## UsedImplicitlyAttribute

表示一个函数、属性是不被显式使用，如反射或其他方式使用，标记了这个特性就不会说接口没有被使用。

## MeansImplicitUseAttribute

让一个函数、属性不会被认为没有 unused ，标记了就会因为不被使用警告。这个特性效果和 UsedImplicitlyAttribute 差不多。

## NotifyPropertyChangedInvocatorAttribute

这个用在 WPF 的通知，表示一个函数是用来通知值更新的。这个特性用在 OnPropertyChanged ，自动帮你添加。

## ValueProviderAttribute

用来表示这个值采用哪个静态类、常量传入

```csharp
    public class Constants
    {
        public static int IntContst = 1;
        public const string StringConst = "1";
    }

    public class DlhcwtedSrhl
    {
        [ValueProvider("Constants")]
        private int _ddyHsuy;
        public void Foo([ValueProvider("Constants")] string str) { }

        public void Test()
        {
            Foo(Constants.StringConst);
            _ddyHsuy = Constants.IntContst;

        }
    }
```

## LocalizationRequiredAttribute

表示字符串需要本地化，请看代码

```csharp
    [LocalizationRequiredAttribute(true)]
    public class DwdThfck
    {
        public string TdstjxTrksfw { get; set; }
    }
```

![](images/img-modify-79ba70912c138017232aeda80680b799.jpg)

除了标记在类 LocalizationRequiredAttribute 也可以标记属性

```csharp
    public class DwdThfck
    {
        [LocalizationRequired(true)]
        public string TdstjxTrksfw { get; set; }

        public string HkmhuHgqdqhts { get; set; }
    }
```

![](images/img-modify-7877ea1ca3e422edecc55ca0a9839cdd.jpg)

## CannotApplyEqualityOperatorAttribute

使用这个特性的类，如果进行两个类的判断就会警告，但是可以进行和 null 的判断。

```csharp
    [CannotApplyEqualityOperator]
    public class DwdThfck
```

![](images/img-modify-c7ddbcac1b19516b14e80c8700fe4e56.jpg)

一般用在两个不能用来判断大小和相等的类。

## PublicAPIAttribute

表示一个接口是公开的接口，用于标记在方法和接口。

```csharp

        [PublicAPI]
        public void KvcirszdeSqdlpjwn()
```

之后就不能轻易修改这个接口命名和参数

即使一个接口现在只有内部使用，他也不会说 public can be make private 

![](images/img-modify-1bf6559e2d080b9f1891f8b9f8b6b3ef.jpg)

尝试去掉 PublicAPI 就会告诉 KqoSgqkpifef 方法没有被使用，HokwdSni 可以写为私有。

## PureAttribute

表示一个方法不会修改状态，如果不使用他的返回值，那么这个方法和没有调用是一样的。

```csharp
        public void MdrcaKxnu()
        {
            Multiply(123, 42); // Waring: Return value of pure method is not used
        }

        [Pure]
        private int Multiply(int x, int y) => x * y;
```

## MustUseReturnValueAttribute

表示返回值必须使用，而且这个特性可以添加字符串，告诉开发者为什么需要返回值

```csharp
        public void MdrcaKxnu()
        {
            Multiply(123, 42); 
        }



        [MustUseReturnValue("必须使用返回值")]
        private int Multiply(int x, int y) => x * y;
```

![](images/img-modify-a49ae2dd0189b39648f2f6450a5d7358.jpg)

## PathReferenceAttribute

字符串使用的是路径，使用这个特性参数就会在输入时提示解决方案的路径

```csharp
        public void TtmtKfqnwprgg([PathReference]string dazqkjdkSkjfa)
        {

        }
```

![](images/img-modify-d7ec90ae238da2c3211a9d19f8b5e569.jpg)

## CollectionAccessAttribute

表示函数是如何影响集合，一般用在继承几何的类的方法

需要传入 CollectionAccessType ，里面可以使用的值是

 - None 方法没有使用集合或没有影响

 - Read 方法只是读取集合

 - ModifyExistingContent 方法修改已有的元素

 - UpdatedContent 方法会修改集合

```csharp
     public class KewughzSuftoq : List<int>
    {
        [CollectionAccess(CollectionAccessType.Read)]
        public void DkuoTbolcmj()
        {

        }
    }
```

如果这时调用这个方法不使用其他就会告诉集合没有修改

```csharp
        public void TrhzeeKqmqw()
        {
            //Contents of the collection is never updated
            var dqjwdvxhTcrciidvp = new KewughzSuftoq();
            dqjwdvxhTcrciidvp.DkuoTbolcmj();
        }
```

## TerminatesProgramAttribute

表示结束程序的方法，调用这个方法在后面的代码不会被执行

```csharp
       public void KnmpDxsuhy()
        {
            KovtpgoHstwmbz();
            int n = 2;
            var str = "blog.csdn.net/lindexi_gd";

        }

        [TerminatesProgram]
        public void KovtpgoHstwmbz()
        {

        }
```

可以看到在 KovtpgoHstwmbz 后面的代码都提示不执行。

## LinqTunnelAttribute

表示这个方法是在linq链中，支持自己扩展 linq 然后使用这个特性分析中间的结果

## RegexPatternAttribute

表示字符串是正则，使用字符串出现正则提示。

这个特性只可以用在参数

## BaseTypeRequiredAttribute

用于标记在特性，表示只有基类继承某个类的才可以使用这个特性

![](images/img-modify-fb758f847ae51c43e37a6ab255da553b.jpg)

[C#/.NET 中的契约 - walterlv](https://walterlv.github.io/post/contracts-in-csharp.html#resharper-%E4%B8%AD%E5%B8%B8%E7%94%A8%E7%9A%84%E5%A5%91%E7%BA%A6-attribute )

[Code Annotation Attributes](https://www.jetbrains.com/help/resharper/Reference__Code_Annotation_Attributes.html )


---
title: "WPF UncommonField 类型是什么"
pubDatetime: 2018-03-08 08:25:02
modDatetime: 2024-05-20 08:22:03
slug: WPF-UncommonField-类型是什么
description: "WPF UncommonField 类型是什么"
tags:
  - WPF
  - .net
  - framework
  - WPF源代码
  - 源代码分析
---




本文告诉大家一个黑科技，这个黑科技在 .NET 框架外无法使用，这就是 UncommonField 类。下面将会告诉大家这个类有什么用。

<!--more-->


<!-- CreateTime:2018/3/8 16:25:02 -->

<!-- csdn -->

<!-- 标签：WPF，.net framework,WPF源代码,源代码分析 -->

如果大家有反编译 UIElement 那么就会看到下面的代码

```csharp
internal static readonly UncommonField<EventHandlersStore> EventHandlersStoreField = new UncommonField<EventHandlersStore>();
```

那么这个`UncommonField`是什么？这个类是解决`DependencyObject `使用很多内存。使用这个类可以作为轻量的`DependencyObject `因为他使用很少的内存。

因为使用了`DependencyObject `就会创建很多默认的值，无论使用的是`TextBox.Text`的依赖属性还是`Grid.Row`附加的，都会有很多不需要使用的值。但是在框架，需要使用很少的内存，所以就使用`UncommonField`。

如果使用`UncommonField`就会去掉很多元数据、校验、通知，`UncommonField`会使用和`DependencyObject `相同的机制，让他可以存放在`DependencyObject `中和其他存放的属性一样，在没有改变值的时候会使用上一级、默认的值。所以可以减少一些内存。

因为现在很少人会写出和框架一样的那么多使用依赖属性，所以就不需要使用这个功能。

下面就是`UncommonField`代码，我添加一些注释

```csharp
     //这个类可以减少内存使用，比使用 DependencyObject 少的内存，这个类在框架使用，不在外面使用
  [FriendAccessAllowed] // Built into Base, used by Core and Framework
    internal class UncommonField<T>
    {
        /// <summary>
        ///     Create a new UncommonField.
        /// </summary>
        public UncommonField() : this(default(T))
        {
        }
 
        /// <summary>
        ///     Create a new UncommonField.
        /// </summary>
        /// <param name="defaultValue">The default value of the field.</param>
        public UncommonField(T defaultValue)
        {
            _defaultValue = defaultValue;
            _hasBeenSet = false;
 
            lock (DependencyProperty.Synchronized)
            {
            	//注册方法和依赖属性相同
                _globalIndex = DependencyProperty.GetUniqueGlobalIndex(null, null);
 
                DependencyProperty.RegisteredPropertyList.Add();
            }
        }
 
        /// <summary>
        ///     从下面代码可以看到，设置值代码和依赖属性相同
        ///     Write the given value onto a DependencyObject instance.
        /// </summary>
        /// <param name="instance">The DependencyObject on which to set the value.</param>
        /// <param name="value">The value to set.</param>
        public void SetValue(DependencyObject instance, T value)
        {
        	//如果传入的值是空，会有异常
            if (instance != null)
            {
                EntryIndex entryIndex = instance.LookupEntry(_globalIndex);
 
                //设置的值如果和默认的相同，那么就直接跳过
                // Set the value if it's not the default, otherwise remove the value.
                if (!object.ReferenceEquals(value, _defaultValue))
                {
                	//下面的代码进行设置值
                    instance.SetEffectiveValue(entryIndex, null /* dp */, _globalIndex, null /* metadata */, value, BaseValueSourceInternal.Local);
                    _hasBeenSet = true;
                }
                else
                {
                    instance.UnsetEffectiveValue(entryIndex, null /* dp */, null /* metadata */);
                }
            }
            else
            {
                throw new ArgumentNullException("instance");
            }
        }
 
        /// <summary>
        ///     如果没有设置值，就从默认获取，或者上一级，方法和依赖属性相同
        ///     Read the value of this field on a DependencyObject instance.
        /// </summary>
        /// <param name="instance">The DependencyObject from which to get the value.</param>
        /// <returns></returns>
        public T GetValue(DependencyObject instance)
        {
            if (instance != null)
            {
                if (_hasBeenSet)
                {
                    EntryIndex entryIndex = instance.LookupEntry(_globalIndex);
 
                    if (entryIndex.Found)
                    {
                        object value = instance.EffectiveValues[entryIndex.Index].LocalValue;
 
                        if (value != DependencyProperty.UnsetValue)
                        {
                            return (T)value;
                        }
                    }
                    return _defaultValue;
                }
                else
                {
                    return _defaultValue;
                }
            }
            else
            {
                throw new ArgumentNullException("instance");
            }
        }
 
 
        /// <summary>
        ///     Clear this field from the given DependencyObject instance.
        /// </summary>
        /// <param name="instance"></param>
        public void ClearValue(DependencyObject instance)
        {
            if (instance != null)
            {
                EntryIndex entryIndex = instance.LookupEntry(_globalIndex);
 
                instance.UnsetEffectiveValue(entryIndex, null /* dp */, null /* metadata */);
            }
            else
            {
                throw new ArgumentNullException("instance");
            }
        }
 
        internal int GlobalIndex
        {
            get
            {
                return _globalIndex;
            }
        }
 
        #region Private Fields
 
        private T _defaultValue;
        private int _globalIndex;
        private bool _hasBeenSet;
 
        #endregion
    }
```

从上面的代码可以自己定义一个和他一样的类，用来存放比较少的属性，但是使用不多，因为现在的软件很少需要减少那么少的内存。

参见 [https://stackoverflow.com/a/18280136/6116637](https://stackoverflow.com/a/18280136/6116637)

当前的 WPF 在 [https://github.com/dotnet/wpf](https://github.com/dotnet/wpf) 完全开源，使用友好的 MIT 协议，意味着允许任何人任何组织和企业任意处置，包括使用，复制，修改，合并，发表，分发，再授权，或者销售。在仓库里面包含了完全的构建逻辑，只需要本地的网络足够好（因为需要下载一堆构建工具），即可进行本地构建



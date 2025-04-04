---
title: "WPF 已知问题 BitmapDecoder.Create 不支持传入 Asynchronous 的文件流"
pubDatetime: 2021-05-15 00:54:30
modDatetime: 2024-05-20 08:22:03
slug: WPF-已知问题-BitmapDecoder.Create-不支持传入-Asynchronous-的文件流
description: "WPF 已知问题 BitmapDecoder.Create 不支持传入 Asynchronous 的文件流"
tags:
  - WPF
  - WPF源代码
---




这是在 GitHub 上有小伙伴报的问题，在 WPF 中，不支持在调用 BitmapDecoder.Create 方法时，传入的 FileStream 是配置了 FileOptions.Asynchronous 选项的文件流。本质原因是 WIC 层不支持，和 WPF 没有关系。此问题我已修复，在 dotnet 7 或更高版本将不存在此问题

<!--more-->


<!-- CreateTime:2021/5/15 8:54:30 -->

<!-- 标签：WPF，WPF源代码 -->
<!-- 发布 -->

更新： 此问题已被我修复，合入到 dotnet 7 版本主干。在大于 .NET 7 版本下，对于在调用 BitmapDecoder.Create 方法时，传入的 FileStream 是配置了 FileOptions.Asynchronous 选项的文件流，将读取文件内容到内存，从而解决此问题。副作用是在传入的 FileStream 是配置了 FileOptions.Asynchronous 选项的文件流，将占用更多的内存

GitHub 链接： [BitmapDecoder.Create does not handle FileStream with FileOptions.Asynchronous · Issue #4355 · dotnet/wpf](https://github.com/dotnet/wpf/issues/4355 )

现象是传入 BitmapDecoder.Create 的 FileStream 配置了 FileOptions.Asynchronous 选项，代码如下

```csharp
using var fs = new FileStream("image.jpg",
	FileMode.Open,
	FileAccess.Read,
	FileShare.Read,
	4096,
	FileOptions.Asynchronous);

var decoder = BitmapDecoder.Create(fs, BitmapCreateOptions.PreservePixelFormat, BitmapCacheOption.None);
```

运行以上代码将会抛出 `ArgumentException` 而创建解码器失败

本质原因是 WIC 层不支持 FileStream 配置了 FileOptions.Asynchronous 选项。在 BitmapDecoder.Create 的底层，调用了 [IWICImagingFactory_CreateDecoderFromFileHandle_Proxy function - Win32 apps](https://docs.microsoft.com/en-us/windows/win32/wic/-wic-codec-iwicimagingfactory-createdecoderfromfilehandle-proxy?WT.mc_id=WD-MVP-5003260) 方法创建解码器，代码如下

```csharp
        public static BitmapDecoder Create(
            Stream bitmapStream,
            BitmapCreateOptions createOptions,
            BitmapCacheOption cacheOption
            )
        {
            // 忽略代码
            return CreateFromUriOrStream(
                null,
                null,
                bitmapStream,
                createOptions,
                cacheOption,
                null,
                true
                );
        }

        internal static BitmapDecoder CreateFromUriOrStream(
            Uri baseUri,
            Uri uri,
            Stream stream,
            BitmapCreateOptions createOptions,
            BitmapCacheOption cacheOption,
            RequestCachePolicy uriCachePolicy,
            bool insertInDecoderCache
            )
        {
            // 忽略代码
                decoderHandle = BitmapDecoder.SetupDecoderFromUriOrStream(
                    finalUri,
                    stream,
                    cacheOption,
                    out clsId,
                    out isOriginalWritable,
                    out uriStream,
                    out unmanagedMemoryStream,
                    out safeFilehandle
                    );
            // 忽略代码
        }

        internal static SafeMILHandle SetupDecoderFromUriOrStream(
            Uri uri,
            Stream stream,
            BitmapCacheOption cacheOption,
            out Guid clsId,
            out bool isOriginalWritable,
            out Stream uriStream,
            out UnmanagedMemoryStream unmanagedMemoryStream,
            out SafeFileHandle safeFilehandle
            )
        {
                    using (FactoryMaker myFactory = new FactoryMaker())
                    {
                        HRESULT.Check(UnsafeNativeMethods.WICImagingFactory.CreateDecoderFromFileHandle(
                            myFactory.ImagingFactoryPtr,
                            safeFilehandle,
                            ref vendorMicrosoft,
                            metadataFlags,
                            out decoder
                            ));
                    }
        }
```

也就是说最底层调用就是通过 CreateDecoderFromFileHandle 方法创建解码器，而 CreateDecoderFromFileHandle 的定义如下

```csharp
        internal static class WICImagingFactory
        {
            [DllImport(DllImport.WindowsCodecs, EntryPoint = "IWICImagingFactory_CreateDecoderFromFileHandle_Proxy")]
            internal static extern int /*HRESULT*/ CreateDecoderFromFileHandle(
                IntPtr pICodecFactory,
                Microsoft.Win32.SafeHandles.SafeFileHandle  /*ULONG_PTR*/ hFileHandle,
                ref Guid guidVendor,
                UInt32 metadataFlags,
                out IntPtr /* IWICBitmapDecoder */ ppIDecode);
        }
```

从以上代码可以看到是在 `WindowsCodecs.dll` 也就是 WIC 层的 `IWICImagingFactory_CreateDecoderFromFileHandle_Proxy` 抛出失败的

在 FileStream 创建中，如果传入了 FileOptions.Asynchronous 参数，将会在 Windows 下，调用的是 [CreateFileW function (fileapi.h) - Win32 apps](https://docs.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew?WT.mc_id=WD-MVP-5003260 ) 方法，在这个方法里面将会设置 `FILE_FLAG_OVERLAPPED` 参数。不过我没有从网上找到在设置了 `FILE_FLAG_OVERLAPPED` 参数的文件句柄将在 `IWICImagingFactory_CreateDecoderFromFileHandle_Proxy` 或 [IWICImagingFactory::CreateDecoderFromFileHandle](https://docs.microsoft.com/en-us/windows/win32/api/wincodec/nf-wincodec-iwicimagingfactory-createdecoderfromfilehandle?WT.mc_id=WD-MVP-5003260 ) 方法不支持的知识

我写了一个简单的 demo 程序，用来测试是否 FileOptions.Asynchronous 参数的文件句柄将会在 WIC 层不支持

```csharp
    class Program
    {
        static void Main(string[] args)
        {
            CheckHResult(UnsafeNativeMethods.WICCodec.CreateImagingFactory(UnsafeNativeMethods.WICCodec.WINCODEC_SDK_VERSION,
                out var pImagingFactory));

            using var fs = new FileStream("image.jpg",
                FileMode.Open,
                FileAccess.Read,
                FileShare.Read,
                4096,
                FileOptions.Asynchronous);

            Guid vendorMicrosoft = new Guid(MILGuidData.GUID_VendorMicrosoft);
            UInt32 metadataFlags = (uint)WICMetadataCacheOptions.WICMetadataCacheOnDemand;

            CheckHResult
            (
                UnsafeNativeMethods.WICImagingFactory.CreateDecoderFromFileHandle
                (
                    pImagingFactory,
                    fs.SafeFileHandle,
                    ref vendorMicrosoft,
                    metadataFlags,
                    out var decoder
                )
            );
        }

        static void CheckHResult(int hr)
        {
            if (hr < 0)
            {
                Exception exceptionForHR = Marshal.GetExceptionForHR(hr, (IntPtr)(-1));

                throw exceptionForHR;
            }
        }
    }
```

通过以上代码可以看到，如果 FileStream 的创建参数里面加上了 FileOptions.Asynchronous 那么将会在 CreateDecoderFromFileHandle 抛出错误

因此在 WPF 中，调用 BitmapDecoder.Create 方法，传入的带 FileOptions.Asynchronous 的 FileStream 抛出错误，不是 WPF 层的锅，而是 WIC 层不支持。在 GitHub 上报告的作者 [Nikita Kazmin](https://github.com/vonzshik ) 给了一个我同意的建议是 WPF 在 BitmapDecoder.Create 方法里面应该判断一下，如果传入的 FileStream 是异步的，那么在 WPF 层抛出错误，这样方便开发者了解不能这样使用

我也有另一个想法，如果是 FileStream 是异步的，不如完全读取到内存里面，这样开发者也就可以不关注这部分的逻辑。我当前将此逻辑放入到 WPF 仓库中，当前已被合入，详细请看 [https://github.com/dotnet/wpf/pull/4966](https://github.com/dotnet/wpf/pull/4966)

本文所有代码放在 [github](https://github.com/lindexi/lindexi_gd/tree/78c73fe25229f0b50992102e59c01cd535e60c31/JemlemlacuLemjakarbabo) 和 [gitee](https://gitee.com/lindexi/lindexi_gd/tree/78c73fe25229f0b50992102e59c01cd535e60c31/JemlemlacuLemjakarbabo) 欢迎小伙伴访问

当前的 WPF 在 [https://github.com/dotnet/wpf](https://github.com/dotnet/wpf) 完全开源，使用友好的 MIT 协议，意味着允许任何人任何组织和企业任意处置，包括使用，复制，修改，合并，发表，分发，再授权，或者销售。在仓库里面包含了完全的构建逻辑，只需要本地的网络足够好（因为需要下载一堆构建工具），即可进行本地构建


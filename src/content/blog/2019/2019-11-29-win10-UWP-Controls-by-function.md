---
title: "win10 UWP Controls by function"
pubDatetime: 2019-11-29 02:18:49
modDatetime: 2024-08-06 12:43:38
slug: win10-UWP-Controls-by-function
description: "win10 UWP Controls by function"
tags:
  - Win10
  - UWP
---




Windows的 XAML UI 框架提供了很多控件，支持用户界面开发库。
我现在做的一个中文版的，很多都是照着微软写，除了注释
我们先学微软做一个简单的frame，新建Page，里面放title和跳转页

<!--more-->


<!-- CreateTime:2019/11/29 10:18:49 -->


<div id="toc"></div>

```csharp
    public class page
    {
        public page()
        {
            
        }

        /// <summary>
        /// 跳转页
        /// </summary>
        public Type navigate
        {
            set
            {
                _navigate = value;
            }
            get
            {
                return _navigate;
            }
        }

        /// <summary>
        /// 页面名
        /// </summary>
        public string title
        {
            set
            {
                _title = value;
            }
            get
            {
                return _title;
            }
        }

        private Type _navigate;
        private string _title;
    }
```
我们需要把所有页放到一个类，本来这个类可以不弄，直接放 Page 列表，使用索引，最后我还是想给宝资通打广告，所以弄了一个类，本来应该叫page管理器，于是现在修改为 baozitong 。

输入title返回type 也就是页面的 Type 可以用来跳转

```csharp
       public static Type page(string title)
       {
           foreach (var temp in _page)
           {
               if (temp.title == title)
               {
                   return temp.navigate;
               }
           }
           return null;
       }
       public static List<page> _page
       {
           set;
           get;
       } = new List<page>()
       {
           new page()
           {
               title = "appbar",
               navigate = typeof(appbar)
           }
       };
```

每次添加page可以在 `baozitong._page` 添加新的页面，通过 `new page()` 的方式添加

界面是一个简单的 splitview 请看代码

```xml
        <ToggleButton Grid.Row="0" IsChecked="{Binding ElementName=split,Path=IsPaneOpen,Mode=TwoWay}" FontFamily="Segoe MDL2 Assets" Content="&#xE700;"></ToggleButton>
        <SplitView x:Name="split" Grid.Row="1" IsPaneOpen="True">
            <SplitView.Pane>
                <ListView ItemsSource="{x:Bind _page}" SelectionChanged="nagivate">
                   <ListView.ItemTemplate>
                       <DataTemplate>
                           <TextBlock Text="{Binding title}"></TextBlock>
                       </DataTemplate>
                   </ListView.ItemTemplate>
                </ListView>
            </SplitView.Pane>
                <Frame x:Name="frame" ></Frame>
        </SplitView>
```

```csharp
        private void nagivate(object sender, SelectionChangedEventArgs e)
        {
            //跳转navigate
            frame.Navigate(((sender as ListView).SelectedItem as page).navigate);
        }
```


## Appbars and commands

### App bar

用于显示应用程序特定命令的工具栏。

### App bar button

使用app bar风格按钮

一个简单的按钮

```xml
            <AppBarButton Label="按钮" HorizontalContentAlignment="Center"/>
```

![](images/img-82963283.jpg)

我们可以加上内容

```xml
            <AppBarButton Label="按钮" HorizontalContentAlignment="Center">
                <Grid Width="48" Height="48" Margin="0,-8,0,-4">
                    <SymbolIcon Symbol="Memo"/>
                    <TextBlock Text="内容" Margin="0,2,0,0" Style="{StaticResource CaptionTextBlockStyle}" HorizontalAlignment="Center"/>
                </Grid>
            </AppBarButton>
```
![](images/img-51594850.jpg)

我们可以在按钮加浮出的效果

```xml
            <AppBarButton Icon="OpenWith" Label="浮出">
                <AppBarButton.Flyout>
                    <MenuFlyout>
                        <MenuFlyoutItem Text="林德熙"/>
                        <MenuFlyoutItem Text="csdn"/>
                        <MenuFlyoutSeparator></MenuFlyoutSeparator>
                    </MenuFlyout>
                </AppBarButton.Flyout>
            </AppBarButton>
```

运行代码可以看到下面的界面

![](images/img-93606598.jpg)

![](images/img-29257708.jpg)

### App bar separator

命令栏中的命令组。

如果我们有很多按钮，我们可以使用 AppBarSeparator 进行分割

```xml
            <AppBarButton Content="林德熙"></AppBarButton>
            <AppBarSeparator></AppBarSeparator>
            <AppBarButton Content="csdn"></AppBarButton>
```

![](images/img-87280713.jpg)

 

### App bar toggle button

开关命名命令栏


### Command bar

一种专门处理命令按钮栏按钮

我们把刚才的按钮放在`<CommandBar>`

```xml
        <CommandBar>
            <AppBarButton Label="按钮" HorizontalContentAlignment="Center">
                <Grid Width="48" Height="48" Margin="0,-8,0,-4">
                    <SymbolIcon Symbol="Memo"/>
                    <TextBlock Text="内容" Margin="0,2,0,0" Style="{StaticResource CaptionTextBlockStyle}" HorizontalAlignment="Center"/>
                </Grid>
            </AppBarButton>
            
            <AppBarButton Icon="OpenWith" Label="浮出">
                <AppBarButton.Flyout>
                    <MenuFlyout>
                        <MenuFlyoutItem Text="林德熙"/>
                        <MenuFlyoutItem Text="csdn"/><!--博客没有授权红黑转载-->
                        <MenuFlyoutSeparator></MenuFlyoutSeparator>
                    </MenuFlyout>
                </AppBarButton.Flyout>
            </AppBarButton>
        </CommandBar>
```
![](images/img-32449489.jpg)

我们也看到最后的按钮，如果有按钮不是常用的，就可以放在 SecondaryCommands 进行折叠

```xml
            <CommandBar.SecondaryCommands>
                <AppBarButton Label="没有授权"/>
                <AppBarButton Label="红黑转载"/>
            </CommandBar.SecondaryCommands>
```

![](images/img-15333552.jpg)

## Buttons

### Button

响应用户输入和点击事件。

```xml
<Button Margin="72,163,0,0" Content="请勿转载"></Button>
```

![](images/img-84807449.jpg)

按钮点击可以使用`X:Bind`绑定 ViewModel 的方法

### Hyperlink

超链接

```xml
        <TextBlock HorizontalAlignment="Left" Margin="72,163,0,0" TextWrapping="Wrap"  VerticalAlignment="Top">
           <Hyperlink NavigateUri="http://blog.csdn.net/lindexi_gd"> 博客发在csdn </Hyperlink>，没有授权红黑转载，没有授权推酷转载
        </TextBlock>
```

### Repeat button

用户点击不停响应。

和 Button 不同的在于，用户按住 Repeat button 会不断触发点击的事件

## Collection/data controls

### Flip view

幻灯片播放

```xml
      <FlipView>
            <Image Source="Assets/QQ截图20160328094421.png"></Image>
            <Image Source="Assets/QQ截图20160328094435.png"></Image>
      </FlipView>
```
<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328094747930) -->

<!-- ![](images/img-win10_uwp_controls_by_function3.png) -->

![](images/img-5bfbdc74adc23.jpg)


更好看的效果请看 [分享大麦UWP版本开发历程-01.响应式轮播顶部焦点图 - 大麦胖哥 - 博客园](http://www.cnblogs.com/Damai-Pang/p/5201206.html )

### Grid view

行列布局，可以水平滚动控件。


### Items control

提供UI指定数据模板


### List view

在一个列表上的项目的集合，可以垂直或水平滚动的控件

在演示如何使用之前，先创建一个 viewmodel 用来放数据

```csharp
    public class viewmodel : notify_property
    {
        public viewmodel()
        {

        }
    }
```

如果绑定的属性列表需要在值发生添加的时候动态修改界面的列表，需要使用 ObservableCollection 获得通过[win10 uwp 通知列表](https://blog.lindexi.com/post/win10-uwp-%E9%80%9A%E7%9F%A5%E5%88%97%E8%A1%A8.html )的方法

```csharp
        public ObservableCollection<string> lindexi
        {
            set;
            get;
        } = new ObservableCollection<string>()
        {
            "林德熙",
            "csdn"
        };
```

在界面绑定 ViewModel 的属性

```xml
        <ListView ItemsSource="{x:Bind view.lindexi}">
            <ListView.ItemTemplate>
                <DataTemplate>
                    <TextBlock Text="{x:Bind }"></TextBlock>
                </DataTemplate>
            </ListView.ItemTemplate>
        </ListView>
```

<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328095934262) -->

<!-- ![](images/img-win10_uwp_controls_by_function4.png) -->

![](images/img-modify-9553e44bc65b86d56c79a9284bd6963d.png)

## Date and time controls

### Calendar date picker

日历日期选择器

![](images/img-modify-1e30edaf3331976399116b3319402a3a.png)

<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328100448795) -->

### Calendar view

日程表，让用户选择日期

<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328100619968) -->

<!-- ![](images/img-win10_uwp_controls_by_function1.png) -->

![](images/img-modify-c9f4341d52012b901f59c62ecaffc783.png)

### Time picker

用户选择一个时间

<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328100844891) -->

<!-- ![](images/img-win10_uwp_controls_by_function2.png) -->

![](images/img-modify-af850a8bf802346e807fbfe6908e1e34.png)

## Flyouts

### Flyout

这是浮出控件，简单的使用是用来显示一条消息

```xml
        <Button Margin="200,153,0,0" Content="请勿转载">
            <Button.Flyout>
                <Flyout>
                    <StackPanel>
                        <TextBlock Text="http://blog.csdn.net/lindexi_gd"/>
                    </StackPanel>
                </Flyout>
            </Button.Flyout>
        </Button>
```

![](images/img-modify-f31a01f3c1ae37d4ee38407f24da47b3.png)

<!-- ![](images/img-win10_uwp_controls_by_function0.png) -->

### Menu flyout

暂时显示命令或列出选项给用户选择

```xml
            <AppBarButton Icon="OpenWith" Label="浮出">
                <AppBarButton.Flyout>
                    <MenuFlyout>
                        <MenuFlyoutItem Text="林德熙"/>
                        <MenuFlyoutItem Text="csdn"/>
                        <MenuFlyoutSeparator></MenuFlyoutSeparator>
                    </MenuFlyout>
                </AppBarButton.Flyout>
            </AppBarButton>
```

### Popup menu

弹出自己写的菜单

### Tooltip

提示，使用方法和 Flyout 差不多

```xml
<Button Content="Button" Click="请勿转载" 
        ToolTipService.ToolTip="没有授权红黑转" />
```

## Images

### Image

图片

```xml
<Image Source="Assets/QQ截图20160328094421.png"></Image>
```
<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328102111052) -->

<!-- ![](images/img-win10_uwp_controls_by_function5.png) -->

![](images/img-modify-169febf206ffb4044ccf605c05967e4d.png)

如果需要gif的图片显示请看 http://www.songsong.org/post/2015/10/11/ImageLib.html

## Graphics and ink

### InkCanvas

```xml
<InkCanvas></InkCanvas>
```

手写

<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328104717281) -->

<!-- ![](images/img-win10_uwp_controls_by_function6.png) -->

![](images/img-modify-5d882ee1d8ba4786358c1a7824a5f8f4.png)

更多关于笔迹请看 [win10 uwp 使用油墨输入](https://blog.csdn.net/lindexi_gd/article/details/51119878 )

保存文件可以去 edi.wang 的博客看

### Shapes

椭圆,矩形、线、贝塞尔曲线路径

```xml
            <Ellipse Fill="Black" Width="100" Margin="10,10,10,10" Height="200"></Ellipse>

```

```xml
            <Rectangle Fill="Black" Width="10" Height="100" Margin="10,10,10,10"></Rectangle>

```

```xml
           <Path Stroke="Black" StrokeThickness="10">
                <Path.Data>
                    <PathGeometry>
                        <PathGeometry.Figures>
                            <PathFigure StartPoint="10,100">
                                <PathFigure.Segments>
                                    <BezierSegment Point1="100,50" Point2="150,200" Point3="200,100"></BezierSegment>
                                </PathFigure.Segments>
                            </PathFigure>
                        </PathGeometry.Figures>
                    </PathGeometry>
                </Path.Data>
            </Path>
```
<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328104402311) -->

<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328104416904) -->

<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328104446701) -->

<!-- ![](images/img-win10_uwp_controls_by_function7.png) -->

![](images/img-modify-b03faec2a34174bb4143aed22ada723f.png)

<!-- ![](images/img-win10_uwp_controls_by_function8.png) -->

![](images/img-modify-7c13382ef36cf5e0f54c7892f22242f9.png)

<!-- ![](images/img-win10_uwp_controls_by_function9.png) -->

![](images/img-modify-15dfb4ac64e84e159a30721fc8d93e13.png)


## Layout controls

### Border

边框，里面只能包含一个控件，如果包含的是 Grid 等容器就可以在容器里面放其他的控件

### Canvas

画板

里面的控件使用 Canvas 的左上角作为 (0,0) 此后使用 Margin 等计算坐标

### Grid

网格布局

可以将控件放到指定的行列，属于很常用的控件

### StackPanel

堆放布局

关于 Grid 和 StackPanel 的布局请看 [学习UWP开发-Grid和StackPanel表格布局](https://blog.csdn.net/u010168422/article/details/50998784 )

### Scroll viewer

滚动视图

```xml
            <ScrollViewer Height="20" VerticalScrollBarVisibility="Visible">
                <StackPanel Orientation="Vertical">
                    <TextBlock Text=" 林德熙"/>
                    <TextBlock Text="脑残粉"></TextBlock>
                </StackPanel>
            </ScrollViewer>
```

### Viewbox

可以改变内容的长宽

```xml
                <Viewbox Width="100">
                    <TextBlock Margin="10,10,10,10" Text="林德熙"></TextBlock>
                </Viewbox>
                <Viewbox Width="200">
                    <TextBlock Margin="10,10,10,10" Text="林德熙"></TextBlock>
                </Viewbox>
                <Viewbox Width="300">
                    <TextBlock Margin="10,10,10,10" Text="林德熙"></TextBlock>
                </Viewbox>
```

<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328105901874) -->

<!-- ![](images/img-win10_uwp_controls_by_function10.png) -->

![](images/img-modify-bb7bf02673cd5fd1c426b692e79104fa.png)

## Media controls

### Media element

播放视频

```csharp
        private async void speech(string str, MediaElement media_element)
        {
            SpeechSynthesizer synthesizer = new SpeechSynthesizer();
            SpeechSynthesisStream stream = await synthesizer.SynthesizeTextToStreamAsync(str);
            media_element.SetSource(stream, stream.ContentType);
            //http://blog.csdn.net/lindexi_gd
            media_element.Play();
        }
```

语音分析的功能需要在权限打开麦克风，上面代码是将文本读出来

<!-- ![](images/img-win10_uwp_controls_by_function11.png) -->

![](images/img-modify-2664875ade00676a5b787dcde6d3b772.png)

其实我之前用它播放音频，使用的项目请看 https://github.com/lindexi/Markdown

这个项目还有没写好，在全屏出问题，关于这个项目使用的技术请看 http://blog.csdn.net/lindexi_gd 之后找到解决将会写新的博客


### MediaTransportControls

控制播放


## Navigation

### Hub

全景视图控件

```xml
            <Hub>
                <HubSection Header="林德熙"> 
                    <DataTemplate>
                        <Image Source="Assets/QQ截图20160328094421.png"></Image>
                    </DataTemplate>
                </HubSection>
                <HubSection Header="http://blog.csdn.net/lindexi_gd">
                    <DataTemplate>
                        <Image Source="Assets/QQ截图20160328094435.png"></Image>
                    </DataTemplate>
                </HubSection>
                <HubSection Header="sharp">
                    <DataTemplate>
                        <StackPanel Orientation="Horizontal">
                            <Ellipse Fill="Black" Width="100" Margin="10,10,10,10" Height="200"></Ellipse>
                            <Rectangle Fill="Black" Width="100" Height="100" Margin="10,10,10,10"></Rectangle>
                            <Path Stroke="Black" StrokeThickness="10">
                                <Path.Data>
                                    <PathGeometry>
                                        <PathGeometry.Figures>
                                            <PathFigure StartPoint="10,100">
                                                <PathFigure.Segments>
                                                    <BezierSegment Point1="100,50" Point2="150,200" Point3="200,100"></BezierSegment>
                                                </PathFigure.Segments>
                                            </PathFigure>
                                        </PathGeometry.Figures>
                                    </PathGeometry>
                                </Path.Data>
                            </Path>
                        </StackPanel>
                    </DataTemplate>
                </HubSection>
            </Hub>
```

<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328154021083) -->

<!-- ![](images/img-win10_uwp_controls_by_function12.png) -->

![](images/img-5bfbdda364dcc.jpg)

## Progress controls

### Progress bar

进度条

进度条分为带进度的和不带进度的

```xml
 <ProgressBar Value="10" Height="100"></ProgressBar>
```
<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328154251243) -->

<!-- ![](images/img-win10_uwp_controls_by_function13.png) -->

![](images/img-modify-f45b78f53d90e56fffa1c75057a1e7b7.png)

通过设置属性 IsIndeterminate 可以设置为不带进度的进度条

```xml
        <ProgressBar Value="10" IsIndeterminate="True" Height="100"></ProgressBar>
```

<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328154439319) -->

<!-- ![](images/img-win10_uwp_controls_by_function14.png) -->

![](images/img-5bfbddd51ed7c.jpg)

### Progress ring

```xml
        <ProgressRing Width="100" IsActive="True"></ProgressRing>
```

<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328154621201) -->

<!-- ![](images/img-win10_uwp_controls_by_function15.png) -->

![](images/img-5bfbde08cbb2b.jpg)

更多进度条请看 

[win10 uwp 进度条 Marquez](https://lindexi.gitee.io/post/win10-uwp-%E8%BF%9B%E5%BA%A6%E6%9D%A1-Marquez.html )

[win10 uwp 进度条 WaveProgressControl](https://lindexi.gitee.io/post/win10-uwp-%E8%BF%9B%E5%BA%A6%E6%9D%A1-WaveProgressControl.html )

## Text controls

### Auto suggest box

```xml
       <AutoSuggestBox PlaceholderText="输入林德熙" QueryIcon="Find" Margin="10,10,10,10" TextChanged="query" DisplayMemberPath="name" ></AutoSuggestBox>


```
需要在后台写一些代码，请看 https://github.com/Microsoft/Windows-universal-samples/tree/master/Samples/XamlAutoSuggestBox

<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328161238579) -->

<!-- ![](images/img-win10_uwp_controls_by_function16.png) -->

![](images/img-modify-0a88fe75e2492c472bf854b81663d006.png)

### Password box

密码输入

```xml
        <PasswordBox Margin="10,10,10,10" Height="10" PlaceholderText="输入中文密码" IsPasswordRevealButtonEnabled="True"></PasswordBox>

```

<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328162337609) -->

<!-- ![](images/img-win10_uwp_controls_by_function17.png) -->

![](images/img-modify-d277df035ce4ce07a7ae876711128e26.png)

### Rich edit box

```xml
<RichEditBox Name="redit" Grid.Row="3" Margin="10,10,10,10" ContextMenuOpening="OnContextMenuOpening">
            <FlyoutBase.AttachedFlyout>
                <MenuFlyout>
                    <MenuFlyoutItem Text="复制" Click="OnCopy"/>
                    <MenuFlyoutItem Text="剪切" Click="OnCut"/>
                    <MenuFlyoutItem Text="粘贴" Click="OnPaste"/>
                    <MenuFlyoutSeparator/>
                    <MenuFlyoutSubItem Text="字号">
                        <MenuFlyoutItem Text="16" Tag="16" Click="OnFontSize" />
                        <MenuFlyoutItem Text="20" Tag="20" Click="OnFontSize"/>
                        <MenuFlyoutItem Text="24" Tag="24" Click="OnFontSize" />
                        <MenuFlyoutItem Text="36" Tag="36" Click="OnFontSize"/>
                        <MenuFlyoutItem Text="48" Tag="48" Click="OnFontSize"/>
                    </MenuFlyoutSubItem>
                    <!--分割-->
                    <MenuFlyoutSeparator/>
                    <ToggleMenuFlyoutItem Text="加粗" Click="OnBold" />
                    <MenuFlyoutSeparator/>
                    <MenuFlyoutSubItem Text="下划线">
                        <MenuFlyoutItem Text="无" Tag="-1" Click="OnUnderline" />
                        <MenuFlyoutItem Text="单实线" Tag="0" Click="OnUnderline"/>
                        <MenuFlyoutItem Text="双实线" Tag="1" Click="OnUnderline"/>
                        <MenuFlyoutItem Text="虚线" Tag="2" Click="OnUnderline"/>
                    </MenuFlyoutSubItem>
                    <MenuFlyoutSeparator/>
                    <MenuFlyoutSubItem Text="颜色">
                        <MenuFlyoutItem Text="黑色" Tag="黑色" Click="OnTinct"/>
                        <MenuFlyoutItem Text="蓝色" Tag="蓝色" Click="OnTinct"/>
                        <MenuFlyoutItem Text="白色" Tag="白色" Click="OnTinct"/>
                    </MenuFlyoutSubItem>
                </MenuFlyout>
            </FlyoutBase.AttachedFlyout>
        </RichEditBox>
```


### Text block

简单输出文本

```xml
        <TextBlock HorizontalAlignment="Left" Margin="72,163,0,0" Text="博客发在csdn ，没有授权红黑转载，没有授权推酷转载" TextWrapping="Wrap"  VerticalAlignment="Top" ></TextBlock>

```
<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328162542065) -->

<!-- ![](images/img-win10_uwp_controls_by_function18.png) -->

![](images/img-modify-11983730cc622c8c0d377c4d5b498770.png)

### Text box

用户输入文本

```xml
            <TextBox Margin="10,10,10,10" Height="10"></TextBox>

```

<!-- ![这里写图片描述](http://img.blog.csdn.net/20160328162825523) -->

<!-- ![](images/img-win10_uwp_controls_by_function19.png) -->

![](images/img-modify-58f1d2698433dec27886a245dc3b79f1.png)

博客：http://blog.csdn.net/lindexi_gd

现在委托csdn维权，没有授权的网站不要转载

原文 https://msdn.microsoft.com/en-us/windows/uwp/controls-and-patterns/controls-by-function

一些控件例子 https://github.com/Microsoft/Windows-universal-samples/tree/master/Samples/XamlUIBasics


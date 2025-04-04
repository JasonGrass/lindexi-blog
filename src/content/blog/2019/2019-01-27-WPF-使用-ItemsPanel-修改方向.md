---
title: "WPF 使用 ItemsPanel 修改方向"
pubDatetime: 2019-01-27 13:08:09
modDatetime: 2024-08-06 12:43:39
slug: WPF-使用-ItemsPanel-修改方向
description: "WPF 使用 ItemsPanel 修改方向"
tags:
  - WPF
---




在 WPF 很多时候都需要使用 ListView 但是默认的列表是垂直的，如果需要使用水平的，就需要使用 ItemsPanel 设置使用的类

<!--more-->


<!-- CreateTime:2019/1/27 21:08:09 -->

<!-- csdn -->

先添加一些代码到资源，下面就可以使用这里的资源

```
      <Grid.Resources>
            <XmlDataProvider x:Key="InventoryData" XPath="Books">
                <x:XData>
                    <Books xmlns="">
                        <Book ISBN="0-7356-0562-9" Stock="in" Number="9">
                            <Title>XML in Action</Title>
                            <Summary>XML Web Technology</Summary>
                        </Book>
                        <Book ISBN="0-7356-1370-2" Stock="in" Number="8">
                            <Title>Programming Microsoft Windows With C#</Title>
                            <Summary>C# Programming using the .NET Framework</Summary>
                        </Book>
                        <Book ISBN="0-7356-1288-9" Stock="out" Number="7">
                            <Title>Inside C#</Title>
                            <Summary>C# Language Programming</Summary>
                        </Book>
                        <Book ISBN="0-7356-1377-X" Stock="in" Number="5">
                            <Title>Introducing Microsoft .NET</Title>
                            <Summary>Overview of .NET Technology</Summary>
                        </Book>
                        <Book ISBN="0-7356-1448-2" Stock="out" Number="4">
                            <Title>Microsoft C# Language Specifications</Title>
                            <Summary>The C# language definition</Summary>
                        </Book>
                    </Books>
                </x:XData>
            </XmlDataProvider>
        </Grid.Resources>
```

添加一个 ListView 然后通过 ItemTemplate 设置界面

```
       <ListView ItemsSource="{Binding Source={StaticResource InventoryData}, XPath=Book}">
            <ListView.ItemTemplate>
                <DataTemplate>
                    <Grid Background="#5a5a5a" Margin="10,10,10,10">
                        <StackPanel Margin="2,2,2,2">
                            <TextBlock Text="{Binding XPath=Title}" />
                            <TextBlock Text="{Binding XPath=@ISBN}" />
                        </StackPanel>
                    </Grid>
                </DataTemplate>
            </ListView.ItemTemplate>
        </ListView>
```

这里的 DataTemplate 传入的 DataContext 就是 ItemsSource 绑定的列表的每一项

如绑定了 List<Foo> 那么这里的 DataContext 就是 Foo 类

于是在这里就可以通过绑定 DataContext 的属性绑定界面

上面代码运行可以看到列表是垂直的

<!-- ![](images/img-WPF 使用 ItemsPanel 修改方向0.png) -->

![](images/img-modify-987dbdf4527206e9ddff76d8810ff4ac.png)

如果需要修改为水平的，可以通过 ItemsPanel 修改

```
            <ListView.ItemsPanel>
                <ItemsPanelTemplate>
                    <StackPanel Orientation="Horizontal" />
                </ItemsPanelTemplate>
            </ListView.ItemsPanel>
```

<!-- ![](images/img-WPF 使用 ItemsPanel 修改方向1.png) -->

![](images/img-modify-d776507bdc3b883e33c9e1dbce940df7.png)

代码全部都在 xaml 写，因为神树说在后台写不好

```
    <Grid>
        <Grid.Resources>
            <XmlDataProvider x:Key="InventoryData" XPath="Books">
                <x:XData>
                    <Books xmlns="">
                        <Book ISBN="0-7356-0562-9" Stock="in" Number="9">
                            <Title>XML in Action</Title>
                            <Summary>XML Web Technology</Summary>
                        </Book>
                        <Book ISBN="0-7356-1370-2" Stock="in" Number="8">
                            <Title>Programming Microsoft Windows With C#</Title>
                            <Summary>C# Programming using the .NET Framework</Summary>
                        </Book>
                        <Book ISBN="0-7356-1288-9" Stock="out" Number="7">
                            <Title>Inside C#</Title>
                            <Summary>C# Language Programming</Summary>
                        </Book>
                        <Book ISBN="0-7356-1377-X" Stock="in" Number="5">
                            <Title>Introducing Microsoft .NET</Title>
                            <Summary>Overview of .NET Technology</Summary>
                        </Book>
                        <Book ISBN="0-7356-1448-2" Stock="out" Number="4">
                            <Title>Microsoft C# Language Specifications</Title>
                            <Summary>The C# language definition</Summary>
                        </Book>
                    </Books>
                </x:XData>
            </XmlDataProvider>
        </Grid.Resources>

        <ListView ItemsSource="{Binding Source={StaticResource InventoryData}, XPath=Book}">
            <ListView.ItemsPanel>
                <ItemsPanelTemplate>
                    <StackPanel Orientation="Horizontal" />
                </ItemsPanelTemplate>
            </ListView.ItemsPanel>

            <ListView.ItemTemplate>
                <DataTemplate>
                    <Grid Background="#5a5a5a" Margin="10,10,10,10">
                        <StackPanel Margin="2,2,2,2">
                            <TextBlock Text="{Binding XPath=Title}" />
                            <TextBlock Text="{Binding XPath=@ISBN}" />
                        </StackPanel>
                    </Grid>
                </DataTemplate>
            </ListView.ItemTemplate>
        </ListView>
    </Grid>
```

代码 https://gitee.com/lindexi/lindexi_gd/blob/68cefabd097bf2f4fc35e3384f34e1dc622a67ad/PotrallTiscawMouger/PotrallTiscawMouger/MainWindow.xaml

![](images/img-modify-80e37006a11acf6f855b1f88a2e198a2.png)


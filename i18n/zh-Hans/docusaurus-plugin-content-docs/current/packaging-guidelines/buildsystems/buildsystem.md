---
id: buildsystem
title: 声明式构建系统
description: 这篇文章介绍了声明式构建系统。
slug: /guide/packaging-guidelines/BuildSystems
---

# 声明式构建系统

大多数软件在构建的时候都遵循通用的模式，例如经典的 `./configure && make && make install` 流程。在 RPM 的 `spec` 文件中，这些步骤通常需要分别放入各自的部分 (section)，再加上解压源码的步骤，会导致产生大量的样板代码 (boilerplate)，这些代码在许多 spec 文件中几乎完全相同，仅仅是偶尔为了适应发行版的偏好或其他细节做些微调。

为了减少这种重复的样板代码，openRuyi 推荐在打包时使用 RPM 4.20 及以上版本支持的新特性——声明式构建系统机制。通过该机制，可以针对每种构建系统集中定义这些通用步骤。打包时只需声明他们使用哪种构建系统，并在需要时为特定步骤提供额外的开关和参数即可。

## 用法

在最简单的情况下，spec 文件只需要包含一个构建系统声明字段，例如 `BuildSystem: autotools`。

不过，需要手动微调的情况也是比较常见的。通常，有两种方法可以实现这一点。

### 前置或追加

打包者可以根据需要使用前置和追加操作。

* 例如，需要在构建步骤前需要初始化环境变量时，可以添加 `%build -p`， 并在里面编写相应步骤。其中 `-p` 表示 prepend，即插入在自动生成的脚本之前。

* 或者，需要在安装步骤后删除某个文件时，可以添加 `%install -a`，并在里面编写相应的步骤。其中 `-a` 表示 append，即追加在自动生成的脚本之后。

### 传递额外参数

如果想传递构建配置等参数的话，那么可以通过 `BuildOption` 标签来实现。该标签的语法为：`BuildOption(<section>):  <option string>`。

该标签可以在 spec 文件中针对每个部分出现任意多次。例如:

```specfile
BuildOption(conf):  --enable-zsh-secure-free
BuildOption(conf):  --enable-gdbm
BuildOption(build):  all info html
BuildOption(install):  install.info
BuildOption(install):  fndir=%{_datadir}/%{name}/functions
BuildOption(install):  runhelpdir=%{_datadir}/%{name}/help
```

请注意，冒号 (`:`) 与后面的选项参数之间需要有两个空格。

虽然语法上可以省略 BuildOption 后的构建阶段名称，但我们需要打包者写明。

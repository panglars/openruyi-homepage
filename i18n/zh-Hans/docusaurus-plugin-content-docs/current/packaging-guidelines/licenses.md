---
id: licenses
title: 许可证
description: 这个文档讲述了 openRuyi 的许可证机制。
slug: /guide/packaging-guidelines/Licenses
---

# 许可证

这个文档讲述了 openRuyi 的许可证机制。

## 许可证文本

如果源码包在其自己的文件中包含了许可证的文本，那么该文件 (包含软件包许可证的文本) 必须在 `%files` 列表中使用 `%license` 指令进行标记并包含在内。

请注意，如此标记的路径可以是相对路径也可以是绝对路径。对于相对路径，RPM 将自动将它们从源目录复制到 `%_defaultlicensedir` (`/usr/share/licenses`) 的一个子目录中。对于绝对路径，RPM 将简单地在最终软件包中将该文件标记为许可证文件。

另请注意，许可证文件在一个以编程方式生成并使用 `%files -f` 包含的列表中被如此标记是可接受的。这种标记通常由宏自动完成，打包者并不能直接看到。当使用 `rpm -q --licensefiles` 时，软件包中包含的所有相关许可证文件都会显示出来。

## 子软件包

如果一个子软件包 (无论是隐式还是显式地) 依赖于一个基础软件包 (基础软件包定义为来自同一源 RPM、且包含了适当的许可证文本作为 `%license` 的最终二进制包)，那么该子软件包没有必要也包含那些许可证文本作为 `%license`。

然而，如果一个子软件包独立于任何基础软件包 (它不依赖于基础包，无论是隐式的还是显式的)，它必须包含适用于该子软件包内所含文件的任何许可证文本的副本 (如同在源码中存在的那样)。

## License: 字段

每个 spec 文件都必须包含一个 `License` 字段，在填写 `License` 字段时必须尽一切可能做到准确。

`License` 字段必须使用适当的 [SPDX 许可证标识符](https://spdx.org/licenses/)或表达式来填写。

### 基本规则

除非软件包包含多个二进制子软件包，并且打包者选择指定，否则，`License` 字段的表达式应该是对软件包源代码中发现的所有许可证的枚举，但要排除那些仅涵盖源代码中未被复制到二进制 RPM 中的内容 (无论是逐字复制还是以某种方式转换，例如通过编译) 的许可证。

#### 简单的情况

`wayland-utils` 软件包的源代码完全基于 `MIT` 许可证。其 `License` 字段为:

```specfile
License:        MIT
```

#### 复杂一点的情况

`plasmatube` 软件包包含的可执行代码，其源代码主要基于 `GPL-3.0-or-later` 编译而来，尽管有一个被编译的源文件是基于 `GPL-2.0-or-later` 的。它还包含一个 `appdata.xml` 文件，该文件声明基于 `CC0-1.0` (我们假设此文件受版权保护)，以及一个基于 `CC-BY-SA-4.0` 的 SVG 文件。其 `License` 字段为:

```specfile
License:        GPL-3.0-or-later AND GPL-2.0-or-later AND CC0-1.0 AND CC-BY-SA-4.0
```

#### 未包含在二进制 RPM 中的源码包文件

那些仅涵盖源代码中未被复制到二进制 RPM 的文件的许可证，应从 `License` 字段中排除。以 `xmodmap` 软件包为例：

构成 `xmodmap` 二进制 RPM 的可执行文件和 man 手册页，是 `xmodmap` 源代码中基于 `MIT` 和 `MIT-open-group` 许可证的文件的转换产物。然而，`xmodmap` SRPM 中的源码 tarball 包含许多 Automake、Autoconf 和其他与构建相关的文件，这些文件部分地涵盖在多种其他许可证之下。由于这些文件均未被复制到二进制 RPM 中，相应的许可证不应包含在 `License` 字段里。因此 `License` 字段仅为:

```specfile
License:        MIT AND MIT-open-group
```

### Perl 模块包的特殊规则

因为许多 Perl 模块都简单地声明它们的许可证跟 Perl 5 一样，而 Perl 5 又是在一个双重许可证下发布的，该许可证可以用 SPDX 表达式表示为 `GPL-1.0-or-later OR Artistic-1.0-Perl`。

### 公有领域

如果碰到 Public Domain 也就是公有领域的软件包，如果上游代码只是简单地声明“此代码处于公共领域”(This code is in the public domain)，而没有使用像 CC0 这样的正式法律工具，那么可以这样编写 `License` 字段:

```specfile
License:        LicenseRef-openRuyi-Public-Domain
```

如果上游项目明确使用了 "Creative Commons Zero" (CC0) 来将其作品奉献给公共领域，那么应该在 `License` 字段使用其官方的 SPDX 标识符:

```specfile
License:        CC0-1.0
```

如果作者明确使用了 Unlicense 模版，则应该这样编写 `License` 字段:

```specfile
License:        Unlicense
```

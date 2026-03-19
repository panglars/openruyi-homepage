---
id: spdx
title: SPDX 许可证表达式
description: SPDX (Software Package Data Exchange，软件包资料交换规范) 是一种用于交流与软件包相关的组件和元数据信息的标准格式。
slug: /legal/spdx
---

# SPDX 许可证表达式

SPDX (Software Package Data Exchange，软件包资料交换规范) 是一种用于交流与软件包相关的组件和元数据信息的标准格式。

## SPDX 许可证表达式的类型

### SPDX 许可证列表标识符

通常称为“SPDX 标识符”，这些是 SPDX 许可证列表中包含的简称标识符。例如：`MIT`，`GPL-2.0-or-later`。

### 自定义许可证标识符 (`LicenseRef-`)

可以使用 `LicenseRef-` 前缀来构成一个自定义的许可证标识符 (即未包含在 SPDX 许可证列表中的标识符)。请注意，SPDX 目前没有针对 `LicenseRef-` 标识符的官方命名空间系统。

### `WITH` 表达式

一个复合的 SPDX 表达式可以通过在一个 SPDX 标识符后跟随 `WITH` 运算符，然后再跟随一个 中包含的例外标识符来构成。这旨在表示对一个许可证授权的补充，增加了许可性的例外或附加权限，这种情况最常发生在 GPL 系列的许可证中。一些例子：`GPL-2.0-or-later WITH Autoconf-exception-generic`，`Apache-2.0 WITH LLVM-exception`。

### `OR` 表达式

一个复合的 SPDX 表达式可以通过使用 `OR` 运算符连接两个 SPDX 表达式来构成。这旨在表示一种许可证的选择。在自由和开源软件 (FOSS) 中，恰好两种许可证的选择通常被称为“双重许可” (dual licensing)，尽管该术语有时也用于指代不同的概念。例子：`Apache-2.0 OR MIT` (Rust crates 许可的一种常见形式)，`MPL-1.1 OR GPL-2.0-or-later OR LGPL-2.1-or-later` (历史上称为 Mozilla 三重许可证)。

### `AND` 表达式

一个复合的 SPDX 表达式可以通过使用 `AND` 运算符连接两个 SPDX 表达式来构成。这通常表示两个子表达式分别适用于一个文件或软件包的不同部分。例子：`LGPL-2.1-or-later AND GPL-2.0-or-later AND MIT`。

### `+` 运算符

应用于 SPDX 标识符的后缀 `+` 运算符表示允许使用该许可证的更高版本。例子：`LPPL-1.3a+`。

应自由软件基金会 (FSF) 的要求，SPDX 已不推荐将 `+` 与 GPL 系列许可证标识符一起使用，而是倾向于使用 `-only` 和 `-or-later` 的标识符变体 (例如，`GPL-2.0-only` 和 `GPL-2.0-or-later`)。

## SPDX 匹配准则

SPDX 许可证列表标识符是模板 (在维护的 [license-list-XML](https://github.com/spdx/license-list-XML/tree/main/src) 仓库的 XML 文件中指定)。许多 XML 文件利用了正则表达式，并将许可证文本的部分指定为可选的。在 [SPDX 规范](https://spdx.github.io/spdx-spec/latest/annexes/license-matching-guidelines-and-templates/)所含的匹配准则中详细定义的意义上，多个许可证文本可能匹配同一个 SPDX 标识符。并非所有的匹配准则都在 XML 文件中实现了。

在使用 SPDX 标识符和 `LicenseRef-` 标识符时，openRuyi 旨在应用 SPDX 匹配准则。


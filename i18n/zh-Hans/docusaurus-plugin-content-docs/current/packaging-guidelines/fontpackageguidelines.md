---
id: fontpackageguidelines
title: 字体打包指南
description: 这个文档讲述了 openRuyi 的字体打包指南。
slug: /guide/packaging-guidelines/FontPackagingGuidelines
---

# 字体打包指南

这个文档讲述了 openRuyi 的字体打包指南。

## 包命名

所有字体包的命名都应被命名为 `fonts-fontname`。其中 `fontname` 为字体的规范标识名 (canonical name)。 这个名字可以参考字体文件的 OpenType name table (Family/Typographic Family)，但若与上游项目名冲突时，则优先用上游项目名。

如果上游项目自身长期使用某一种缩写，或在 Linux 生态中已形成事实标准，并且缩写不易与其他字体项目冲突的情况，则允许进行缩写，例如 `WenQuanYi` 可被缩写为 `wqy`，故包名为 `fonts-wqy`。

## 许可证

永远记住：禁止打包不能再分发的专有字体。在引入字体包时，应优先考虑 OFL/GPL 等许可证的字体。

## 构建

在打包时，如果上游提供了源代码包，应当从源码构建字体文件。如不能从源码构建字体文件，则可以直接使用上游提供的字体压缩包。

如果上游压缩包内发布的字体不属于同一个字体家族，那么它们必须分开为不同的字体包。

## 安装位置

系统级别的字体应统一安装至 `%{_datadir}/fonts` 目录内，并按照容器类别进行分类:

* OpenType TT (`*.ttf`/`*.ttc`) 应安装至 `%{_datadir}/fonts/truetype` 目录内。

* OpenType CFF/CFF2 (`*.otf`/`*.otc`) 应安装至`%{_datadir}/fonts/opentype` 目录内。

fontconfig 默认扫描路径下会递归扫描并维护缓存，所以这种分层不会影响发现。

### 位图字体

位图字体分两类处理，其中后者在非必要下不应打包:

* 面向现代 fontconfig/Xft 的 OpenType 位图格式 (`*.otb`) 应安装至 `%{_datadir}/fonts/misc` 目录内。如果需要一并安装确有需要的 X11 位图格式 (`*.pcf`) / (`*.bdf`) 文件，可放置在同一目录下。

* 面向 legacy Core X11 fonts (XLFD) 的位图格式 (`*.pcf`) 需要先通过 gzip 压缩，然后按分辨率安装至 `%{_datadir}/fonts/X11/100dpi/`、`%{_datadir}/fonts/X11/75dpi/`，低分辨率/等宽格子字体安装至 `%{_datadir}/fonts/X11/misc/`。如果字体格式为 `*.bdf`，需要转换为 `*.pcf`。

  * 默认不应依赖 legacy 字体，也不应预装。

### Type1

Type 1 (`*.pfa`/`*.pfb`) 作为遗留格式，虽然依然受到 FreeType 的支持，但不少现代应用已逐步放弃支持，如果上游同时提供 OpenType TT 或者 CFF/CFF2，则应优先打包 OpenType 版本。在有必要打包时，应安装至 `%{_datadir}/fonts/type1` 目录内。如果字体提供指标文件 (`*.afm`)，则需要一并打包进目录内。

### 例外

Linux 的控制台字体 (`*.psf`) 和 Web 字体 (`*.woff`/`*.woff2`) 不应该被安装在 fontconfig 能发现的目录下。尤其是后者，WOFF 规范明确说"不建议把 WOFF 当作桌面可安装字体格式"。

* 控制台字体 (`*.psf`) 应安装至 `%{_datadir}/consolefonts` 目录下。

* Web 字体 (`*.woff`) 应安装至 `%{_datadir}/webfonts` 目录下。

## 子包拆分和命名

如果存在多个字体格式，则字体包的主包应该作为元包，不直接提供字体文件。可按如下推荐进行拆包:

* `fonts-fontname-vf` (变量字体): 放 VF 的字体文件，通常为 `.ttf` 或 `.otf` 的 VF。

  * 同时，在元包内可以编写 `Requires: fonts-fontname-vf`。

* `fonts-fontname-static` (静态字体): 放非 VF 的字体文件，通常为 `.ttf` 或 `.otf` 的非 VF。

  * 有些时候，上游也会只提供集合文件 (`*.ttc`/`*.otc`)，此时可以将子包命名为 `fonts-fontname-ttc` 或 `fonts-fontname-otc`。

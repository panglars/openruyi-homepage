---
id: languagesperl
title: Perl
description: 这个文档讲述了 openRuyi 的 Perl 模块打包指南。
slug: /guide/packaging-guidelines/languages/Perl
---

# Perl 打包指南

这个文档讲述了 openRuyi 的 Perl 模块打包指南。

## 包命名

Perl 模块包的包名应被命名为 `perl-CPANDIST`，其中 `CPANDIST` 是所打包的 CPAN 模块发行版的名称。

在极少数情况下，如果一个 CPAN 模块发行版因为依赖关系等原因需要被拆分成更小的子包，那么额外的子包**应**被命名为 `perl-CPANDIST-Something`。

示例：

* `perl-Archive-Zip` (Archive-Zip 是 CPAN 发行版名称)

* `perl-Cache-Cache` (Cache-Cache 是 CPAN 发行版名称)

## License 标签

因为许多 Perl 模块都简单地声明它们的许可证跟 Perl 5 一样，而 Perl 5 又是在一个双重许可证下发布的，该许可证可以用 SPDX 表达式表示为 `GPL-1.0-or-later OR Artistic-1.0-Perl`。

## URL 标签

对于基于 CPAN 的包，`URL` 标签应使用一个非版本化的 `metacpan.org` URL。例如，如果打包 `Net::XMPP` 模块，URL 应为:

```specfile
URL:            https://metacpan.org/release/Net-XMPP
```

## 构建依赖

以下是您可能需要的一些 Perl 相关的构建依赖项列表。

* `perl-devel` - 提供 Perl 头文件。如果构建链接到 `libperl.so` 库的特定于架构的代码（例如 XS Perl 模块），则必须包含 `BuildRequires: perl-devel`。

* `perl-macros` - 提供打包 Perl 模块所需的一系列 RPM 宏。这些宏定义了标准安装路径（如 `%perl_vendorarch`, `%perl_vendorlib`）和辅助函数（如 `%perl_gen_filelist`, `%perl_requires`）。在打包 Perl 模块时，必须包含 `BuildRequires: perl-macros` 以确保 spec 文件能正确解析和使用这些专有宏。

如果在构建时需要特定的 Perl 模块，请使用 `perl(MODULE)` 格式。这也适用于 Perl 本身提供的核心模块，因为它们可能会随着时间推移在基础 Perl 包中移入或移出。

## Requires 和 Provides 标签

同样的，在编写 Requires 和 Provides 的时候，也需使用 `perl(MODULE)` 格式，而不是直接依赖包名。例如，一个需要 Perl 模块 `CPANDIST` 的包不应显式地需要 `perl-CPANDIST`，而应需要的是 `perl(CPANDIST)`，因为 `perl-CPANDIST` 包会提供这个依赖。

## 文件目录

通常，一个架构无关 (noarch) 的 Perl 模块包必须包含:

```specfile
%{perl_vendorlib}/*
```

而一个架构有关 (arch-specific) 的 Perl 模块包必须包含:

```specfile
%{perl_vendorarch}/*
```

## 模块包中的 .h 文件

如果一个 Perl 模块包含 `.h` 文件的话，这些文件不应被拆分到 `-devel` 子包中。

## 自动化引入

openRuyi 目前有一个将 CPAN 软件包引入的小工具 cpan2spec。这个小工具是基于 Steven Pritchard 的 cpanspec 修改的，以适应 openRuyi 的需求。对此表示感谢。

例如，要打包 Perl 模块 `IO::String`:

```specfile
perl ./cpan2spec IO-String
```

`cpanspec` 将从 CPAN 下载 tar 压缩包，对其进行分析后首先会创建 `library-perl` 文件夹，随后在该文件夹下创建以 `perl-IO-String` 为名称的文件夹，并在文件夹内生成同名的 spec 文件。

目前这个小工具对于 License 解析还有一些问题，如果出现这种情况时，小工具会输出对应的信息，请手动查询并修改 License 信息。

## 用于 Perl 模块的 RPM 宏

这里包含了一些常用的用于 Perl 模块 RPM 宏。

### %perl_sitearch

此宏的路径代表管理员/本机用 CPAN 安装的与架构有关的库，路径为 `/usr/local/lib/perl5`。

### %perl_sitelib

此宏的路径代表管理员/本机用 CPAN 安装的与架构无关的库，路径为 `/usr/local/share/perl5`。

### %perl_vendorarch

此宏的路径代表 openRuyi 打包提供的与架构有关的库，路径为 `/usr/lib/perl5/vendor_perl`。

### %perl_vendorlib

此宏的路径代表 openRuyi 打包提供的与架构无关的库，路径为 `/usr/share/perl5/vendor_perl`。

### %perl_archlib

此宏的路径代表 Perl 自带的与架构有关的核心库，路径为 `/usr/lib/perl5`。

### %perl_privlib

此宏的路径代表 Perl 自带的与架构无关的核心库，路径为 `/usr/share/perl5`。

### %perl_make_install

此宏会正确地执行 `make install` 调用。

### %perl_process_packlist and %perl_gen_filelist

此宏为最终的文件打包阶段准备一些与 Perl 模块相关的文件。如果使用这个宏的话，则可以直接在 `%files` 章节中使用 `-f %{name}.files`。

例如:

```specfile
%install
%perl_make_install
%perl_process_packlist
%perl_gen_filelist

%files -f %{name}.files
%doc Changes README
```

不过，`%perl_gen_filelist` 并不会搜集未安装的文件。

### %perl_version

此宏为当前 Perl 的版本号，例如 `5.43.2`。

### %perl_requires

此宏通常在需要依赖当前 Perl 版本时使用。

### %__perl

此宏为系统中安装的 perl 可执行文件的名称。

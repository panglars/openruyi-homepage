---
id: languagespython
title: Python
description: 这个文档讲述了 openRuyi 的 Python 模块打包指南。
slug: /guide/packaging-guidelines/languages/Python
---

# Python 打包指南

这个文档讲述了 openRuyi 的 Python 模块打包指南。

## 命名

Python 库的软件包，其名称必须以 `python-` 为前缀。

## 依赖关系

软件包不应该对 `python3` 有显式的运行时依赖，在以下情况会自动依赖:

* 当它们向 `%{python3_sitelib}` 或 `%{python3_sitearch}` 安装文件时，会自动依赖 `python(abi) = 3.X`。

* 如果它们有可执行的 Python 脚本，会自动依赖 `/usr/bin/python3`。

### BuildRequires: python3-devel

使用 Python 和/或安装 Python 模块的每一个软件包，必须在 spec 内添加 `BuildRequires: pkgconfig(python3)`，即使在构建时并未实际调用 Python。

### Provides: python3-DISTNAME

因为在 openRuyi 中，不将 python3 作为子包拆分，而是直接在主包中提供，故应该在 spec 中加入:

```specfile
Provides:       python3-DISTNAME
%python_provide python3-DISTNAME
```

## 用于 Python 模块的 RPM 宏

这里包含了一些常用的用于 Python 模块 RPM 宏。

### 构建宏

#### %pyproject_buildrequires

此宏用于 `spec` 文件的 `%generate_buildrequires` 部分，为软件包生成 BuildRequires。

#### %pyproject_wheel

此宏用于构建软件包。通常，这是 `%build` 部分中唯一需要的宏。 此宏需要由 `%pyproject_buildrequires` 生成的 BuildRequires。

#### %pyproject_install

此宏用于安装由 `%pyproject_wheel` 构建的软件包。此宏需要由 `%pyproject_buildrequires` 生成的 BuildRequires。

#### %pyproject_save_files

此宏用于生成与给定可导入模块相对应的文件列表，并将其保存为 `%{pyproject_files}`。生成的列表不包括 README 文件。当 LICENSE 文件在 metadata 中指定时，它会被包含在内。

#### %pyproject_files

此宏为由 `%pyproject_save_files` 写入的文件的路径。使用范例:

```specfile
%files -n python3-DISTNAME -f %{pyproject_files}
```

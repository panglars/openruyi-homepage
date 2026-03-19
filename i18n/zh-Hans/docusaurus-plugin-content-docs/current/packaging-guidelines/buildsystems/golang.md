---
id: buildsystemgolang
title: Golang
description: 这个文档讲述了在 openRuyi 打包时，如何使用名为 golang 和 golangmodules 的声明式构建系统。
slug: /guide/packaging-guidelines/BuildSystems/golang
---

# Golang

这个文档讲述了在 openRuyi 打包时，如何使用名为 `golang` 和 `golangmodules` 的声明式构建系统。

通常来说，Go 语言的库包可用自动化工具生成大部分的内容，不需要人工编写。

## 依赖

如需要使用 `golang` 或 `golangmodules` 构建系统，那么需要添加这些 `BuildRequires`。

```specfile
BuildRequires:  go
BuildRequires:  go-rpm-macros
```

## 使用需要什么宏

至少应该在头部定义 `_name` 和 `go_import_path`。前者通常为 Go 库的名称，后者通常为 Go 库的导入路径。

## 示例

无论是 `golang` 还是 `golangmodules` 构建系统，都可直接使用通用的准备 (`%prep`) 配置:

```specfile
BuildOption(prep):  -n %{_name}-%{version}
```

### 仅打包库

通常来说，因为库打包不需要编译，`golangmodules` 构建系统内已经包含安装 (`%install`) 和测试 (`%check`)配置。

如果需要添加测试参数，可以用以下的配置:

```specfile
BuildOption(check):  -vet=off -short
```

### 打包二进制+库

打包时可根据实际情况使用 `golang` 或 `golangmodules` 构建系统。如果想在使用一个构建系统时使用另一个构建系统的内容，可直接进行调用。例如在打包该类软件包时使用 `golangmodules` 构建系统，但需要编译和安装二进制时:

```specfile
# Build binaries for tools
%build
%go_common
cd %{_builddir}/go/src/%{go_import_path}
go install -trimpath -v -p %{?_smp_build_ncpus} ./cmd/...

# Install binaries for tools
%install -a
install -d %{buildroot}%{_bindir}
install -m 0755 %{_builddir}/go/bin/* %{buildroot}%{_bindir}/
```

反之，如果在打包该类软件包时使用 `golang` 构建系统，但需要安装 Go 库源码时:

```specfile
# This is for the source package
%install -a
%buildsystem_golangmodules_install
```

## 构建系统宏说明

Go 语言的两个构建系统宏为 `/usr/lib/rpm/macros.d/macros.buildsystem.golang` 和 `/usr/lib/rpm/macros.d/macros.buildsystem.golangmodules`。

---
id: pkgconfigbuildrequires
title: 使用 pkgconfig(xxx)
description: 这个文档讲述了 openRuyi 对于 BuildRequires 字段处的软件包开发库名称编写策略。
slug: /guide/packaging-guidelines/PkgConfigBuildRequires
---

# 使用 pkgconfig(xxx)

这个文档讲述了 openRuyi 对于 `BuildRequires` 字段处的软件包开发库名称编写策略。

如果使用 `pkg-config` 来构建某软件包所依赖的库 `foo` 时，则应该将其构建依赖正确地表述为 `pkgconfig(foo)`。

## 为什么要这么做

虽然我们可以使用 `BuildRequires: foo-devel` 这种写法，但这种方法可移植性较差。当软件包名称发生变化，或者所需的 pkgconfig 模块后续由不同的软件包提供时，这些硬编码的依赖关系就会失效。

不过，如果是出于其它（而不是 pkgconfig 模块本身）的原因而需要按包名称来声明对这些软件包的依赖的话，仍然是可以的。

## 示例

如果一个软件包进行构建时需要链接 openssl 库，那么应该这样声明依赖关系:

```specfile
BuildRequires:  pkgconfig(openssl)
```

这样声明是不推荐的:

```specfile
BuildRequires:  openssl-devel
```

这样，即使其 `.pc` 模块将来由一个不同名称的软件包提供时，该依赖关系也将继续保持正确。

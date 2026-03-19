---
id: buildsystemmeson
title: Meson
description: 这个文档讲述了在 openRuyi 打包时，如何使用名为 meson 的声明式构建系统。
slug: /guide/packaging-guidelines/BuildSystems/meson
---

# Meson

这个文档讲述了在 openRuyi 打包时，如何使用名为 `meson` 的声明式构建系统。

meson 是一个开源构建系统，致力于实现极致的构建速度和用户体验。当你的软件项目使用 [meson](https://mesonbuild.com/) 作为构建系统时，我们推荐使用 `BuildSystem:  meson`，以便利用其提供的标准化构建流程和宏支持。

## 依赖

如需要使用 `meson` 构建系统，那么需要添加这些 `BuildRequires`。

```specfile
BuildRequires:  meson
```

## 示例

假设原有的编译 (`%build`) 配置如下：

```specfile
%build
%meson -Dman=enabled -Dcompat-symlink=true -Dwtmpdbd=enabled
%meson_build
```

使用 meson 构建系统后，因为我们有新增的配置部分 (`%conf`)，所以需要将选项参数编写到对应的位置，修改为如下:

```specfile
BuildOption(conf): -Dman=enabled
BuildOption(conf): -Dcompat-symlink=true
BuildOption(conf): -Dwtmpdbd=enabled
```

因为 `%meson_build` 部分无任何附加参数，故无 `BuildOption(build)`，也无需有单独的 `%build` 配置部分。

假设原有的安装 (`%install`) 配置如下:

```specfile
%install
%meson_install
mkdir -p %{buildroot}%{_mandir}/man1
ln -sf ../man8/wtmpdb.8 %{buildroot}%{_mandir}/man1/last.1
```

同样的，因为 `%meson_install` 部分无任何附加参数，故不需要添加`BuildOption(install)`，它之后的指令，根据需要该移动到 `%install -a` 区段去。

```specfile
%install -a
mkdir -p %{buildroot}%{_mandir}/man1
ln -sf ../man8/wtmpdb.8 %{buildroot}%{_mandir}/man1/last.1
```

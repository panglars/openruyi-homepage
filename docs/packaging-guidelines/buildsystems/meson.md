---
id: buildsystemmeson
title: Meson
description: This document explains how to use the declarative build system, meson, when packaging for openRuyi.
slug: /guide/packaging-guidelines/BuildSystems/meson
---

# Meson

The openRuyi packaging guide describes how to use the declarative `meson` build system when packaging software.

Meson is an open-source build system that delivers excellent build performance and a smooth user experience. When the software you package uses [Meson](https://mesonbuild.com/) as its build system, we recommend using `BuildSystem: meson` to take advantage of its standardized build workflow and macro support.

## Dependencies

To use the `meson` build system, add the following `BuildRequires`:

```specfile
BuildRequires:  meson
```

## Example

Suppose the original build configuration in `%build` is as follows:

```specfile
%build
%meson -Dman=enabled -Dcompat-symlink=true -Dwtmpdbd=enabled
%meson_build
```

After switching to the declarative `meson` build system, because the build process now features a dedicated configuration phase (`%conf`), you must move the option arguments to the corresponding section and write them as follows:

```specfile
BuildOption(conf): -Dman=enabled
BuildOption(conf): -Dcompat-symlink=true
BuildOption(conf): -Dwtmpdbd=enabled
```

Since `%meson_build` does not take any additional arguments here, your configuration requires no `BuildOption(build)` entries, and you do not need a separate `%build` section.

Now, suppose the original install configuration in `%install` is as follows:

```specfile
%install
%meson_install
mkdir -p %{buildroot}%{_mandir}/man1
ln -sf ../man8/wtmpdb.8 %{buildroot}%{_mandir}/man1/last.1
```

Likewise, since `%meson_install` does not take any additional arguments in the current installation scenario, you do not need to add `BuildOption(install)`. Instead, move any commands that follow the `%meson_install` macro to the `%install -a` section as needed.

```specfile
%install -a
mkdir -p %{buildroot}%{_mandir}/man1
ln -sf ../man8/wtmpdb.8 %{buildroot}%{_mandir}/man1/last.1
```

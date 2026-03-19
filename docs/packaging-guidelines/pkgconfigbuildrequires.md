---
id: pkgconfigbuildrequires
title: Using pkgconfig(xxx)
description: This document describes the openRuyi policy for specifying development library dependencies in the BuildRequires field.
slug: /guide/packaging-guidelines/PkgConfigBuildRequires
---

# Using pkgconfig(xxx)

This document describes the openRuyi policy for specifying development library dependencies in the `BuildRequires` field.

When a package depends on a library `foo` that the build system discovers through `pkg-config` during the build process, you should express the build dependency as `pkgconfig(foo)`.

## Why We Recommend This Approach

Although you can technically write dependencies in the form: `BuildRequires: foo-devel`, this approach is less portable and more fragile.

Package names may change over time, or a different package may later provide the corresponding pkg-config module. When you hard-code dependencies using package names, such changes can break the dependency declaration.

Using `pkgconfig(foo)` instead ensures that the package manager resolves the dependency via the pkg-config module rather than a specific package name, making it more robust and future-proof.

However, if you must declare a dependency for reasons unrelated to the pkg-config module itself (for example, when the build requires specific files or tools from that package), it is still acceptable to depend directly on the package name.

## Example

If a package needs to link against the OpenSSL library during the build process, you should declare the dependency as:

```specfile
BuildRequires:  pkgconfig(openssl)
```

We do not recommend the following form:

```specfile
BuildRequires:  openssl-devel
```

With the `pkgconfig(openssl)` form, the dependency will continue to resolve correctly even if a differently named package provides the `.pc` module in the future.

---
id: reviewguidelines
title: Package Review Guidelines
description: This document describes openRuyi’s policy for reviewing packages.
slug: /guide/review/ReviewGuidelines
---

# Package Review Guidelines

This document describes openRuyi’s policy for reviewing packages.

Reviewers should use this guide to review package pull requests (PRs). Please note that we cannot provide an exhaustive checklist covering every case, but we aim to make this document as comprehensive as reasonably possible. Whenever an issue is unclear, both reviewers and contributors (packagers) should exercise their best judgment.

## Items Reviewers Must Check

This list helps new reviewers identify what they should pay attention to, but it does not cover everything. Reviewers should always apply sound judgment when reviewing packages.

Contributors and reviewers must follow these requirements:

* The packager must run `rpmlint` on the source RPM and on all binary RPMs produced by the build. The packager should attach its output to the PR.

* The packager must ensure the spec file is clear and easy to read.

* Packagers must write the spec file in American English.

* The source code that the packager uses to build the package must match the upstream source referenced by the spec file’s `URL` field references.

* The package must successfully compile and build binary RPMs on `riscv64`.

* The packager must list all build dependencies in the `BuildRequires` field.

* The spec file must handle localization files correctly. In other words, the packager should use `%find_lang` rather than `%{_datadir}/locale/*`.

* Packagers must place large documentation files in a `-doc` subpackage. The packager uses their own judgment to define "large," considering not only file size but also the quantity of documentation.

* Packagers must place development files in a `-devel` package.

* Packagers must place static libraries in a `-static` package.

* Packagers must not list the same file more than once in the spec file's `%files` section, except when handling license texts in specific cases.

* Packagers must set file permissions correctly. For example, executable files must have the executable bit set.

* Packages must not contain any `.la` libtool archive files. If the build process generates such files, the packager must remove them in the spec file.

  * In most cases, the build process already removes these files automatically.

* All filenames in RPM packages must be valid UTF-8.

Reviewers and packagers should also consider the following points:

* Reviewers should test whether the package builds successfully in `mock`.

* The placement of `pkgconfig` (`.pc`) files depends on their intended use. In most cases, they serve development purposes, so packagers should place them in the `-devel` package. A reasonable exception is when the main package itself is a development tool that does not form part of the end-user runtime environment, such as `gcc` or `gdb`.

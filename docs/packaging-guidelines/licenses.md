---
id: licenses
title: Licenses
description: This document describes the licensing mechanism used by openRuyi.
slug: /guide/packaging-guidelines/Licenses
---

# Licenses

This document describes the licensing mechanism used by openRuyi.

## License Texts

If the source package includes the full text of its license in a separate file, the packager must include that file (that is, the file containing the package’s license text) in the `%files` list and mark it with the `%license` directive.

Note that the paths packagers mark in this way may be either relative or absolute. For relative paths, RPM automatically copies them from the source tree into a subdirectory of `%_defaultlicensedir` (`/usr/share/licenses`). For absolute paths, RPM simply marks the file as a license file in the final package.

Packagers can also mark license files in a programmatically generated file list that they then include via `%files -f`. In such cases, macros often perform the marking automatically, and the packager may not see it directly. When a user runs `rpm -q --licensefiles`, RPM displays all license files included in the package.

## Subpackages

If a subpackage depends, either implicitly or explicitly, on a base package (where we define the base package as a final binary package that the build process produces from the same source RPM, which contains the appropriate license text that the packager marks as `%license`), then that subpackage does not need to include the same license text again as `%license`.

However, if a subpackage is independent of any base package (that is, it does not depend on the base package, either implicitly or explicitly), it must include a copy of any applicable license text for the files that the subpackage contains, provided that such license text exists in the source.

## The `License` tag

Every spec file must contain a `License` tag, and the packager must make every reasonable effort to ensure that it is accurate.

Packagers must write the `License` tag using the appropriate [SPDX License Expressions](/governance/legal/spdx) or SPDX expression.

### Basic Rule

Unless a package produces multiple binary subpackages and the packager chooses to specify them separately, the expression in the `License` tag should enumerate all licenses present in the package source code. This rule excludes licenses that apply only to source code material that the build process does not copy into the binary RPM, whether verbatim or in transformed form (for example, through compilation).

#### Simple Case

The `MIT` license entirely covers the source code for the `wayland-utils` package. Its `License` tag is:

```specfile
License:        MIT
```

#### A More Complex Case

The `plasmatube` package contains executable code that the compiler builds primarily from source files using the `GPL-3.0-or-later` license, although one compiled source file uses the `GPL-2.0-or-later` license. It also includes an `appdata.xml` file that declares the `CC0-1.0` license (assuming copyright applies to this file) and an SVG file that uses the `CC-BY-SA-4.0` license. Its `License` tag is therefore:

```specfile
License:        GPL-3.0-or-later AND GPL-2.0-or-later AND CC0-1.0 AND CC-BY-SA-4.0
```

#### Source Files Not Included in the Binary RPM

Packagers must exclude from the `License` tag any licenses that apply only to files in the source package that the build process does not copy into the binary RPM. Consider the `xmodmap` package:

The `xmodmap` binary RPM ships an executable and a man page derived from files in the `xmodmap` source code, which use the `MIT` and `MIT-open-group` licenses. However, the source tarball in the `xmodmap` SRPM also contains many Automake, Autoconf, and other build-related files that various other licenses partially cover. Since the build process copies none of those files into the binary RPM, packagers must not include the corresponding licenses in the `License` tag. Therefore, the `License` tag is:

```specfile
License:        MIT AND MIT-open-group
```

### Special Rule for Perl Module Packages

Many Perl modules state that they use the same licensing terms as Perl 5. The authors distribute Perl 5 itself under a dual license, which packagers can express in SPDX form as: `GPL-1.0-or-later OR Artistic-1.0-Perl`.

### Public Domain

For software packages in the public domain, if the upstream code merely states “This code is in the public domain” without using a formal legal instrument such as CC0, the packager may write the `License` tag as:

```specfile
License:        LicenseRef-openRuyi-Public-Domain
```

If the upstream project explicitly uses Creative Commons Zero (CC0) to dedicate its work to the public domain, then the packager should use the official SPDX identifier in the `License` tag:

```specfile
License:        CC0-1.0
```

If the author explicitly uses the Unlicense template, then the packager should write the `License` tag as:

```specfile
License:        Unlicense
```

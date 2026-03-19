---
id: languagesperl
title: Perl
description: This document describes the packaging guidelines for Perl modules in openRuyi.
slug: /guide/packaging-guidelines/languages/Perl
---

# Perl Packaging Guidelines

This document describes the packaging guidelines for Perl modules in openRuyi.

## Package Naming

You should name Perl module packages in the form of `perl-CPANDIST`, where `CPANDIST` is the name of the CPAN distribution you are packaging.

In rare cases, if you must split a CPAN distribution into smaller subpackages due to dependency relationships or similar reasons, you should name the additional subpackages `perl-CPANDIST-Something`.

Examples:

* `perl-Archive-Zip` (`Archive-Zip` is the CPAN distribution name)

* `perl-Cache-Cache` (`Cache-Cache` is the CPAN distribution name)

## License Tag

Many Perl module authors simply declare the same licensing terms as Perl 5. Since the Perl Foundation distributes Perl 5 itself under a dual license, you can express this with the SPDX expression: `GPL-1.0-or-later OR Artistic-1.0-Perl`

## URL Tag

For CPAN-based packages, the `URL` tag should use a non-versioned `metacpan.org` URL. For example, when you package the `Net::XMPP` module, the URL should be:

```specfile
URL:            https://metacpan.org/release/Net-XMPP
```

## Build Dependencies

Below is a list of Perl-related build dependencies you may need.

* `perl-devel` — Provides Perl header files. If you build architecture-specific code that links against libperl.so, such as XS-based Perl modules, you must include `BuildRequires: perl-devel`.

* `perl-macros` — Provides a set of RPM macros required for packaging Perl modules. These macros define standard installation paths such as `%perl_vendorarch` and `%perl_vendorlib`, as well as helper functions such as `%perl_gen_filelist` and `%perl_requires`. When you package Perl modules, you must include `BuildRequires: perl-macros` so that the spec file can correctly parse and use these macros.

If your package requires specific Perl modules at build time, use the `perl(MODULE)` form. This rule also applies to core modules that Perl itself ships with, as upstream developers may move them into or out of the base Perl package over time.

## Requires and Provides Tags

Likewise, when writing `Requires` and `Provides`, you should use the `perl(MODULE)` form rather than depending directly on package names.

For example, a package requiring the Perl module `CPANDIST` should not explicitly require `perl-CPANDIST`; instead, it should require `perl(CPANDIST)`, because the `perl-CPANDIST` package will provide that dependency.

## File Listings

In general, a noarch Perl module package must include:

```specfile
%{perl_vendorlib}/*
```

An architecture-specific Perl module package must include:

```specfile
%{perl_vendorarch}/*
```

## `.h` Files in Module Packages

If a Perl module includes `.h` files, you should not split them into a `-devel` subpackage.

## Automated Import

openRuyi currently provides a small tool, cpan2spec, for importing CPAN packages. openRuyi adapted this tool from Steven Pritchard’s `cpanspec` to suit its needs. We gratefully acknowledge his contribution.

For example, to package the Perl module `IO::String`:

```specfile
perl ./cpan2spec IO-String
```

`cpanspec` will download the source tarball from CPAN and analyze it. It will first create a `library-perl` directory, then create a subdirectory named `perl-IO-String` under it, and finally generate a spec file with the same name inside that directory.

At present, this tool still has some issues with license parsing. When this happens, it will emit a corresponding message. In such cases, please check the license information manually and correct the `License` field as needed.

## RPM Macros for Perl Modules

This section lists some commonly used RPM macros for Perl module packaging.

### %perl_sitearch

This macro points to the architecture-dependent library path for modules installed locally by the administrator or through CPAN, which is `/usr/local/lib/perl5`.

### %perl_sitelib

This macro points to the architecture-independent library path for modules installed locally by the administrator or through CPAN, which is `/usr/local/share/perl5`.

### %perl_vendorarch

This macro points to the architecture-dependent library path for modules packaged and provided by openRuyi: `/usr/lib/perl5/vendor_perl`.

### %perl_vendorlib

This macro points to the architecture-independent library path for modules packaged and provided by openRuyi: `/usr/share/perl5/vendor_perl`.

### %perl_archlib

This macro points to the architecture-dependent core library path shipped with Perl itself: `/usr/lib/perl5`.

### %perl_privlib

This macro points to the architecture-independent core library path shipped with Perl itself: `/usr/share/perl5`.

### %perl_make_install

This macro correctly performs the `make install` step.

### %perl_process_packlist and %perl_gen_filelist

These macros prepare Perl-module-related files for the final packaging stage. If you use these macros, you can directly use `-f %{name}.files` in the `%files` section.

For example:

```specfile
%install
%perl_make_install
%perl_process_packlist
%perl_gen_filelist

%files -f %{name}.files
%doc Changes README
```

However, `%perl_gen_filelist` does not collect files that the build process did not actually install.

### %perl_version

This macro expands to the version of the current Perl interpreter, for example, `5.43.2`.

### %perl_requires

You typically use this macro when you require a dependency on the current Perl version.

### %__perl

This macro expands to the name of the `perl` executable installed on the system.

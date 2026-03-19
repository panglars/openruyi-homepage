---
id: buildsystem
title: Declarative Build Systems
description: This document explains the declarative build system.
slug: /guide/packaging-guidelines/BuildSystems
---

# Declarative Build Systems

Most software follows common build patterns, such as the classic `./configure && make && make install` workflow. In an RPM `spec` file, maintainers typically need to place these steps in their respective sections. Together with the source unpacking step, this often results in a large amount of boilerplate code. Across many `spec` files, this boilerplate is nearly identical, with only occasional minor adjustments to accommodate distribution preferences or other details.

To reduce this repetitive boilerplate, openRuyi recommends using the declarative build system, a new feature supported in RPM 4.20 and later. This mechanism allows developers to define these common steps for each build system centrally. When packaging software, maintainers only need to declare the build system they use and, when necessary, provide additional switches or parameters for specific steps.

## Usage

In the simplest case, a `spec` file only needs to include a build system declaration, for example: `BuildSystem: autotools`.

That said, cases requiring manual fine-tuning are also quite common. In general, packagers have two ways to achieve this.

### Prepend or append

Packagers may use prepend and append operations as needed.

* For example, if packagers need to initialize environment variables before the build step, they can add `%build -p` and write the corresponding commands inside it. Here, `-p` stands for *prepend*, meaning the build system inserts the commands before the automatically generated script.

* Likewise, if packagers need to remove a file after the install step, they can add `%install -a` and write the necessary commands inside it. Here, `-a` stands for *append*, meaning the build system adds the commands after the automatically generated script.

### Passing additional parameters

If packagers need to pass additional parameters, such as build configuration options, they can use the `BuildOption` tag. The syntax is: `BuildOption(<section>):  <option string>`.

This tag may appear any number of times in the `spec` file for each section. For example:

```specfile
BuildOption(conf):  --enable-zsh-secure-free
BuildOption(conf):  --enable-gdbm
BuildOption(build):  all info html
BuildOption(install):  install.info
BuildOption(install):  fndir=%{_datadir}/%{name}/functions
BuildOption(install):  runhelpdir=%{_datadir}/%{name}/help
```

Please note that you must leave two spaces between the colon (`:`) and the option string that follows.

Although RPM syntax allows packagers to omit the build stage name after `BuildOption`, openRuyi requires them to specify it explicitly.

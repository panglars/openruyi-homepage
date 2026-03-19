---
id: scriptlets
title: Scripts
description: This document describes the policy and conventions that openRuyi uses for writing scripts that run during package installation and removal.
slug: /guide/packaging-guidelines/Scriptlets
---

# Scripts

This document describes the policy and conventions that openRuyi uses for writing scripts that run during package installation and removal.

In an RPM spec file, several sections allow a package to execute code during installation or removal. Developers collectively refer to these sections as scriptlets.

In openRuyi, all scriptlets may assume `bash` executes them unless the package author explicitly uses another programming language.

## Syntax

The basic syntax is similar to other spec file sections, such as `%build`, `%install`, and related blocks.

Scriptlets support a special `-p` flag that allows the script section to execute a single program directly, without spawning a shell. For example: `%post -p /usr/bin/ldconfig`.

Scriptlets also receive a parameter passed by the controlling `rpmbuild` process. This parameter (accessible via `$1`) indicates how many packages with the same name will remain on the system after the operation completes.

For the common cases of installation, upgrade, and removal, the values are as follows:

|              | install   | upgrade   | uninstall |
| ------------ | --------- | --------- | --------- |
| `%pretrans`  | `$1 == 1` | `$1 == 2` | (N/A)     |
| `%pre`       | `$1 == 1` | `$1 == 2` | (N/A)     |
| `%post`      | `$1 == 1` | `$1 == 2` | (N/A)     |
| `%preun`     | (N/A)     | `$1 == 1` | `$1 == 0` |
| `%postun`    | (N/A)     | `$1 == 1` | `$1 == 0` |
| `%posttrans` | `$1 == 1` | `$1 == 2` | (N/A)     |

Note that if the system installs multiple versions of the same package simultaneously (this primarily occurs with packages that support parallel installation, such as kernels and multilib packages, but can also happen if an upgrade fails partway through), these values may differ.

Therefore, in `%pre` and `%post` scriptlets, we recommend using a conditional such as the following rather than explicitly checking whether the value equals `2`:

```bash
%pre
if [ "$1" -gt 1 ] ; then
  ...
fi
```

All scriptlets must terminate with an exit status of `0`. Since RPM does not pass the `-e` option to the shell when executing shell scriptlets by default, the exit status of the final command the script executes determines the overall exit status of the scriptlet, except when authors make explicit `exit` calls, a practice we discourage.

The examples in this document append `|| :` to most commands. This pattern suppresses non-zero exit codes by executing `:`, a shell builtin equivalent to `/bin/true`. Developers commonly apply this technique to the final command in a scriptlet.

However, note that in some situations other forms of error handling may be more appropriate. In particular, developers should not use this pattern for prerequisite commands that must succeed. You should therefore apply it with care depending on the specific context.

If a scriptlet terminates with a non-zero exit status, it may disrupt the ongoing installation, upgrade, or removal operation. Such a disruption can trigger cascading issues—for example, during an upgrade, RPM might fail to remove the old package version correctly, leaving duplicate entries in the RPM database (rpmdb) and potentially leaving obsolete files on the filesystem that no package owns anymore.

In some cases, if execution continues after a scriptlet failure, the process might partially corrupt the installation result, or the system configuration may remain incomplete. Generally, such problems affect only the package itself. In contrast, if the system dynamically removes packages during a transaction and execution continues after failures occur, this may lead to broader system-level inconsistencies.

## Execution Order

The `%pre` and `%post` scriptlets run before and after package installation, respectively.

The `%preun` and `%postun` scriptlets run before and after package removal.

The `%pretrans` and `%posttrans` scriptlets run at the beginning and the end of an RPM transaction, respectively.

During an upgrade, scriptlets execute in the following order:

1. `%pretrans` of the new package

2. `%pre` of the new package

3. (install the new package)

4. `%post` of the new package

5. `%triggerin` of other packages (triggered by installation of the new package)

6. `%triggerin` of the new package (if any trigger evaluates to true)

7. `%triggerun` of the old package (if triggered by removal of the old package)

8. `%triggerun` of other packages (triggered by removal of the old package)

9. `%preun` of the old package

10. (remove the old package)

11. `%postun` of the old package

12. `%triggerpostun` of the old package (if triggered by removal of the old package)

13. `%triggerpostun` of other packages (if triggered by removal of the old package)

14. `%posttrans` of the new package

Note that the `%pretrans` scriptlet runs before the system installs any new packages. This means it cannot rely on package dependencies being available.

For this reason, we generally discourage the use of `%pretrans`.

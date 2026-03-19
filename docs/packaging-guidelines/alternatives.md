---
id: alternatives
title: Alternatives
description: This document describes the Alternatives mechanism in openRuyi.
slug: /guide/packaging-guidelines/Alternatives
---

# Alternatives

This document describes the Alternatives mechanism in openRuyi.

The Alternatives mechanism allows administrators to install packages implementing the same functionality in parallel. It achieves this by maintaining multiple sets of symbolic links—one set for each package—that point to files managed by the alternatives system.

## When to use this mechanism

You may use this mechanism when a piece of software can serve as a drop-in replacement, and its functionality is sufficiently similar to that of other variants such that, within reasonable expectations, neither users nor other programs need to know which variant currently runs on the system.

In addition, the system administrator must choose the variant system-wide, and should neither expect nor intend for end users to switch between variants themselves.

## How to use it

If a package chooses to use the alternatives system, you must instead install any files that would otherwise conflict with an appropriate suffix. For example, install the file as `%{_bindir}/sendmail.postfix` rather than `%{_bindir}/sendmail`.

You must then create the original path with `touch` (for example, `touch %{_bindir}/sendmail`).

After that, you must mark the link that the alternatives system manages as `%ghost` in the `%files` list and add the appropriate `Requires` dependencies.

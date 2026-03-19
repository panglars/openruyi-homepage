---
id: spdx
title: SPDX License Expressions
description: SPDX (Software Package Data Exchange) is a standard format for communicating information about software packages, including their components and metadata.
slug: /legal/spdx
---

# SPDX License Expressions

SPDX (Software Package Data Exchange) is a standard format for communicating information about software packages, including their components and metadata.

## Types of SPDX License Expressions

### SPDX License List Identifiers

The community commonly refers to these as “SPDX identifiers”; they are the short-form identifiers included in the SPDX License List. Examples include `MIT` and `GPL-2.0-or-later`.

### Custom License Identifiers (`LicenseRef-`)

You may form a custom license identifier using the `LicenseRef-` prefix for licenses that the SPDX License List does not include. Note that SPDX currently does not define an official namespace system for `LicenseRef-` identifiers.

### `WITH` Expressions

You may form a compound SPDX expression by taking an SPDX identifier, followed by the `WITH` operator, and then an exception identifier. The `WITH` operator modifies the underlying license grant by adding a licensing exception or additional permission. You will most commonly see this with licenses in the GPL family. Examples include `GPL-2.0-or-later WITH Autoconf-exception-generic` and `Apache-2.0 WITH LLVM-exception`.

### `OR` Expressions

You may form a compound SPDX expression by joining two SPDX expressions with the `OR` operator. The `OR` operator expresses a choice of licenses. In free and open source software (FOSS), the community commonly refers to a choice between exactly two licenses as “dual licensing.” However, people sometimes use that term more broadly or differently. Examples include `Apache-2.0 OR MIT` (common licensing forms for Rust crates) and `MPL-1.1 OR GPL-2.0-or-later OR LGPL-2.1-or-later` (which developers historically known as the Mozilla tri-license).

### `AND` Expressions

You may form a compound SPDX expression by joining two SPDX expressions with the `AND` operator. The `AND` operator typically indicates that the different sub-expressions apply to different parts of a file or package. An example is `LGPL-2.1-or-later AND GPL-2.0-or-later AND MIT`.

### The `+` Operator

When you apply the suffix operator `+` to an SPDX identifier, it indicates that the license also permits later versions. For example: `LPPL-1.3a+`.

At the request of the Free Software Foundation (FSF), SPDX no longer recommends using `+` with GPL-family license identifiers, and instead prefers the `-only` and `-or-later` variants, such as `GPL-2.0-only` and `GPL-2.0-or-later`.

## SPDX Matching Guidelines

Templates define SPDX License List identifiers; developers specify these templates in XML files within the maintained [license-list-XML](https://github.com/spdx/license-list-XML/tree/main/src) repository. Many of these XML files use regular expressions and mark certain portions of the license text as optional. As the matching guidelines in the [SPDX Specification](https://spdx.github.io/spdx-spec/latest/annexes/license-matching-guidelines-and-templates/) define, multiple license texts may match the same SPDX identifier. The XML files do not directly implement all aspects of the matching guidelines.

When using SPDX identifiers and `LicenseRef-` identifiers, openRuyi aims to apply the SPDX matching guidelines.

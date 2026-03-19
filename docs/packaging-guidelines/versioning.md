---
id: versioning
title: Version Numbers
description: This document describes the openRuyi policy for the Version, Release, and Epoch tags.
slug: /guide/packaging-guidelines/Versioning
---

# Version Numbers

This document describes the openRuyi policy for the `Version`, `Release`, and `Epoch` tags.

The `Version` tag contains the upstream project's version, while the `Release` tag specifies the downstream release number.

## Definitions

Some upstream projects effectively treat each commit as a version. Some upstreams never make formal releases and instead expect users to obtain the code directly from the source repository at any time.

* **Release version**: A software version that upstream developers intentionally designate and publish as an official release. The release process may be very simple, such as merely adding a tag in a Git repository. The definition of a release version also includes so-called *point releases* or *patch-level releases* that some upstreams produce, provided developers assign them a version number and officially publish them.

* **Snapshot**: A source archive that you take from upstream source control (such as Git) that developers do not associate with any formal release version.

* **Prerelease version**: Before a final release, many upstreams first decide on the new version number and then publish versions such as *alpha*, *beta*, or *release candidate* (RC). Although these builds already carry the upcoming version number, they explicitly indicate that they are not yet final. We refer to these as prerelease versions. We also consider any snapshots that developers produce in the period leading up to an upstream release to be prerelease versions.

## The `Version` tag

The `Version` tag defines the package version. The following table provides a quick reference:

| **Case**                                         | **Normalization rule**                   | **Example (upstream → Spec)**                                                     |
| ------------------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------- |
| Contains only dots (`.`)                         | Retain the upstream version as-is        | zstd: 1.5.7<br />`1.5.7` → `1.5.7`                                                |
| Includes pre-release markers `alpha`/`beta`/`rc` | Convert to lowercase and prefix with `~` | libffi: v3.5.0-rc1<br />`Version: 3.5.0~rc1`                                       |
| Contains hyphen (`-`)                            | Replace `-` with `.`                     | ImageMagick: 7.1.1-44<br />`7.1.1-44` → `7.1.1.44`                                |
| Contains underscore (`_`)                        | Replace `_` with `.`               | postgres: 17_6<br />`17_6` → `17.6`                                              |
| Date-based version with dots                     | Retain the upstream version as-is        | u-boot: 2025.07<br />`2025.07` → `2025.07`                                        |
| VCS commit-hash-based version                    | Format as `0+<vcs><YYYYMMDD>.<hash7>`    | gn: ee5b7e32b961a9da1933e9f46a018ba6cac8ef60<br />`Version: 0+git20250808.ee5b7e3` |

Most upstream versioning schemes are straightforward: they consist of one or more version components separated by dots. Each component is an integer, possibly with leading zeros. A component may also include one or more ASCII letters (uppercase or lowercase).

In general, a component's value must never decrease unless a component to its left increases.

For versioning schemes of this kind, you may use the upstream version literally in the `Version` tag. Do not strip leading zeros.

### Cases Where the Versioning Scheme Is More Complex

The approach above does not apply in the following situations:

* The upstream never defines formal version numbers and provides only snapshots for packaging.

* RPM's version comparison algorithm cannot correctly order the upstream versioning scheme.

* You need to package a prerelease version.

* The upstream had followed a consistent naming scheme, but then suddenly changed the rules in a way that breaks version ordering.

In such cases, you must adapt the upstream version so that you can use it correctly in the `Version` tag.

#### Using Tilde for Prerelease Versions

Packagers specifically use a tilde (`~`) for prerelease versions that would not sort correctly otherwise. When you place it before a version component, it causes that component to sort earlier than any equivalent component without a tilde.

For example, suppose the upstream release sequence is `0.4.0`, `0.4.1`, `0.5.0-rc1`, `0.5.0-rc2`, `0.5.0`. Then you should write the two release candidates in the `Version` tag as `0.5.0~rc1` and `0.5.0~rc2`.

#### Using Dots for Post-Release Patch Versions

Packagers use a dot (`.`) for bug-fix or patch-level versions that the upstream publishes. You may need to replace the separator the upstream uses (for example `-`) or an underscore (`_`) with a dot (`.`), or remove it entirely.

For example, if upstream publishes `0.5.0-post1` as a post-release fix, you should write it in the `Version` tag as `0.5.0.post1`. Note that `0.5.0.post1` sorts lower than both `0.5.1` and `0.5.0.1`.

#### Snapshots from Projects That Have Never Made a Release

When an upstream project has never assigned a version number, the `Version` tag must begin with the digit `0`, followed by a plus sign (`+`), and then a snapshot information tag.

Packagers may append up to 17 characters of additional information in this snapshot tag to indicate the version control system (VCS) and the commit identifier.

The snapshot information tag should use the following format: `<scm><date>.<revision>`

* `<scm>` is a short string identifying the upstream VCS, such as `git`, `svn`, `hg`, or `snap`.

* `<date>` is an 8-digit date in `YYYYMMDD` format that represents the packaging date of the current package.

* `<revision>` is a short Git commit hash, a Subversion revision number, or another identifier that helps locate the exact snapshot in the VCS. If the VCS does not provide such an identifier (for example, CVS), you should omit this part.

:::info Note

You should not use the full hash value for `<revision>` to avoid making the `Version` tag excessively long. In most cases, the first 7 to 10 characters are sufficient.

:::

#### Projects That Used to Release Versions but Later Only Provide Snapshots

When an upstream project previously assigned version numbers but later stops making new releases for some reason, the `Version` tag should begin with the last upstream version number, followed by a plus sign (`+`) and a snapshot information tag.

In this case, the snapshot information tag should use the same format: `<scm><date>.<revision>`

* `<scm>` is a short string identifying the upstream VCS, such as `git`, `svn`, `hg`, or `snap`.

* `<date>` is an 8-digit date in `YYYYMMDD` format that represents the packaging date of the current package.

* `<revision>` is a short Git commit hash, a Subversion revision number, or another identifier that helps locate the exact snapshot in the VCS. If the VCS does not provide such an identifier (for example, CVS), you should omit this part.

:::info Note

You should not use the full hash value for `<revision>` to avoid making the `Version` tag excessively long. In most cases, the first 7 to 10 characters are sufficient.

:::

#### When Upstream Breaks the Versioning Scheme

An upstream project may suddenly adopt a completely different versioning scheme, or even reset the version number to a lower value. If none of the methods above can produce a new `Version` value that sorts correctly, or if the new version would sort lower than an already existing package version, then your only solution is to increase the `Epoch` tag.

## The `Epoch` tag

Packagers usually use the `Epoch` tag to resolve version-ordering ambiguities. You should introduce or increment it only when necessary to avoid versioning problems.

Once you introduce an `Epoch` tag for a package, you must never remove it or decrease its value.

## The `Release` tag

The `Release` tag defines the package release number. Its default value should be an integer starting from `1` (not `0`), and you must increment it each time you revise the package downstream, that is, each time the downstream distribution repackages the software.

Whenever the `Version` tag changes, you must reset the numeric part of `Release` to `1`.

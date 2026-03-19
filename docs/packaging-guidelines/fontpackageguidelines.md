---
id: fontpackageguidelines
title: Font Packaging Guidelines
description: This document describes the font packaging guidelines for openRuyi.
slug: /guide/packaging-guidelines/FontPackagingGuidelines
---

# Font Packaging Guidelines

This document describes the font packaging guidelines for openRuyi.

## Package Naming

You should name all font packages in the form of `fonts-fontname`, where `fontname` is the font’s canonical identifier.

This name may refer to the OpenType name table of the font file, especially the Family or Typographic Family entry. However, if this conflicts with the upstream project name, the upstream project name takes precedence.

If the upstream project has long used a certain abbreviation, or if a de facto abbreviation has already become established in the Linux ecosystem and is unlikely to conflict with other font projects, you may use such an abbreviation. For example, you may abbreviate `WenQuanYi` as `wqy`, so the package name becomes `fonts-wqy`.

## Licensing

Always keep in mind: never package proprietary fonts that forbid redistribution.

When introducing a font package, you should prefer fonts released under licenses such as OFL or GPL.

## Build

When packaging fonts, if the upstream provides a source package, you should build the font files from source.

If you cannot build the font files from source, you may use the upstream-provided font archive directly.

If the fonts released in the upstream archive do not belong to the same font family, you must split them into separate font packages.

## Installation Paths

Install system-wide fonts under `%{_datadir}/fonts` and organize them by container type:

* Install OpenType TT (`*.ttf` / `*.ttc`) under `%{_datadir}/fonts/truetype`.

* Install OpenType CFF/CFF2 (`*.otf` / `*.otc`) under `%{_datadir}/fonts/opentype`.

Since fontconfig recursively scans its default search paths and maintains caches accordingly, this directory hierarchy does not affect font discovery.

### Bitmap Fonts

We handle bitmap fonts in two categories. You should generally not package the latter unless strictly necessary:

* Install OpenType bitmap fonts (`*.otb`) intended for modern fontconfig/Xft environments under `%{_datadir}/fonts/misc`.

* If you need to install accompanying X11 bitmap font files (`*.pcf` / `*.bdf`), you may place them in the same directory.

* For bitmap fonts intended for legacy Core X11 fonts (XLFD) in `*.pcf` format, you must first compress them with `gzip` and then install them by resolution under `%{_datadir}/fonts/X11/100dpi/` or `%{_datadir}/fonts/X11/75dpi/`. Install low-resolution or monospaced grid fonts under `%{_datadir}/fonts/X11/misc/`.

* If the upstream provides the font in `*.bdf` format, you must convert it to `*.pcf`.

  * Do not depend on legacy fonts by default, and do not preinstall them.

### Type 1

Although Type 1 (`*.pfa` / `*.pfb`) is a legacy format and FreeType still supports it, many modern applications have gradually dropped support for it. If the upstream also provides an OpenType TT or CFF/CFF2 version, you should package the OpenType version by preference.

Where packaging Type 1 fonts is necessary, install them under `%{_datadir}/fonts/type1`.

If the font provides metric files (`*.afm`), you must package them in the same directory as the font.

### Exceptions

You must not install Linux console fonts (`*.psf`) and web fonts (`*.woff` / `*.woff2`) in directories that fontconfig can discover.

Keeping these files out of fontconfig's reach is especially important for web fonts: the WOFF specification explicitly states that it is “not recommended” to treat WOFF as a desktop-installable font format.

* Install console fonts (`*.psf`) under `%{_datadir}/consolefonts`.

* Install web fonts (`*.woff`) under `%{_datadir}/webfonts`.

## Subpackage Splitting and Naming

If the upstream provides multiple font formats, the main font package should act as a metapackage and should not directly contain font files.

We recommend the following split:

* `fonts-fontname-vf` (variable fonts): contains VF font files, typically VF variants of `.ttf` or `.otf`.

  * In addition, the metapackage may include `Requires: fonts-fontname-vf`.

* `fonts-fontname-static` (static fonts): contains non-VF font files, typically non-variable `.ttf` or `.otf`.

  * In some cases, the upstream may provide only collection files (`*.ttc` / `*.otc`). In such cases, you may instead name the subpackage `fonts-fontname-ttc` or `fonts-fontname-otc`.

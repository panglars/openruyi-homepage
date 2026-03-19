---
id: langpacks
title: Language Packs
description: This document describes openRuyi's policy for language packs.
slug: /guide/packaging-guidelines/LangPacks
---

# Language Packs

This document describes openRuyi's policy for language packs.

The idea behind *language packs (langpacks)* is to split translation files or other language-specific content into separate subpackages.

openRuyi provides an RPM macro named `%find_lang`. The `%find_lang` macro locates all relevant localization files and writes the resulting list of files to a separate output file. **You can then use that file list** during packaging to include all localization files.

You should invoke the `%find_lang` macro in the `%install` section of the spec file, after the build process installs all files into the buildroot.

## Recommended Usage

openRuyi generally recommends the following usage in a spec file:

```specfile
%install
# ...
%find_lang %{name} --generate-subpackages

%files -f %{name}.lang
```

This command searches for all language files associated with `%{name}` and automatically defines and generates a standard subpackage for each language it finds (for example, `%{name}-lang-de`, `%{name}-lang-fr`, `%{name}-lang-zh_CN`, and so on). The macro then automatically assigns the corresponding language files to their respective subpackages.

## General Usage

If you cannot use the recommended approach for some reason, you may use the general usage instead:

```specfile
%install
# ...
%find_lang xxx

%files -f xxx.lang
```

You should also add a comment to explain why you are not using the recommended approach.

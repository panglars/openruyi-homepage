---
id: langpacks
title: 语言包
description: 这个文档讲述了 openRuyi 的语言包策略。
slug: /guide/packaging-guidelines/LangPacks
---

# 语言包

这个文档讲述了 openRuyi 的语言包策略。

“语言包 (langpacks)” 背后的理念是，将翻译文件或特定语言内容的文件分离到子软件包中。

openRuyi 包含了一个 RPM 宏变量叫做 `%find_lang`。`%find_lang` 会定位所有相关的本地化文件，并将这些文件的列表输出到一个单独的文件中。该列表随后可用于在打包过程中包含所有的本地化文件。

`%find_lang` 宏应当在 spec 文件的 `%install` 章节中、所有文件都已安装到构建根目录 (buildroot) 之后执行。

## 推荐用法

在 spec 文件中，通常应使用如下用法：

```specfile
%install
# ...
%find_lang %{name} --generate-subpackages

%files -f %{name}.lang
```

该命令会查找所有`%{name}` 相关的语言文件，并为找到的每一种语言自动定义并生成一个标准的子软件包 (例如 `%{name}-lang-de`, `%{name}-lang-fr`, `%{name}-lang-zh_CN` 等)，之后自动将对应的语言文件归入其所属的子包中。

## 一般用法

如果出于某种原因无法使用推荐的用法，可以使用一般的用法：

```specfile
%install
# ...
%find_lang xxx

%files -f xxx.lang
```

你需要添加注释说明不使用推荐用法的理由。

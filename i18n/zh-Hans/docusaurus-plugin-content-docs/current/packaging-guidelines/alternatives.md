---
id: alternatives
title: 替代系统
description: 这个文档讲述了 openRuyi 的替代系统 (Alternatives) 机制。
slug: /guide/packaging-guidelines/Alternatives
---

# 替代系统

这个文档讲述了 openRuyi 的替代系统 (Alternatives) 机制。

替代系统 (Alternatives) 机制提供了一种方法，允许提供相同功能的软件包实现并行安装。它通过维护多组符号链接  (每个软件包对应一组) 来实现这一目的，这些链接指向受"替代系统"管理的文件。

## 何时可以使用这个机制

当软件能够作为可替换组件 (drop-in replacement) 使用，并且其功能与其他变体十分相似，从而用户和其他程序在合理范围内不需要知道当前安装的是哪一个变体；

并且，由系统管理员在全系统范围内选择变体，而终端使用者无需也不会切换不同变体。

## 如何使用

如果一个包选择使用替代系统，则原本可能冲突的文件必须用适当的后缀安装（例如：`%{_bindir}/sendmail.postfix` 而不是 `%{_bindir}/sendmail`），原始位置必须使用 touch 被创建（例如：`touch %{_bindir}/sendmail`），然后由替代系统机制设置的链接必须在 %files 列表中标记为 %ghost，并且必须添加适当的 `Requires` 依赖。


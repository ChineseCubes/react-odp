#!/usr/bin/env lsc
require! through

re = /\\u([a-f0-9]+)/ig
codepoints = {}

process.stdin
  .pipe through do
    -> while re.exec it => codepoints["#{RegExp.$1}"] := true
    -> @queue Object.keys(codepoints)sort!join "\n"
  .pipe process.stdout

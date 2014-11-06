#!/usr/bin/env lsc
require! through

re = /\\u([a-f0-9]+)/ig

process.stdin
  .pipe through do
    -> while re.exec it => @queue "#{RegExp.$1},"
    -> @queue "\b"
  .pipe process.stdout

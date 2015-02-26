#!/usr/bin/env lsc
require! {
  through
  punycode: { ucs2 }
  rsvp: { Promise, all }:RSVP
  'prelude-ls': { filter, unique }
}

running-as-script = not module.parent

###
# What's the complete range for Chinese characters in Unicode?
# http://stackoverflow.com/questions/1366068/whats-the-complete-range-for-chinese-characters-in-unicode
##
# Block                                   Range       Comment
# CJK Unified Ideographs                  4E00-9FFF   Common
# CJK Unified Ideographs Extension A      3400-4DFF   Rare
# CJK Unified Ideographs Extension B      20000-2A6DF Rare, historic
# CJK Compatibility Ideographs            F900-FAFF   Duplicates, unifiable variants, corporate characters
# CJK Compatibility Ideographs Supplement 2F800-2FA1F Unifiable variants
codepoints = (str, done) -> new Promise (resolve, reject) ->
  ucs2.decode(str) |> filter (-> it >= 0x3400) |> unique |> resolve

if running-as-script
  RSVP.on \error console.error
  todo = ''
  process.stdin
    .pipe through do
      -> todo += it
      -> codepoints todo .then ~>
        @queue it.join "\n"
    .pipe process.stdout
else
  module.exports = codepoints

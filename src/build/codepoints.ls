#!/usr/bin/env lsc
require! {
  through
  punycode: { ucs2 }
  rsvp: { Promise, all }
  'prelude-ls': { filter, unique }
}

running-as-script = not module.parent

codepoints = (str, done) -> new Promise (resolve, reject) ->
  ucs2.decode(str) |> filter (-> it >= 0x3400) |> unique |> resolve

if running-as-script
  todo = ''
  process.stdin
    .pipe through do
      -> todo += it
      -> codepoints todo .then ~>
        @queue it.join "\n"
    .pipe process.stdout
else
  module.exports = codepoints

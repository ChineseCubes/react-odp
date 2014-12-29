#!/usr/bin/env lsc
require! {
  through
  rsvp: { Promise, all }
}

running-as-script = not module.parent

re = /\\u([a-f0-9]+)/ig

codepoints = (str, done) -> new Promise (resolve, reject) ->
  cpts = {}
  while re.exec str => cpts["#{RegExp.$1}"] := true
  cpt-array = Object.keys(cpts)sort!
  done? cpt-array
  resolve cpt-array

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

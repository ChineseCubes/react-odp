#!/usr/bin/env lsc
# XXX: This file should be merged to the source repo later.
require! {
  request
  through
  rsvp: { Promise, all }:RSVP
  'json-stable-stringify': stringify
}

running-as-script = not module.parent

moedict = (todo, done) -> new Promise (resolve, reject) ->
  count = 0
  fetched = {}
  for let c in todo
    return ++count if c in <[\r \n]>
    err, res, body <~ request "https://www.moedict.tw/~#{ encodeURIComponent c }.json"
    if not err and res.statusCode is 200
      moe = JSON.parse body
      fetched[c] =
        'zh-TW': moe.title
        'zh-CN': moe.heteronyms.0.alt or moe.title
        pinyin:  moe.heteronyms.0.pinyin - /<br>.*/
        en:      moe.translation?English?join(\,)?split(/,\w*?/) or []
    if ++count is todo.length # end
      done? fetched
      resolve fetched

if running-as-script
  RSVP.on \error -> console.error it.stack
  todo = []
  process.stdin
    .pipe through do
      -> for it.toString! => todo.push ..
      -> moedict todo, ~> @queue stringify it, space: 2
    .pipe process.stdout
else
  module.exports = moedict

#!/usr/bin/env lsc
require! {
  request
  through
  'json-stable-stringify': stringify
}

todo = []
process.stdin
  .pipe through do
    -> for it.toString! => todo.push ..
    ->
      count = 0
      fetched = {}
      for let c in todo
        err, res, body <~ request "https://www.moedict.tw/~#{ encodeURIComponent c }.json"
        if not err and res.statusCode is 200
          moe = JSON.parse body
          fetched[c] =
            'zh-TW': moe.title
            'zh-CN': moe.heteronyms.0.alt or moe.title
            pinyin:  moe.heteronyms.0.pinyin - /<br>.*/
            en:      moe.translation?English?join(\,)?split(/,\w*?/) or []
        if ++count is todo.length # end
          return @queue stringify fetched, space: 2
  .pipe process.stdout

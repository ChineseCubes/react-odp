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
        switch c
          | \种
            fetched[c] =
              'zh-TW': \種
              'zh-CN': \种
              pinyin: 'zhǒng'
              en: ['kind']
            if ++count is todo.length
              return @queue stringify fetched, space: 2
          | \见
            fetched[c] =
              'zh-TW': \見
              'zh-CN': \见
              pinyin: 'jiàn'
              en: ['to see']
            if ++count is todo.length
              return @queue stringify fetched, space: 2
          | \来
            fetched[c] =
              'zh-TW': \來
              'zh-CN': \来
              pinyin: 'lái'
              en: ['to come']
            if ++count is todo.length
              return @queue stringify fetched, space: 2
          | \鹅
            fetched[c] =
              'zh-TW': \鵝
              'zh-CN': \鹅
              pinyin: 'é'
              en: ['goose']
            if ++count is todo.length
              return @queue stringify fetched, space: 2
          | \请
            fetched[c] =
              'zh-TW': \請
              'zh-CN': \请
              pinyin: 'qǐng'
              en: ['to invite']
            if ++count is todo.length
              return @queue stringify fetched, space: 2
          | \头
            fetched[c] =
              'zh-TW': \頭
              'zh-CN': \头
              pinyin: 'tóu'
              en: ['classifier for objects']
            if ++count is todo.length
              return @queue stringify fetched, space: 2
          | \队
            fetched[c] =
              'zh-TW': \隊
              'zh-CN': \队
              pinyin: 'duì'
              en: ['group']
            if ++count is todo.length
              return @queue stringify fetched, space: 2
          | \们
            fetched[c] =
              'zh-TW': \們
              'zh-CN': \们
              pinyin: 'mén'
              en: ['nouns referring to individuals']
            if ++count is todo.length
              return @queue stringify fetched, space: 2
          | otherwise
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

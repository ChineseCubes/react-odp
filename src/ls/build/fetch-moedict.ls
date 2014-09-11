#!/usr/bin/lsc
require! <[fs request colors]>
{filter, unique, omit} = require \lodash
stringify = require \json-stable-stringify
Data      = require '../CUBEBooks/data'

if not process.argv.2
  [,filename] = /.*\/(.*)/exec process.argv.1
  console.log "Usage: #filename <path>"
  process.exit 0

path = Data.unslash process.argv.2
path-master = "#path/masterpage.json"

if not fs.existsSync path-master
  console.error "masterpage.json not found"
  process.exit 1

chars = ''
{setup}:mp = Data.patchMasterPage require path-master
for i from 1 to setup.total-pages
  page = Data.patchPageJSON require "#path/page#i.json"
  Data.traverse page, ->
    chars += it.text if it.text

counter = 0
fetched = {}
chars = unique Array::slice.call(chars)
        |> unique
        |> filter _, (-> 0x4E00 <= it.charCodeAt 0)
for let c in chars
  err, res, body <- request "https://www.moedict.tw/~#c.json"
  fetched[c] = if not err and res.statusCode is 200
    process.stdout.write c.green
    moe = JSON.parse body
    zh_TW:  moe.title
    zh_CN:  moe.heteronyms.0.alt or moe.title
    pinyin: moe.heteronyms.0.pinyin
    en:     moe.translation.English.join(\,)split(/,\w*?/)
  else
    process.stdout.write c.red
    null
  if ++counter is chars.length
    process.stdout.write "\n"
    result = omit fetched, (!)
    fs.writeFileSync "#path/dict.json", stringify(result, space: 2)

#!/usr/bin/env lsc
require! {
  fs
  path
  request
  colors
  lodash: { filter, unique, omit }
  'json-stable-stringify': stringify
  '../CUBE/data': Data
}

if not process.argv.2
  {1:filename} = /.*\/(.*)/exec process.argv.1
  console.log "Usage: ./#filename [book path]"
  process.exit 0

src = path.resolve process.argv.2
src-master = "#src/masterpage.json"

if not fs.existsSync src-master
  console.error "masterpage.json not found"
  process.exit 1

chars = ''
{setup}:mp = Data.patchMasterPage require src-master
for i from 1 to setup.total-pages
  page = Data.patchPageJSON require "#src/page#i.json"
  Data.traverse page, ->
    chars += it.text if it.text

counter = 0
fetched = {}
chars = unique Array::slice.call(chars)
        |> unique
        |> filter _, (-> 0x4E00 <= it.charCodeAt 0)
/**
for c in chars
  hex = parseInt(c.charCodeAt 0, 10)toString 16
  console.log """
    <item href="strokes/#{hex}.json"
          id="strokes-#{hex}-json" media-type="application/json" />
  """
/**/
/**
for c in chars
  hex = parseInt(c.charCodeAt 0, 10)toString 16
  console.log "cp ../../zh-stroke-data/json/#{hex}.json ./strokes/"
/**/
/**/
for let c in chars
  err, res, body <- request "https://www.moedict.tw/~#{ encodeURIComponent c }.json"
  fetched[c] = if not err and res.statusCode is 200
    process.stdout.write c.green
    moe = JSON.parse body
    'zh-TW': moe.title
    'zh-CN': moe.heteronyms.0.alt or moe.title
    pinyin:  moe.heteronyms.0.pinyin
    en:      moe.translation.English.join(\,)split(/,\w*?/)
  else
    process.stdout.write c.red
    null
  if ++counter is chars.length
    process.stdout.write "\n"
    result = omit fetched, (!)
    fs.writeFileSync "#src/dict.json", stringify(result, space: 2)
/**/

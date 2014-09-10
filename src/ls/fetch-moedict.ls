require! <[fs request]>
Data = require './CUBEBooks/data'

path = Data.unslash (process.argv.2 or '../../demo')

chars = ''
{setup}:mp = Data.patchMasterPage require "#path/masterpage.json"
for i from 1 to setup.total-pages
  page = Data.patchPageJSON require "#path/page#i.json"
  Data.traverse page, ->
    chars += it.text if it.text and 256 < it.text.charCodeAt 0

fetched = []
dir = "#path/dict"
fs.mkdirSync dir if not fs.existsSync dir
for c in Array::slice.call chars
  continue if c in fetched
  fetched.push c
  let c
    err, res, body <- request "https://www.moedict.tw/~#c.json"
    data = JSON.parse body
    return if err or res.statusCode isnt 200
    process.stdout.write c
    fs.writeFileSync "#dir/#c.json", JSON.stringify(data, null, 2)

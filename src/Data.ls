require! {
  request
  'prelude-ls': { id, filter }
  './utils': {
    unslash
    strip:tagless
    splitNamespace
    camelFromHyphenated
    noto-name
  }
}

slice = Array::slice

get = (uri, done) ->
  request do
    method: \GET
    uri: uri
    (err, res, body) ->
      | err                     => done err
      | res.statusCode isnt 200 => done new Error "not OK: #{res.statusCode}"
      | otherwise               => done err, body

Data =
  getMasterPage: (path, done) ->
    path = unslash path
    get "#path/masterpage.json" (err, data) ->
      done Data.patchMasterPage JSON.parse(data), path
  patchMasterPage: ({attrs}:mp, path) ->
    width  = parseInt attrs['FO:PAGE-WIDTH'],  10
    height = parseInt attrs['FO:PAGE-HEIGHT'], 10
    orientation = attrs['STYLE:PRINT-ORIENTATION']
    ratio = if orientation is \landscape then width / height else height / width
    mp.setup =
      path:   path
      ratio:  ratio
      x:      0cm
      y:      0cm
      width:  width
      height: height
      total-pages: attrs['TOTAL-PAGES']
    mp
  getPresentation: (path, pages, done) ->
    children = []
    counter = 0
    got-one = (data, i) ->
      children[i] = data
      counter += 1
      if counter is pages.length
        done do
          name:      \presentation
          namespace: \office
          attrs:
            style:
              left:   0
              top:    0
              width:  \28cm
              height: \21cm
          children: children |> filter id #to drop undefineds
    for let i in pages
      err, data <- get "#path/page#i.json"
      got-one JSON.parse(data), i - 1

module.exports = Data


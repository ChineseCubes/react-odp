require! {
  'prelude-ls': { id, filter }
  './async': { lift, get, get-json }
}

slice = Array::slice

get-master = lift (uri) -> patch-master get-json "#uri/masterpage.json"

patch-master = lift ({ attrs }:master) ->
  width  = parseInt attrs['FO:PAGE-WIDTH'], 10
  height = parseInt attrs['FO:PAGE-HEIGHT'], 10
  orientation = attrs['STYLE:PRINT-ORIENTATION']
  ratio = if orientation is \landscape then width / height else height / width
  master.setup =
    ratio:  ratio
    x:      0cm
    y:      0cm
    width:  width
    height: height
    total-pages: +attrs['TOTAL-PAGES']
  master

wrap-presentation = lift (pages) ->
  name:      \presentation
  namespace: \office
  attrs:
    style:
      left:   0
      top:    0
      width:  \28cm
      height: \21cm
  children: pages |> filter id #to drop undefineds

# XXX: or just a `lift replace`?
patch-page = lift (page, old-one, new-one) ->
  data = JSON.stringify page
  JSON.parse data.replace old-one, new-one

module.exports = {
  get-master
  wrap-presentation
  patch-page
}


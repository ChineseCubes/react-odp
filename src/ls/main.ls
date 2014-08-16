data <- $.getJSON './json/page1.json'
data = page: data

config =
  # right click a slide -> Slide -> Page Setup
  # FIXME: should get these informations from JSON
  page-setup:
    ratio:  4 / 3
    x:      0
    y:      0
    width:  28
    height: 21

#CUBEBooks.each data, !(value, name, parents) ->
#  if name is 'page-thumbnail' and parents[*-1] is 'notes'
#    cm = CUBEBooks.numberFromCM x
#    {x, y, width, height} = value['@attributes']
#    config.page-setup =
#      x:      cm x
#      y:      cm y
#      width:  cm width
#      height: cm height

tree = CUBEBooks.map data, ->
  cm = CUBEBooks.numberFromCM
  v = it['@attributes']
  return {} if not v
  v.x      = 100 * cm(v.x)      / config.page-setup.width  if v.x
  v.y      = 100 * cm(v.y)      / config.page-setup.height if v.y
  v.width  = 100 * cm(v.width)  / config.page-setup.width  if v.width
  v.height = 100 * cm(v.height) / config.page-setup.height if v.height
  v

page = React.renderComponent do
  CUBEBooks.Page data: tree.0
  $ \#wrap .get!0

do resize = ->
  ratio = config.page-setup.ratio
  width  = $(window).width!
  height = $(window).height!
  if width / ratio < height
    page.setProps do
      width:  width
      height: width / ratio
  else
    page.setProps do
      width:  height * ratio
      height: height
$ window .resize resize


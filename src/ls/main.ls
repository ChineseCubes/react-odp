data <- $.getJSON './json/page1.json'
data['@attributes'] <<< do
  x: 0
  y: 0
  width:  \28cm
  height: \21cm
data = page: data

config =
  # right click a slide -> Slide -> Page Setup
  # FIXME: should get these informations from JSON
  page-setup:
    ratio:  4 / 3
    x:      0cm
    y:      0cm
    width:  28cm
    height: 21cm

#ODP.each data, !(value, name, parents) ->
#  if name is 'page-thumbnail' and parents[*-1] is 'notes'
#    cm = CUBEBooks.numberFromCM x
#    {x, y, width, height} = value['@attributes']
#    config.page-setup =
#      x:      cm x
#      y:      cm y
#      width:  cm width
#      height: cm height

tree = ODP.map data, ->
  cm = ODP.numberFromCM
  v = it['@attributes']
  return {} if not v
  # ugly 0rz
  v.x      = 100 * cm(v.x)      / config.page-setup.width  if v.x
  v.y      = 100 * cm(v.y)      / config.page-setup.height if v.y
  v.width  = 100 * cm(v.width)  / config.page-setup.width  if v.width
  v.height = 100 * cm(v.height) / config.page-setup.height if v.height
  v.x      = "#{v.x}%"
  v.y      = "#{v.y}%"
  v.width  = "#{v.width}%"
  v.height = "#{v.height}%"
  v

console.log tree

viewer = React.renderComponent do
  ODP.Viewer do
    value:
      x:      0
      y:      0
      width:  100
      height: 100
    children: tree
  $ \#wrap .get!0

do resize = ->
  ratio = config.page-setup.ratio
  width  = $(window).width!
  height = $(window).height!
  v = viewer.props.value
  if width / ratio < height
    v
      ..width  = width
      ..height = width / ratio
    viewer.setProps value: v
  else
    v
      ..width  = height * ratio
      ..height = height
    viewer.setProps value: v
$ window .resize resize


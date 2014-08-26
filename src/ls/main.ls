config =
  # FIXME: office:automatic-styles > style:page-layout
  page-setup:
    ratio:  4 / 3
    x:      0cm
    y:      0cm
    width:  28cm
    height: 21cm

# test dpcm in current browser
dots = React.renderComponent do
  DotsDetector unit: \cm
  $ \#detector .get!0
dpcm = dots.state.x
console.log "dpcm: #dpcm"

getPages = (done) ->
  pages = []
  counter = 0
  got-one = (data, i) ->
    data.attrs.y = "#{i * 21.5}cm" # hack hack
    pages.push data
    counter += 1
    if counter is 8
      done do
        name:     \presentation
        x:        \0
        y:        \0
        width:    \28cm
        height:   \21cm
        children: pages
  for let i from 1 to 8
    CUBEBooks.getPageJSON "./json-v2.1/page#i.json", -> got-one it, i - 1

data <- getPages
viewer = ODP.renderComponent data, $(\#wrap)get!0
/**
 * custom components
 **
viewer.setProps do
  components:
    p: React.createClass do
      displayName: \CustomP
      render: ->
        React.DOM.div do
          style:
            width:      100
            height:     100
            background: \red
 */
do resize = ->
  ratio     = config.page-setup.ratio
  px-width  = config.page-setup.width  * dpcm
  px-height = config.page-setup.height * dpcm
  width  = $(window).width!
  height = $(window).height!
  s = if width / ratio < height
    width / px-width
  else
    height / px-height
  viewer.setProps scale: s
$ window .resize resize


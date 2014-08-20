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
  ODP.DotsDetector unit: \cm
  $ \#detector .get!0
dpcm = dots.state.x
console.log "dpcm: #dpcm"

# FIXME: should be CUBEBooks.getPages
getPages = (done) ->
  pages = []
  counter = 0
  got-one = (data, i) ->
    data.0.attrs.y = "#{i * 21.5}cm" # hack hack
    pages.push data.0
    counter += 1
    if counter is 8
      done do
        tag-name: \presentation
        x:        \0
        y:        \0
        width:    \28cm
        height:   \21cm
        children: pages
  for let i from 1 to 8
    ODP.getPageJSON "./json/page#i.json", -> got-one it, i - 1

data <- getPages
viewer = React.renderComponent do
  ODP.Presentation data
  $ \#wrap .get!0
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


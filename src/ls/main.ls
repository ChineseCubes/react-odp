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

#data <- ODP.getPageJSON './json/page1.json'
#data <- ODP.getPageJSON './json/page2.json'
data <- ODP.getPageJSON './json/page3.json'
viewer = React.renderComponent do
  ODP.Presentation do
    name:   \presentation
    value:
      x:      \0
      y:      \0
      width:  \28cm
      height: \21cm
    children: data
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


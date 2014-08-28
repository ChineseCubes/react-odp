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

data <- CUBEBooks.getPresentation './json'
###
# custom components
###
/**
time = 0
requestAnimationFrame update = ->
  time += 1/60s
  time %= 18s
  requestAnimationFrame update
data <<< do
  renderProps: (props) ->
    if props.text
      text = props.text
      delete props.text
      #ODP.components.span do
      #  props
      #  ReactVTT.IsolatedCue do
      #    target: './json/demo.vtt'
      #    #index: span-count++
      #    match: text
      #    currentTime: -> time
    else
      ODP.renderProps props
/**/
viewer = ODP.renderComponent data, $(\#wrap)get!0

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


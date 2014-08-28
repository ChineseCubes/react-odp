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
viewer = ODP.renderComponent data, $(\#wrap)get!0
###
# custom components
###
/**/
time = 0
requestAnimationFrame update = ->
  time += 1/60s
  time %= 18s
  requestAnimationFrame update
viewer.setProps do
  renderProps: (props) ->
    if props.data.text
      text = props.data.text
      delete props.data.text
      ODP.components.span do
        props
        ReactVTT.IsolatedCue do
          target: './json/demo.vtt'
          match: text
          currentTime: -> time
    else
      ODP.renderProps props
/**/

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


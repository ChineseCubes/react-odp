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

data <- CUBEBooks.getPresentation './json-v2.1'
viewer = ODP.renderComponent data, $(\#wrap)get!0
/**
 * custom components
 **/
time = 0
requestAnimationFrame update = ->
  time += 1/60
  time %= 10
  requestAnimationFrame update
viewer.setProps do
  #shouldRenderChild: (props) -> if props.name is 'p' then false else true
  renderWithComponent: (props) ->
    if props.name is 'span' and 'text-box' in props.parents
      ReactVTT.IsolatedCue do
        target: './assets/demo.vtt'
        index: 0
        currentTime: -> time
    else
      ODP.renderWithComponent props
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


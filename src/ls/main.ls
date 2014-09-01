config =
  # FIXME: office:automatic-styles > style:page-layout
  page-setup:
    ratio:  4 / 3
    x:      0cm
    y:      0cm
    width:  28cm
    height: 21cm

resize = (dpcm) ->
  ratio     = config.page-setup.ratio
  px-width  = config.page-setup.width  * dpcm
  px-height = config.page-setup.height * dpcm
  width  = $(window).width!
  height = $(window).height!
  if width / ratio < height
    width / px-width
  else
    height / px-height

# test dpcm in current browser
dots = React.renderComponent do
  DotsDetector unit: \cm
  $ \#detector .get!0
dpcm = dots.state.x
console.log "dpcm: #dpcm"

# audio for testing
#audio-control = React.renderComponent do
#  CUBEBooks.AudioControl!
#  $ \#audio .get!0
audio = $ \audio .get!0

data <- CUBEBooks.getPresentation './json'
viewer = React.renderComponent do
  ODP.components.presentation do
    scale: resize dpcm
    data:  data
    /**/
    renderProps: (props) ->
      if props.data.name is 'image' and
         props.data.attrs.onclick is 'activity'
        attrs = props.data.attrs
        delete attrs.href
        delete attrs.onclick
        ODP.components.image do
          props
          CUBEBooks.AudioControl element: audio
      else if props.data.text
        text = props.data.text
        delete props.data.text
        ODP.components.span do
          props
          ReactVTT.IsolatedCue do
            target: './json/demo.vtt'
            match: text
            currentTime: -> audio.current-time
      else
        ODP.renderProps props
    /**/
  $(\#wrap)get!0
$ window .resize -> viewer.setProps scale: resize dpcm

/**/
time = 0
requestAnimationFrame update = ->
  time += 1/60s
  time %= 18s
  requestAnimationFrame update
/**/


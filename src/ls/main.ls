config =
  # FIXME: office:automatic-styles > style:page-layout
  page-setup:
    ratio:  4 / 3
    x:      0cm
    y:      0cm
    width:  28cm
    height: 21cm
    page-number: 8
  path: './demo'

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

audio = $ \audio .get!0

stroke = ->
  ss = new zh-stroke-data.SpriteStroker it, url: '../../strokes/'
  console.log ss, ss.sprite
  $('#strokes')
    .empty!
    .append ss.dom-element
  ss.play!

settings-button = React.renderComponent do
  CUBEBooks.SettingsButton!
  $ '#settings' .get!0

data <- Data.getPresentation config.path, config.page-setup.page-number
Data.buildSyntaxTreeFromNotes data
viewer = React.renderComponent do
  ODP.components.presentation do
    scale: resize dpcm
    data:  data
    /**/
    renderProps: (props) ->
      data  = props.data
      attrs = data.attrs
      switch
      | data.name is 'image' and attrs.name is 'activity'
        delete attrs.href
        delete attrs.onClick
        ODP.components.image do
          props
          CUBEBooks.AudioControl element: audio
      | data.name is 'span' and data.text
        text = props.data.text
        delete props.data.text
        attrs.onClick = ->
          seg <- Data.getSegmentations text
          sentence = React.renderComponent do
            CUBEBooks.Sentence data: seg
            $ '#control > .content' .get!0
          settings-button.setProps onClick: sentence.toggleSettings
          $ '#control' .modal 'show'
          stroke text.replace /，|。|？/g -> ''
        ODP.components.span do
          props
          ReactVTT.IsolatedCue do
            target: "#{config.path}/demo.vtt"
            match: text
            currentTime: -> audio.current-time
      | otherwise => ODP.renderProps props
    /**/
  $(\#wrap)get!0
$ window .resize -> viewer.setProps scale: resize dpcm


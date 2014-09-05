config = path: './demo'

{attrs} <- $.get "#{config.path}/masterpage.json"
width  = parseInt attrs['FO:PAGE-WIDTH'], 10
height = parseInt attrs['FO:PAGE-HEIGHT'], 10
orientation = attrs['STYLE:PRING-ORIENTATION']
ratio = if orientation is \landscape then width / height else height / width
config <<< do
  page-setup:
    ratio:  ratio
    x:      0cm
    y:      0cm
    width:  width
    height: height
    total-pages: attrs['TOTAL-PAGES']

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

settings-button = React.renderComponent do
  CUBEBooks.SettingsButton!
  $ '#settings' .get!0

data <- Data.getPresentation config.path, config.page-setup.total-pages
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


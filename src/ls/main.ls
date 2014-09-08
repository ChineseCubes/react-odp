config = path: './demo'

<- window.requestAnimationFrame
<- $
{attrs} <- $.getJSON "#{config.path}/masterpage.json"
width  = parseInt attrs['FO:PAGE-WIDTH'], 10
height = parseInt attrs['FO:PAGE-HEIGHT'], 10
orientation = attrs['STYLE:PRINT-ORIENTATION']
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
if location.search is /([1-9]\d*)/ or location.href is /page([1-9]\d*)/
  page = RegExp.$1
  data.children = [data.children[ ($('#wrap').data('page') || page) - 1 ]]
  data.children.0.attrs.y = 0
  forced-dpcm = 0.98
viewer = React.renderComponent do
  ODP.components.presentation do
    scale: forced-dpcm or resize dpcm
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

if forced-dpcm
  $.fn.modal = ->
    @fadeIn \fast
    @css marginTop: \-200px, opacity: 0.9
    $('#wrap').css \opacity 0.5
    @on \click \.close ~> $('#wrap').css \opacity 1 @fadeOut \fast
    $('#wrap').one \click ~> $('#wrap').css \opacity 1 @fastOut \fast
else
  $ window .resize -> viewer.setProps scale: resize dpcm

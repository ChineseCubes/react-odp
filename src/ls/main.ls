{zipObject} = _

<- window.requestAnimationFrame
<- $
{setup}:mp <- Data.getMasterPage './LRRH/'

resize = (dpcm) ->
  ratio     = setup.ratio
  px-width  = setup.width  * dpcm
  px-height = setup.height * dpcm
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

data <- Data.getPresentation mp
segs <- Data.Segmentations data, setup.path
vtt  <- ReactVTT.parse "#{setup.path}/audio.vtt"

ranges = for cue in vtt.cues
  [cue.startTime * 1000, (cue.endTime - cue.startTime) * 1000]

settings-button = React.renderComponent do
  CUBEBooks.SettingsButton!
  $ '#settings' .get!0

if location.search is /([1-9]\d*)/ or location.href is /page([1-9]\d*)/
  page = RegExp.$1
  data.children = [data.children[ ($('#wrap').data('page') || page) - 1 ]]
  data.children.0.attrs.y = 0
  forced-dpcm = 0.98
# XXX: should not share information this way
audio = new Howl urls: ["#{setup.path}/audio.mp3"]
counter = 0
ranges = []
sprite = {}
current-sprite = null
audio.on \end -> current-sprite := null
viewer = React.renderComponent do
  ODP.components.presentation do
    scale: forced-dpcm or resize dpcm
    data:  data
    renderProps: (props) ->
      data  = props.data
      attrs = data.attrs
      switch
      | data.name is 'image' and attrs.name is 'activity'
        delete attrs.href
        delete attrs.onClick
        comp = let counter
          range = start: Infinity, end: -Infinity
          while r = ranges.pop!
            range
              ..start = r.start if r.start < range.start
              ..end   = r.end   if r.end   > range.end
          sprite[counter] =
            [range.start * 1000, (range.end - range.start) * 1000]
          ODP.components.image do
            props
            CUBEBooks.AudioControl do
              id: counter
              audio: audio
              onClick: -> current-sprite := sprite[counter]
        ++counter
        comp
      | data.name is 'span' and data.text
        text = props.data.text
        delete props.data.text
        attrs.onClick = ->
          sentence = React.renderComponent do
            CUBEBooks.Sentence data: segs.get text
            $ '#control > .content' .get!0
          settings-button.setProps onClick: -> ...
          $ '#control' .modal \show
        for cue in vtt.cues
          if cue.text is text
            ranges.push do
              start: cue.startTime
              end:   cue.endTime
            break
        ODP.components.span do
          props
          ReactVTT.IsolatedCue do
            target: "#{setup.path}/audio.vtt"
            match: text
            currentTime: ->
              if current-sprite
                current-sprite.0 / 1000 + audio.pos!
              else
                0
      | otherwise => ODP.renderProps props
  $(\#wrap)get!0
  -> audio.sprite sprite

if forced-dpcm
  $.fn.modal = ->
    @fadeIn \fast
    @css marginTop: \-200px, opacity: 0.9
    $('#wrap').css \opacity 0.5
    @on \click \.close ~> $('#wrap').css \opacity 1 @fadeOut \fast
    $('#wrap').one \click ~> $('#wrap').css \opacity 1 @fastOut \fast
else
  $ window .resize -> viewer.setProps scale: resize dpcm

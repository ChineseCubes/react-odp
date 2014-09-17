{div, i, small} = React.DOM
{zipObject} = _

Main = React.createClass do
  displayName: \CUBE.Main
  getDefaultProps: ->
    master-page: null
    data: null
    segs: null
    vtt: null
    #pages: [1]
    pages: null
    auto-fit: on
    dpcm: 37.79527
  getInitialState: ->
    {setup} = @props.master-page
    audio = new Howl urls: ["#{setup.path}/audio.mp3"]
      .on \end ~> @state.current-sprite = null
    scale: @resize @props.dpcm
    audio: audio
    sprite: {}
    current-sprite: null
    text: ''
  componentWillMount: ->
    if window
      $ window .resize ~> @setState scale: @resize @props.dpcm
  componentDidMount: ->
    @state.audio.sprite @state.sprite
    if not @props.auto-fit
      $.fn.modal = ->
        @fadeIn \fast
        @css marginTop: \-200px, opacity: 0.9
        $('#wrap').css \opacity 0.5
        @on \click \.close ~> $('#wrap').css \opacity 1 @fadeOut \fast
        $('#wrap').one \click ~> $('#wrap').css \opacity 1 @fadeOut \fast
  resize: (dpcm) ->
    return 0.98 if not window or not @props.auto-fit
    $window = $ window
    {setup} = @props.master-page
    ratio     = setup.ratio
    px-width  = setup.width  * @props.dpcm
    px-height = setup.height * @props.dpcm
    width  = $window.width!
    height = $window.height!
    if width / ratio < height
      width / px-width
    else
      height / px-height
  render: ->
    {setup} = @props.master-page
    counter = 0
    ranges = []
    div do
      className: 'comp main'
      div do
        ref: \modal
        className: 'ui modal control'
        i className: 'close icon'
        div do
          className: 'header'
          CUBEBooks.SettingsButton do
            className: 'settings'
            onClick: ~>
              @refs.sentence.toggleSettings!
          'C'
          small null, 'UBE'
          'Control'
        div do
          className: 'content'
          CUBEBooks.Sentence do
            ref: \sentence
            data: @props.segs.get @state.text
      ODP.components.presentation do
        ref: \presentation
        scale: @state.scale
        data:  @props.data
        renderProps: (props) ~>
          @props.pages = [1 to setup.total-pages] if not @props.pages
          pages = @props.pages.map (-> "page#it")
          data  = props.data
          attrs = data.attrs
          switch
          | data.name is 'page'
            ODP.renderProps props if attrs.name in pages
          | data.name is 'image' and attrs.name is 'activity'
            delete attrs.href
            delete attrs.onClick
            comp = let counter
              range = start: Infinity, end: -Infinity
              while r = ranges.pop!
                range
                  ..start = r.start if r.start < range.start
                  ..end   = r.end   if r.end   > range.end
              if range.start > range.end
                range = range{start: end, end: start}
              @state.sprite[counter] =
                [range.start * 1000, (range.end - range.start) * 1000]
              ODP.components.image do
                props
                CUBEBooks.AudioControl do
                  id: counter
                  audio: @state.audio
                  onClick: ~>
                    @state.current-sprite = @state.sprite[counter]
            ++counter
            comp
          | data.name is 'span' and data.text
            text = props.data.text
            delete props.data.text
            attrs.onClick = ~>
              @setState text: text
              $ @refs.modal.getDOMNode!
                .modal detachable: false
                .modal \show
            for cue in @props.vtt.cues
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
                currentTime: ~>
                  if @state.current-sprite
                    @state.current-sprite.0 / 1000 + @state.audio.pos!
                  else
                    0
          | otherwise => ODP.renderProps props

<- window.requestAnimationFrame
<- $
# dots per cm
dots = React.renderComponent do
  DotsDetector unit: \cm
  $ \#detector .get!0
# read book data
{setup}:mp <- Data.getMasterPage './LRRH/'
data <- Data.getPresentation mp
segs <- Data.Segmentations data, setup.path
vtt  <- ReactVTT.parse "#{setup.path}/audio.vtt"

React.renderComponent do
  Main do
    master-page: mp
    data: data
    segs: segs
    vtt: vtt
    dpcm: dots.state.x
  $ \#wrap .get!0


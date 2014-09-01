{isArray, isString, cloneDeep} = _
{audio, div, source} = React.DOM
slice = Array.prototype.slice

audio-controls = []
AudioControl = React.createClass do
  displayName: \CUBEBooks.AudioControl
  getDefaultProps: ->
    element: null
  getInitialState: ->
    playing: false
  componentWillMount: ->
    audio-controls.push this
    @props.element.pause!
  time: ->
    @props.element?currentTime or 0
  toggle: ->
    if @props.element.paused
      @props.element.play!
    else
      @props.element.pause!
    for comp in audio-controls
      # FIXME: should not assume there is only one media element
      comp.setState playing: not @props.element.paused
  render: ->
    div do
      style:
        width:  '100%'
        height: '100%'
        background-color: if @state.playing then '#F90' else '#F60'
      onClick: @toggle

master-page =
  children:
    * name: 'draw:frame'
      attrs:
        'style-name': \Mgr3
        'text-style-name': \MP4
        x:      \0.19cm
        y:      \0.22cm
        width:  \1.41cm
        height: \1.198cm
      children:
        * name: 'draw:image'
          attrs:
            href: 'Pictures/100002010000002800000022F506C368.png'
            onclick: 'home'
          #children:
          #  * name: 'p'
          #    attrs:
          #      'style-name': \MP4
          #    children:
          #      * name: 'span'
          #        text: 'home'
          #      ...
          #  ...
        ...
    * name: 'draw:frame'
      attrs:
        'style-name': \Mgr4
        'text-style-name': \MP4
        x:      \26.4cm
        y:      \0.4cm
        width:  \1.198cm
        height: \1.198cm
      children:
        * name: 'draw:image'
          attrs:
            href: 'Pictures/1000020100000022000000223520C9AB.png'
            onclick: 'activity'
          #children:
          #  * name: 'p'
          #    attrs:
          #      'style-name': \MP4
          #    children:
          #      * name: 'span'
          #        text: 'activity'
          #      ...
          #  ...
        ...

utils =
  splitNamespace: ->
    r = it.toLowerCase!split(':')reverse!
    namespace: r.1
    name:      r.0
  getPresentation: (path, done) ->
    pages = []
    page-total = 8
    counter = 0
    got-one = (data, i) ->
      data.attrs.y = "#{i * 21.5}cm"
      pages.push data
      counter += 1
      if counter is page-total
        done do
          name:      \presentation
          namespace: \office
          attrs:
            x:      \0
            y:      \0
            width:  \28cm
            height: \21cm
          children:  pages
    for let i from 1 to page-total
      CUBEBooks.getPageJSON "#path/page#i.json", -> got-one it, i - 1
  getPageJSON: !(path, done) ->
    data <- $.getJSON path
    data.children = data.children.concat master-page.children
    [, dir] = /(.*\/)?(.*)\.json/exec(path) or [, '']
    done utils.transform data, (attrs = {}, node-name, parents) ->
      new-attrs = style: {}
      for k, v of attrs
        if not /^margin.*/.test k
          name = utils.splitNamespace(k)name
          switch name
          | 'page-width'  => new-attrs.width   = v
          | 'page-height' => new-attrs.height  = v
          | 'width'       => new-attrs.width   = v
          | 'height'      => new-attrs.height  = v
          | 'x'           => new-attrs.x       = v
          | 'y'           => new-attrs.y       = v
          | 'href'        => new-attrs.href    = v
          | 'onclick'     => new-attrs.onclick = v
          | otherwise     => new-attrs.style[ODP.camelFromHyphenated name] = v
      new-attrs
        ..href = "#dir#{new-attrs.href}" if new-attrs.href
  transform: (node, onNode = null, parents = []) ->
    utils.splitNamespace(node.name) <<< do
      text:      node.text
      attrs:     onNode? node.attrs, node.name, parents
      children: if not node.children then [] else
        for child in node.children
          utils.transform child, onNode, parents.concat [node.name]
  AudioControl: AudioControl

(this.CUBEBooks ?= {}) <<< utils

